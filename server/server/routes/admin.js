var express = require('express');
var router = express.Router();
//// 引入了逻辑处理的JavaScript文件（需要注意是否有其他路由使用到其他文件，均需要引入，本处已省略）
var {setNavMenu, setFooter, setLinks, setIndexPic, setArticle, setArticleType, showArticle, getAllUser,stopLogin} = require('../controller/admin')


// 更改导航菜单
router.post('/changeNav', setNavMenu);
// 底部内容修改
router.post('/setFooter', setFooter);
// 友情链接
router.post('/setLinks', setLinks)
// 修改主页轮播图片
router.post('/setIndexPic', setIndexPic)
// 发布文章
router.post('/setArticle', setArticle)
//分类的发布
router.post('/setArticleType', setArticleType)
//文章的上线和下线
router.post('/showArticle', showArticle)
//获得所有的用户
router.get('/getAllUser', getAllUser)
//用户封停操作
router.get('/stopLogin/:id', stopLogin)

module.exports = router;