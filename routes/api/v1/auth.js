const { prisma } = require('../../../db');
const {
    parseData,
    comparePwd,
    generateToken,
} = require('../../../utils/tools');
const router = require('express').Router();
/**
 * admin login   
 */
router.post('/admin_login',async (req, res) => {
    const {userName, password} = req.body;
    if(userName && password){
        const manager = await prisma.manager.findFirst({
            where:{
                userName,
            },
        });

        if(manager){
            comparePwd(password, manager.password, (isMatch) => {
                
                if(isMatch){
                    //使用JWT
                    const token = generateToken(manager);
                    res.json(parseData({token},true,'登录成功'));
                } else {
                    res.json(parseData('密码错误',false,'密码错误'));
                }
            });
        } else {
            res.json(parseData('用户不存在',false,'用户不存在'));
        }

} else {
    res.json(parseData('用户名和密码不能为空',false,'请输入用户名和密码'))
}
    
});
module.exports = router;
