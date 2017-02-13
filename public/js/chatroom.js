// chatroom
function onConnect() {
	console.log('连接成功');
}
function onWillReconnect(obj) {
	console.log('即将重连');
	console.log(obj.retryCount);
	console.log(obj.duration)
}
function onDisconnect() {
	console.log('丢失连接');
  console.log(error);
  if (error) {
      switch (error.code) {
      // 账号或者密码错误, 请跳转到登录页面并提示错误
      case 302:
          break;
      // 被踢, 请提示错误后跳转到登录页面
      case 'kicked':
          break;
      default:
          break;
      }
  }
}
function onMsg (msg) {
	console.log("收到消息", msg.text);
	console.log(msg);
	var p = document.createElement('p');
	p.innerHTML = msg.from + ":" + msg.text;
	document.body.appendChild(p);
}
function onError(error) {
	console.log(error);
}

function sendMsgDone(err, msg) {
	var p = document.createElement('p');
	p.innerHTML = "我:" + msg.text;
	document.body.appendChild(p);
}

var oForm = document.querySelector("#im");
oForm.onsubmit = function(e) {
	e.preventDefault();
	var oIpt = oForm.mes;
	var msg = oIpt.value;
	oIpt.value = '';
	// 发送消息
	var sendMsg = nim.sendText({
	    scene: 'p2p',
	    to: TO_UNAME,
	    text: msg,
	    done: sendMsgDone
	});
}