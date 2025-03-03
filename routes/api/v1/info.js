const {prisma} = require('../../../db')
const {parseData} = require('../../../utils/tools')
const router = require('express').Router();

//获取所有咨询分类
router.get('/article_categories', async(req,res)=>{
    const data = await prisma.articleCategoty.findMany({
    where:{},
    orderBy:{
    createdAt:'desc'
    }  
    });
    res.json(parseData(data));
    
});

//获取咨询数据
//分页
//标题查询
//分类id查询
router.get('/articles', async(req,res)=>{
    const per = (req.query.per || 10)*1;
    const page = (req.query.page || 1)*1;
    const where = {};
    if(req.query.cid){
        where.articleCategoryId = req.query.cid;
    }
    if(req.query.title){
        where.title = {
            contains:req.query.title
        }
    }
    const count = await prisma.article.count({
        where
    });
    const list = await prisma.article.findMany({
        where,
        include:{
            articleCategory:true
        },
        skip:(page-1)*per,
        take:per,
        orderBy:{
            createdAt:'desc'
        }
});
res.json(parseData({
    list,
    page,
    pages:Math.ceil(count/per),
    total:count
}));
});

//根据id查询
router.get('/article/:id', async(req,res)=>{
    const data = await prisma.article.findFirst({
        where:{
            id: req.params.id
        },
    });

    //浏览数量自动加1
    await prisma.article.update({
        where:{
            id:req.params.id
        },
        data:{
            views:{
                increment:1
            }
        }
    
    });
    res.json(parseData(data));
});

//获取预约列表
router.get('/reservations', async(req,res)=>{
    const per = (req.query.per || 10)*1;
    const page = (req.query.page || 1)*1;
    const where = {};

    if(req.query.title){
        where.title = {
            contains:req.query.title
        }
    }
    const count = await prisma.reservation.count({
        where
    });
    const list = await prisma.reservation.findMany({
        where,
        include:{
            articleCategory:true
        },
        skip:(page-1)*per,
        take:per,
        orderBy:{
            createdAt:'desc'
        }
});
res.json(parseData({
    list,
    page,
    pages:Math.ceil(count/per),
    total:count
}));
});

//根据id获取预约
router.get('/article/:id', async(req,res)=>{
    const data = await prisma.reservation.findFirst({
        where:{
            id: req.params.id
        },
    });

    //浏览数量自动加1
    await prisma.reservation.update({
        where:{
            id:req.params.id
        },
        data:{
            views:{
                increment:1
            }
        }
    
    });
    res.json(parseData(data));
});

module.exports = router;
