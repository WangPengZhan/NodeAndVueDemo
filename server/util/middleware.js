let redis = require("../util/redisDB")
const {ALLOW_APP} = require('../config/app')
const util = require('./common')

exports.checkAPP = (req, res, next) => {
    console.log(req.headers)
    if(!ALLOW_APP.includes(req.headers.fapp)) {
        res.json(util.getReturnData(500, "来源不正确"))
    } else {
        next()
    }
}

exports.checkUser = (req, res, next) => {
    console.log(req.headers)
    if ('token' in req.headers) {
        let key = req.headers.fapp + ":user:token:" + req.headers.token
        redis.get(key).then((data) => {
            if (data) {
                // 保存用户名称
                req.username = data.username
                console.log(req.username)
                next()
            } else {
                // key值错误或者是登录过期已经被删除
                res.json(util.getReturnData(403, "登录已过期，请重新登录"))
            }
        })
    } else {
        res.json(util.getReturnData(403, "请登录"))
    }
}

exports.checkAdmin = (req, res, next) => {
    console.log("检测管理员用户")
    if (req.username == 'admin') {
        //如果是管理员，则在redis增加一个power
        let key = req.headers.fapp + ":user:power:" + req.headers.token
        redis.set(key, 'admin')
        next()
    } else {
        res.json(util.getReturnData(403, "权限不足"))
    }
}



