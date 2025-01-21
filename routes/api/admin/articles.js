/**
 * 列表
 * 新增
 * 修改
 * 获取单条记录
 * 删除单个
 * 批量删除
 */
const router = require('express').Router();
const { parseData } = require('../../../utils/tools');
const { prisma } = require('../../../db');

/**
 * 列表
 */
router.get('/', async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const title = req.query.name;
    const count = await prisma.article.count({
        where:{
            title: {
                contains: title,
            },
        },
    });
   
    const list = await prisma.article.findMany({
        where:{
            title: {
                contains: title,
            },
        },
        skip: (page *1- 1) * limit,
        take: limit *1,
        include: {
                articleCategory: true,  
                
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
        total:count,
    },
    true,'获取数据成功'
)
);

});

/**
 *  新增 
 * */
router.post('/', async (req, res, next) => {  
        try{
            await prisma.article.create({
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
        await prisma.article.update({
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
        const data = await prisma.article.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                articleCategory: true,
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
        const { count} = await prisma.article.deleteMany({
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
        await prisma.article.delete({
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