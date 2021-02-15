const vscode = require('vscode');
module.exports=(context) => {
    vscode.commands.registerCommand('mycommand.getCurrentFilePath', (url)=> {
		var UrlPath = url.path;
		UrlPath = UrlPath.substr(1);
		// console.log(UrlPath);
		vscode.window.showInformationMessage(`当前文件(夹)路径是：${url ? UrlPath : '空'}`);
        
		//获取地址的第二方法
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		vscode.window.showInformationMessage(currentlyOpenTabfilePath);

		// console.log(__dirname);  // 当前文件所在的绝对路径。
		// console.log(__filename);  // 当前文件的文件名,包括全路径。  __dirname和__filename都是全局对象。
		// vscode.window.showInformationMessage(__dirname);
		// vscode.window.showInformationMessage(__filename);
	})
}