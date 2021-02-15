const vscode = require('vscode');
const os = require('os');
var internetAvailable = require("internet-available");
//获取本地ip 函数
function getIPAddress(){
    // var interfaces = os.networkInterfaces();
    // for(var devName in interfaces){
    //     var iface = interfaces[devName];
    //     for(var i=0;i<iface.length;i++){
    //         var alias = iface[i];
    //         if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
    //             return alias.address;
    //         }
    //     }
    // }

	var ifaces = os.networkInterfaces();
		Object.keys(ifaces).forEach((ifname)=> {
		    var alias = 0;
		    ifaces[ifname].forEach((iface)=>{
			    if ('IPv4' !== iface.family || iface.internal !== false) {
			    //跳过内部地址（即127.0.0.1）和非ipv4地址
			    return '127.0.0.1';
			    }
    
			    if (alias >= 1) {
			    //这个单一介面有多个ipv4地址
			    vscode.window.showInformationMessage(ifname + ':' + alias, iface.address);
			    console.log(ifname + ':' + alias, iface.address);
			    } else {
			    //该接口只有一个ipv4地址
			    vscode.window.showInformationMessage(ifname, iface.address);
			    console.log(ifname, iface.address);
			    }
			++alias;
		});
	});
}

//获取本地ip
module.exports = (context) => {
    context.subscriptions.push(vscode.commands.registerCommand('mycommand.getIPAdress', ()=> {
		// vscode.window.showInformationMessage('local IP: '+ getIPAddress()); // 本地ip
	 var hostName=os.hostname(); 
		vscode.window.showInformationMessage('local host:'+ hostName);
		getIPAddress();

		//判断网络状况
		internetAvailable(/*{
			timeout: 4000,      //检测超时时间
			retries: 10,        //检测次数
		   }*/).then(function(){
			console.log("Internet available");
		   }).catch(function(){
			console.log("No internet");
		});
		
		//internet-available默认检测的DNS域名是google.com，如果想自定义域名，代码如下：
		// internetAvailable({
		// 	domainName: "xxxxx.com",
		// 	port: 53,
		// 	host: '8.8.8.8' // 默认，国内请改成114.114.114.114
		//    }).then(() => {
		// 	console.log("Internet available");
		//    }).catch(() => {
		// 	console.log("No internet");
		// });
    }));
};
