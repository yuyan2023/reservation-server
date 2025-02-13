/**
 * 列表
 * 新增
 * 修改
 * 获取单条记录
 * 删除单个
 * 批量删除
 */
const router = require('express').Router();
const { parseData} = require('../../../utils/tools');
const { prisma } = require('../../../db');

/**
 * 列表
 */
router.get('/', async (req, res,next) => {
    try{
    const {page = 1, limit = 10} = req.query;
    const title = req.query.title;
    const count = await prisma.reservation.count(
        {
            where:{
                title: {
                    contains: title,
                },
            },
        }
    );
    const list = await prisma.reservation.findMany({
        where:{
            title: {
                contains: title,
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
}catch(err){
    next(err)
}

});

/**
 *  新增 
 * */
router.post('/', async (req, res, next) => {  
        try{
            await prisma.reservation.create({
            data: {...req.body,maxCount: req.maxCount * 1 || 10,
            startDate: new Date(req.body.startDate),
            },
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
    if(req.body.startDate){
        req.body.startDate = new Date(req.body.startDate);
    }
    if(req.body.maxCount){
        req.body.maxCount = req.body.maxCount * 1 || 10;
    }
    try{
        await prisma.reservation.update({
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
        const data = await prisma.reservation.findUnique({
            where: {
                id: req.params.id,
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
        const { count} = await prisma.reservation.deleteMany({
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
        await prisma.reservation.delete({
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