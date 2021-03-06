let redis = require('../util/redisDB')
const util = require('../util/common')
const crypto = require('crypto')

exports.getNavMenu = (req, res, next) => {
    let key = req.headers.fapp + ":nav_menu"
    redis.get(key).then((data) => {
        console.log(data)
        res.json(util.getReturnData(0,'',data))
    })
}

exports.getFooter = (req, res, next) => {
    let key = req.headers.fapp + ":footer"
    redis.get(key).then((data)=>{
        console.log(data)
        res.json(util.getReturnData(0,'',data))
    })
}

exports.getLinks = (req, res, next) => {
    let key = req.headers.fapp + ":links"
    redis.get(key).then((data)=>{
        console.log(data)
        res.json(util.getReturnData(0,'',data))
    })
}

exports.getIndexPic = (req, res, next) => {
    let key = req.headers.fapp + ":indexPic"
    redis.get(key).then((data)=>{
        console.log(data)
        res.json(util.getReturnData(0,'',data))
    })
}

exports.getHotArticle = (req, res, next) =>{
    let key = req.headers.fapp + ":a_view";
    redis.zrevrange(key, 0, 4).then(async (data) => {
        console.log(data);
        let result = data.map((item) => {
            return redis.get(item.member).then((data1) =>{
                console.log(data1)
                if(data1 && data1.show != 0) {
                    return {
                        'title': data1.title,
                        'date': util.getLocalDate(data1.time),
                        'id': data1.a_id,
                        'view': item.score
                    }
                } else{
                    return {'title':'文章暂未上线', 'date':'','id': 0, 'view': 0 }
                }
            })
        })
        let t_data = await  Promise.all(result)
        result.json(util.getReturnData(0,'',t_data))
    })
}

exports.getNewArticle = (req, res, next) =>{
    let key = req.headers.fapp + ":a_time";
    let isAdmin = false;
    console.log(key);
    if ('token' in req.headers){
        let pKey = req.headers.fapp + ":user:power:" + req.headers.token
        redis.get(pKey).then((power) => {
            if(power == 'admin') {
                redis.zrevrange(key, 0, -1).then(async (data) => {
                    console.log(data);
                    let result = data.map((item) => {
                        return redis.get(item.member).then((data1) =>{
                            console.log(data1)
                            if(data1) {
                                return {
                                    'title': data1.title,
                                    'date': util.getLocalDate(item.score),
                                    'id': data1.a_id
                                }
                            }
                        })
                    })
                    let t_data = await  Promise.all(result)
                    console.log(t_data)
                    result.json(util.getReturnData(0,'',t_data))
                })
            } else {
                redis.zrevrange(key, 0, -1).then(async (data) => {
                    console.log(data)
                    let result = data.map((item) => {
                        return redis.get(item.member).then((data1) => {
                            if (data1 && data1.show != 0) {
                                return {
                                    'title': data1.title,
                                    'date': util.getLocalDate(item.score),
                                    'id': data1.a_id
                                }
                            } else {
                                return {
                                    'title': '文章暂未上线',
                                    'date': '',
                                    'id': 0
                                }
                            }
                        })
                    })
                    let t_data = await Promise.all(result)
                    res.json(util.getReturnData(0, '', t_data))
                })
            }
        })
    } else {
        redis.zrevrange(key, 0, -1).then(async (data) => {
            console.log(data)
            let result = data.map((item) => {
                return redis.get(item.member).then((data1) => {
                    if (data1 && data1.show != 0) {
                        return {
                            'title': data1.title,
                            'date': util.getLocalDate(item.score),
                            'id': data1.a_id
                        }
                    } else {
                        return {
                            'title': '文章暂未上线',
                            'date': '',
                            'id': 0
                        }
                    }
                })
            })
            let t_data = await Promise.all(result)
            res.json(util.getReturnData(0, '', t_data))
        })
    }
}

exports.getArticle = (req, res, next) =>{
    let key = req.headers.fapp + ":article:" + req.params.id;
    let isAdmin = false;
    console.log(key);
    redis.get(key).then(async (data) => {
        console.log(data);
        if(data) {
            if(data.show == 1) {

                redis.get(req.headers.fapp + ":a_type").then((type) => {
                    // 获取文章分类详情
                    type.map((item) => {
                        if(item.uid == data.type) {
                            data.typename = item.name
                        }
                    })

                    // 获取文章阅读数量
                    redis.zscore(req.headers.fapp + ":a_view", key).then((view) => {
                        console.log(view)
                        data.view = view;

                        // 获取文章点赞量
                        redis.zscore(req.headers.fapp + ":a_view", key).then((like) => {
                            console.log(like);
                            data.like = like;
                            res.json(util.getReturnData(0, 'success', data))
                        })
                    })
                })
            } else {
                res.json(util.getReturnData(403, '该文章已经被删除或者不存在'))
            }
        } else {
            res.json(util.getReturnData(404, '该文章已经被删除或者不存在'))
        }
    })
}

// 文章评论
exports.getArticleTalk = (req, res, next) => {
    let key = req.headers.fapp + ":article:" + req.param.id + ":talk";
    console.log(key);
    redis.get(key).then(async (data) => {
        console.log(data);
        res.json(util.getReturnData(0, 'success',data))
    })
}

// 根据标签和费雷获取所有文章
exports.getArticles = (req, res, next) => {
    let key = req.headers.fapp;
    if('tag' in req.body) {
        let tKeyMd5 = crypto.createHash('md5')
            .update(req.body.tag).digest('hex');
        key = key + ':tag:' + tKeyMd5;
        console.log(key)
    } else if ('type' in req.body) {
        key = key + ':a_type:' + req.body.type
        console.log(key)
    } else {
        res.json(uti.getReturnData(1, "数据参数错误"))
        return
    }

    redis.get(key).then(async (data) => {
        console.log(data)
        let result = data.map((item) => {
            return redis.get(item).then((data1) => {
                console.log(data1)
                if(data1 && data1.show != 0) {
                    return {
                        'title': data1.title,
                        'date': util.getLocalDate(data1.time),
                        'id': data1.a_id
                    }
                } else {
                    return {
                        'title': "文章暂未上线",
                        'date': '',
                        'id': 0
                    }
                }
            })
        })

        let t_data = await Promise.all(result)
        res.json(util.getReturnData(0,'',data))
    })
}

// 浏览量自动增加
exports.viewArticle = (req, res, next) => {
    let key = req.headers.fapp + ':article:' + req.params.id
    redis.zincrBy( req.headers.fapp + ':a_view', key)
    res.json(util.getReturnData(0, 'success'))
}

