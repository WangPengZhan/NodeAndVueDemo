let redis = require("redis")

const {redisConfig} = require("../config/db")

const redis_client = redis.createClient(redisConfig);

// 监听错误和链接成功的信号 或者说是回调函数
redis_client.on("connect", () => {
    console.log("连接成功");
});
redis_client.on("error", (err) => {
    console.log(err);
});

redis = {};

// ???
keys = async (cursor, re, count) => {
    let getTempKeys = await new Promise((resolve) => {
        redis_client.scan([cursor, "MATCH", re, "COUNT", count], (err,res) => {
            console.log(err)
            return resolve(res)
        });
    });
    return getTempKeys
}

redis.scan = async (re, cursor = 0, count = 100) =>{
    return await keys(cursor, re, count)
}

redis.set = (key, value) => {
    value = JSON.stringify(value)
    return redis_client.set(key, value, (err) => {
        if(err) {
            console.log(err);
        }
    });
}

redis.text = async (key) => {
    let getTempValue = await new Promise((resolve) => {
        redis_client.get(key, (err, res) => {
            return resolve(res);
        });
    });
    getTempValue = JSON.parse(getTempValue);

    return getTempValue;
}

redis.get = async (key) => {
    return await text(key)
}

// 过期删除
redis.expire = (key, ttl) => {
    redis_client.expire(key, parseInt(tll))
}

id = async (key) => {
    console.log("查找" + key)
    let id = await new Promise((resolve => {
        redis_client.incr(key, (err, res) =>{
            console.log(err)
            return resolve(res)
        })
    }))
    console.log(id)
    return id
}
redis.incr = async (key) => {
    return await id(key)
}

redis.zAdd = (key, member, num) => {
    member = JSON.stringify(member)
    redis_client.zadd(key, num, member, (err) => {
        if(err) {
            console.log(err);
        }
    });
}

tempData = async  (key, min, max) => {
    let tData = await  new Promise((resolve => {
        redis_client.zrevrange([key, min, max, "WITHSCORES"], (err, res)=>{
            return resolve(res)
        })
    }))

    let oData = []

    for(let i = 0; i < tData.length; i = i + 2)
    {
        oData.push({member: JSON.parse(tData[i]), scope: tData[i+ 1]})
    }

    return oData;
}

redis.zrevrange  = async  (key, min = 0, max = -1) => {
    return tempData(key, min, max)
}

redis.zincrBy = (key, member, NUM = 1) => {
    member = JSON.stringify(member)
    redis_client.zincrBy(key, NUM, member, (err) => {
        if(err) {
            console.log(err);
        }
    })
}

tempZscore = async  (key, member) =>{
    member = JSON.stringify(member)
    return await  new Promise((resolve => {
        redis_client.zscore(key, member, (err, res) => {
            console.log(err);
            return resolve(res)
        })
    }))
}

redis.zscore =  async (key, menmber) => {
    return tempZscore(key, menmber)
}

module.exports = redis;