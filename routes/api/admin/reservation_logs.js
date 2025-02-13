/**
 * 列表
 * 分页
 * 名字，手机号查询
 * 根据用户id查找,主要用在用户列表上的查看预约记录功能
 * 根据预约id查找，预约信息列表上的查看预约记录功能
 * 修改
 * 删除单个
 * 删除多个
 */

const router = require('express').Router();
const { parseData} = require('../../../utils/tools');
const { prisma } = require('../../../db');

/**
 * 列表
 */
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const name = req.query.name;
        const mobile = req.query.mobile;
        const uid = req.query.uid;
        const rid = req.query.rid;

        const query = {};
        if (name) {
            query.name = {
                contains: name,
            };
        }
        if (mobile) {
            query.mobile = {
                contains: mobile,
            };
        }
        if (uid) {
            query.userId = uid;
        }
        if (rid) {
            query.reservationId = rid;
        }
        const count = await prisma.reservationLog.count({ where: query });
        const list = await prisma.reservationLog.findMany({
            where: query,
            skip: (page * 1 - 1) * limit,
            take: limit * 1,
            include: {
                user: true,
                reservation: true,
            },
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
            total: count,
        },
            true, '获取数据成功'
        ));
    } catch (err) {
        next(err);
    }
});

/**
 *  新增 
 * */
router.post('/', async (req, res, next) => {  
        try{
            await prisma.reservationLog.create({
            data: req.body,
        });
        res.json(parseData({},true,'新增成功'));
        }catch(err){
          next(err)
        }     

});

/**
 * 根据一个id修改
 */
router.put('/:id', async (req, res,next) => {
    try{
        await prisma.reservationLog.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });
        res.json(parseData({},true,'修改成功'));

    }catch(err){
        next(err)
    }

})



/**
 * 获取单条记录,不包含密码
 */
router.get('/:id', async (req, res, next) => {
    try{
        const data = await prisma.reservationLog.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                user: true,
                reservation: true,
            },
        });

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
        const { count} = await prisma.reservationLog.deleteMany({
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
        await prisma.reservationLog.delete({
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