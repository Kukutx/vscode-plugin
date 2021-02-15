// @ts-nocheck
const vscode = require('vscode');
const datetime = require('silly-datetime');
var cp = require('child_process');



/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	//插件控制台
	console.log('mycommend 已启动');
    //hello启动	
	let disposable = vscode.commands.registerCommand('mycommand.SayHello', () => {
		var time=datetime.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		console.log(time);
		vscode.window.showInformationMessage('欢迎回来'+'('+time+')');
		vscode.window.setStatusBarMessage('插件启动',5000);
	});
    //返回所有命令
    vscode.commands.getCommands().then(allCommands => {
		console.log('所有命令：', allCommands);
	});
	//是否打开网址
	if (vscode.workspace.getConfiguration("mycommandPlugin").get("Promptbox")) {
        vscode.window.showInformationMessage('是否要打开官网？', '是', '否', '不再提示').then(result => {
			if (result === '是') {
				cp.exec('start http://kahxnsat.com/');
			} else if (result === '不再提示') {
				vscode.workspace.getConfiguration().update("mycommandPlugin.Promptbox", false, true);
				vscode.window.showInformationMessage('我呸！');
			}else{
				vscode.window.showInformationMessage("草泥马的");
			}
		});
    }
	
  
	require('./src/cheerio')(context);     //cheerio
	require('./src/getIPAdress')(context); //getipadress 获取本地ip
	require('./src/webview')(context);     //webview 
	require('./src/getpath')(context);     //获取路径
	require('./src/attack')(context);     //attack

	/*插件调用区*/
	context.subscriptions.push(disposable);
}
function deactivate() {}
module.exports = {
	activate,
	deactivate
}