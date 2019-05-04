var http = require('http');
var Cookies = require('cookies');

//cookies进行签名(加密)
var keys = ['keyboard cat'];

var server = http.createServer(function (req, res) {
    //创建cookie对象
    var cookies = new Cookies(req, res, { keys: keys })

    // 获取cookie,new Cookies时设置了签名，获取时也要进行签名认证
    var lastVisit = cookies.get('lastVisit', { signed: true });
    // 设置cookie('键名','值','有效期')
    // cookies.set('LastVisit', new Date().getTime(), { signed: true });
    // cookies.set('k1', 'v1', { signed: true, maxAge: 0 }); //永久有效
    // cookies.set('k3', 'v3', { signed: true, maxAge: -1 }); //删除cookie
    cookies.set('lastVisit', 'v2', { signed: true, maxAge: 3000 }); //单位毫秒，有效期为7天

    console.log(lastVisit);
    if (!lastVisit) {
        res.setHeader('Content-Type', 'text/plain;charset=utf8')
        // res.end('你好，你这是首次访问!')
        res.end('登录成功！');
    } else {
        res.setHeader('Content-Type', 'text/plain;charset=utf8')
        // res.end('欢迎回来! 上一次访问时间为 ' + lastVisit + '.')
        res.end('登录失效，请重新登录');
    }
})

server.listen(3000, function () {
    console.log('Visit us at http://127.0.0.1:3000/ !')
})