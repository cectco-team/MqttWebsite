var express = require('express'),
    router = express.Router(),
    //crypto = require('crypto'),
    title = '登入';


router.get('/', function (req, res, next) {
    if (req.session.Sign) {
        res.locals.Account = req.session.Account;
        res.locals.Name = req.session.Name;
    }
    res.render('login', { title: title });
});


router.post('/', function (req, res, next) {
    var mysqlQuery = req.mysqlQuery;
    var Account = req.body['txtUserName'],
        Password = req.body['txtUserPwd'];
    //md5 = crypto.createHash('md5');
    var cmd = "select * from AccountTbl where Account = ?";
    mysqlQuery(cmd, [Account], function (err, result) {
        if (err) {
            return;
        }
        if (result == '') {
            res.locals.error = '使用者不存在';
            res.render('login', { title: res.locals.error });
            return;
        }

        //password = md5.update(password).digest('hex');
        if (result[0].Account != Account || result[0].Password != Password) {
            res.locals.error = '使用者帳號或密碼錯誤';
            res.render('login', { title: res.locals.error });
            return;
        } else if (result[0].Enable == 0) {
            res.locals.error = '使用者被拒絕存取';
            res.render('login', { title: res.locals.error });
            return;
        } else {
            //設定session
            req.session.Name = result[0].Name;
            req.session.Account = Account;
            req.session.Sign = true;
            req.session.SuperUser = result[0].SuperUser;
            req.session.AccountNo = result[0].AccountNo;
            console.log(req.session.Name + " login!");
            // res.render('login',{title:"登入成功"});
            res.redirect('/machine');
            return;
        }
    });
});


module.exports = router;