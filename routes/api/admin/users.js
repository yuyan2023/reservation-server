/**
 * 列表
 * 新增
 * 修改
 * 修改密码
 * 获取单条记录
 * 获取当前登录的用户信息，通过token
 * 删除单个
 * 批量删除
 */
const router = require('express').Router();
const { parseData, encodedPwd, getUserId } = require('../../../utils/tools');
const { prisma } = require('../../../db');

/**
 * 列表
 */
router.get('/', async (req, res,next) => {
    try{
    const {page = 1, limit = 10} = req.query;
    const name = req.query.name;
    const count = await prisma.user.count({
        where:{
            userName: {
                contains: name,
            },
        },
    });
    const list = await prisma.user.findMany({
        where:{
            userName: {
                contains: name,
            },
        },
        skip: (page *1- 1) * limit,
        take: limit *1,
        //排序
        orderBy: {
            createdAt: 'desc'
        },
    });
    res.json(parseData({
        data: list.map(item => {
            delete item.password;
            return item;
        }),
        page: page * 1,
        pages: Math.ceil(count / limit),
        total:count,
    },
    true,'获取数据成功'
)
);
} catch (err) {
    next(err);
}
});

/**
 *  新增 
 * */
router.post('/', async (req, res, next) => {  
    encodedPwd(req.body.password, async (pwd) => {
        try{
            await prisma.user.create({
            data: {
                userName: req.body.userName,
                password: pwd,
                nickName: req.body.nickName,
                avatar: req.body.avatar,
            },
        });
        res.json(parseData({},true,'新增成功'));
        }catch(err){
          next(err)
        }
        
    });

});

/**
 * 根据一个id修改
 */
router.put('/:id', async (req, res,next) => {
    try{
        await prisma.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                nickName: req.body.nickName,
                avatar: req.body.avatar,
            },
        });
        res.json(parseData({},true,'修改成功'));

    }catch(err){
        next(err)
    }

})

/**
 * 修改密码
 */
router.put('/:id/reset_pwd', async (req, res, next) => {
    encodedPwd(req.body.password, async (pwd) => {
        try{
            await prisma.user.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    password: pwd,
                },
            });
            res.json(parseData({},true,'修改成功'));
        }catch(err){
            next(err)
        }
    });
});



/**
 * 获取单条记录,不包含密码
 */
router.get('/:id', async (req, res, next) => {
    try{
        const data = await prisma.user.findUnique({
            where: {
                id: req.params.id,
            },
        });
        delete data.password;
        res.json(parseData(data,true,'获取数据成功'));

    }catch(err){
        next(err)
    }

})

/**
 * 删除多个
 * 使用url传递参数，多个id之间使用逗号分隔
 * 例如：/delete_many?id=1,2,3
 */
router.delete('/delete_many', async (req, res) => {
    try{
        const { count} = await prisma.user.deleteMany({
            where: {
                id: {
                    in:req.query.id.split(',')
                }
            },
        });
        res.json(parseData(count,true,'删除多条成功'));

    }catch(err){
        next(err)
    }

})

/**
 * 删除单个
 */
router.delete('/:id', async (req, res,next) => { 
    try{
        await prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });
        res.json(parseData({},true,'删除成功'));
    }catch(err){
        next(err)
    }

    
})


module.exports = router;