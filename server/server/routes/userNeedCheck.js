var express = require('express');
var router = express.Router();

var { articleTalk } = require('../controller/userNeedCheck')
var { getUserInfo } = require('../controller/userNeedCheck')
var { changeUserInfo } = require('../controller/userNeedCheck')
var { sendMail } = require('../controller/userNeedCheck')
var { getMails } = require('../controller/userNeedCheck')
var { getUserMail } = require('../controller/userNeedCheck')
var { getArticleType } = require('../controller/userNeedCheck')
var { articleLike } = require('../controller/userNeedCheck')
var { articleCollection } = require('../controller/userNeedCheck')
var { getCollection } = require('../controller/userNeedCheck')

//添加文章评论
router.post('/article/talk', articleTalk)
// 获得资料
router.get('/info/:username', getUserInfo);
//修改用户资料
router.post('/changeInfo', changeUserInfo);
//发送私信
router.post('/mail/:username', sendMail)
//获得私信列表
router.get('/mailsGet', getMails)
//根据私信id获得私信详情
router.get('/mailGetter/:id', getUserMail)
//获得所有文章分类
router.get('/articleType', getArticleType)
//文章点赞和踩
router.get('/like/:id/:like', articleLike)
//文章收藏
router.get('/save/:id', articleCollection)
//收藏列表获取
router.get('/saveList', getCollection)


module.exports = router;