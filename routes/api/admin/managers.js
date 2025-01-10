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
const { parseDate } = require('../../../utils/tools');
const { prisma } = require('../../../db');

/**
 * 列表
 */
router.get('/', async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const count = await prisma.manager.count();
    const list = await prisma.manager.findMany({
        where:{},
        skip: (page - 1) * limit,
        take: limit,
        //排序
        orderBy: {
            createdAt: 'desc'
        },
    });
    res.json(parseDate({
        data: list,
        page,
        pages: Math.ceil(count / limit),
        count,
    },
    true,'获取数据成功'
)
);

});

/**
 *  新增 
 * */
router.post('/', async (req, res) => {  

});

/**
 * 根据一个id修改
 */
router.put('/:id', async (req, res) => {

})

/**
 * 修改密码
 */
router.put('/:id/reset_pwd', async (req, res) => {

})

/**
 * 获取当前用户的登录信息，需要token
 */
router.get('/info', async(req,res) => {

})

/**
 * 获取单条记录,不包含密码
 */
router.get('/:id', async (req, res) => {

})

/**
 * 删除多个
 * 使用url传递参数，多个id之间使用逗号分隔
 * 例如：/delete_many?id=1,2,3
 */
router.delete('/delete_many', async (req, res) => {

})

/**
 * 删除单个
 */
router.delete('/:id', async (req, res) => { 
    
})


module.exports = router;