let redis = require("../util/redisDB")
const util = require('../util/common')
const crypto = require('crypto');

// 用户登录API
exports.userLogin = (req, res, next) => {
    //获得用户名和密码
    let username = req.body.username
    let password = req.body.password
    redis.get(req.headers.fapp + ":user:info:" + username).then((data) => {
        if (data) {
            if (data.login == 0) {
                if (data.password != password) {
                    res.json(util.getReturnData(1, '用户名或者密码错误'))
                } else {
                    //这里采用简单的token生成，根据用户名和当前时间戳直接生成md5值
                    let token = crypto.createHash('md5').update(Date.now() + username).digest("hex")
                    let tokenKey = req.headers.fapp + ":user:token:" + token
                    //为了方便查找，将user的资料存放在该token为键的k-v对象中
                    delete data.password
                    //写入数据库，并且设置其过期时间
                    redis.set(tokenKey, data)
                    //设置为1000秒过期
                    redis.expire(tokenKey, 1000)
                    res.json(util.getReturnData(0, '登录成功', {token: token}))
                }
            } else {
                res.json(util.getReturnData(1, '用户被封停'))
            }

        } else {
            res.json(util.getReturnData(1, '用户名或者密码错误'))
        }
    })
}

// 用户注册API
exports.userRegister = (req, res, next) => {
    //获得用户名和密码和其他资料
    let username = req.body.username
    let password = req.body.password
    let ip = req.ip
    if (username || password) {
        let key = 'book:user:info:' + username
        redis.get(key).then((user) => {
            if (user) {
                res.json(util.getReturnData(1, '用户已经存在'))
            } else {
                let userData = {
                    phone: 'phone' in req.body ? req.body.phone : '未知',
                    nikename: 'nikename' in req.body ? req.body.nikename : '未知',
                    age: 'age' in req.body ? req.body.age : '未知',
                    sex: 'phone' in req.body ? req.body.sex : '未知',
                    ip: ip,
                    username: username,
                    password: password,
                    // 用户是否被封停
                    login: 0
                }
                //存储数据，注册成功
                redis.set(key, userData)
                res.json(util.getReturnData(0, '注册成功，请登录'))
            }
        })

    } else {
        res.json(util.getReturnData(1, '资料不完整'))
    }
}