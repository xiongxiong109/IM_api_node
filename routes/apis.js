const AppKey = '4df6a6ce94522aab94ec45bd5976710f';
const AppSecret = 'dea696b47f88';

var request = require('request');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

router.all('/chatroom/:username', (req, res) => {

	var uname = req.params['username'];
	var toUname = req.query['to'];
	registUser({
		accid: uname,
		uname: uname
	}, (data) => {
		// console.log(data);
		if (data.code != 200) {
			updateUserToken(uname, function(updateData) {
				res.render('chatroom', {
					title: 'chatroom',
					uname,
					toUname,
					AppKey,
					token: updateData.info.token
				});
			});
		} else {
			res.render('chatroom', {
				title: 'chatroom',
				uname,
				toUname,
				AppKey,
				token: data.info.token
			});
		}
	});

});

// 构造加密签名headers函数
function initSha1Headers() {

	var Nonce = Math.floor(Math.random() * 10 + 10);
	var CurTime = Math.ceil(new Date().getTime() / 1000).toString();
	var CheckSum = sha1(`${AppSecret}${Nonce}${CurTime}`).toString(16).toLowerCase();
	var headers = {
		AppKey,
		Nonce,
		CurTime,
		CheckSum,
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	}

	return headers
}

// 生成云信ID
function registUser(uInfo, cb) {

	request({
		url: 'https://api.netease.im/nimserver/user/create.action',
		method: 'POST',
		headers: initSha1Headers(),
		formData: {
			accid: uInfo.accid,
			name: uInfo.uname
		}
	}, function(err, rst) {
		cb && cb.call(null, JSON.parse(rst.toJSON().body));
	})
}

// 更新云信ID token
function updateUserToken(accid, cb) {

	request({
		url: 'https://api.netease.im/nimserver/user/refreshToken.action',
		method: 'POST',
		headers: initSha1Headers(),
		formData: {
			accid
		}
	}, function(err, rst) {
		cb && cb.call(null, JSON.parse(rst.toJSON().body));
	})

}

module.exports = router;