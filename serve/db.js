const path = require('path')
const nedb = require('nedb')

const userDB = new nedb({
    filename: path.join(__dirname, 'users.db'),
    autoload: true
})
const timelineDB = new nedb({
    filename: path.join(__dirname, 'line.db'),
    autoload: true
})

function getHash(pw) {
    const salt = '::EVnCMOQwfL48Krpr'
    const crypto = require('crypto')
    const hashsum = crypto.createHash('sha512')
    hashsum.update(pw + salt)
    return hashsum.digest('hex')
}

function getAuthToken(userid) {
    const time = (new Date()).getTime()
    return getHash(`${userid}:${time}`)
}

function getUser(userid, callback) {
    userDB.findOne({ userid }, (err, user) => {
        if (err || user === null) return callback(null)
        console.log('通過', user)
        callback(user)
    })
}

function addUser(userid, passwd, callback) {
    const hash = getHash(passwd)
    const token = getAuthToken(userid)
    const regDoc = { userid, hash, token, friends: {} }
    userDB.insert(regDoc, (err, newDoc) => {
        if (err) return callback(null)
        callback(token)
    })
}

function login(userid, passwd, callback) {
    const hash = getHash(passwd)
    const token = getAuthToken(userid)
    getUser(userid, (user) => {
        if (!user || user.hash !== hash) {
            return callback(new Error('認証エラー'), null)
        }
        user.token = token
        updateUser(user, (err) => {
            if (err) return callback(err, null)
            callback(null, token)
        })
    })
}

function checkToken(userid, token, callback) {
    getUser(userid, (user) => {
        if (!user || user.token !== token) {
            return callback(new Error('認証に失敗'), null)
        }
        callback(null, user)
    })
}

function updateUser(user, callback) {
    userDB.update({ userid: user.userid }, user, {}, (err, n) => {
        if (err) return calback(err, null)
        callback(null)
    })
}

function getFriendsTimeline(userid, token, callback) {
    checkToken(userid, token, (err, user) => {
        if (err) return callback(new Error('認証に失敗'), null)
        const friends = []
        for (const f in userDB.friends) friends.push(f)
        friends.push(user)
        timelineDB
            .find({ userid: { $in: friends } })
            .sort({ time: -1 })
            .limit(20)
            .exec((err, docs) => {
                if (err) return callback(new Error('DBエラー'), null)
                callback(null, docs)
            })
    })
}
module.exports = {
    userDB, timelineDB, getUser, addUser, login, checkToken, updateUser, getFriendsTimeline
}