const fs=require('fs');
const parse = require('url-parse');
const cheerio=require('cheerio');
const vscode = require('vscode');
module.exports =(context) => {
     //爬虫cheerio
    vscode.commands.registerCommand('mycommand.cheerio',()=>{
		cheerioinput();
    });
};

let cheeriolog = vscode.window.createOutputChannel('CheerioLog');

async function cheerioinput() {
	const result = await vscode.window.showInputBox({
		placeHolder: '请输入要估计的网址（带协议头，如：http:,https:）',
		validateInput: (text) => {
            //判断协议头
            // vscode.window.showInformationMessage(text);
			return (text.substr(0,5)==='http:'||text.substr(0,6)==='https:') ? null : '请输入正确的网址!';
		}
	});
    cheerioweb(result);
	vscode.window.showInformationMessage(`cheerio: ${result}`);
}

function cheerioweb(uri)
{
	cheeriolog.show();
	//要爬取的网址
	// let url='http://www.baidu.com/';
	// let json='http://nodejs.org/dist/index.json';
	const parts = parse(uri);
	const server = parts.protocol == 'https:' ? require('https') : require('http');
	//判断链接
	if(uri===undefined||uri===null){
		vscode.window.showErrorMessage("不能为空");
		return 0;
	}
	//爬虫
	server.get(uri,(res)=>{
		//安全判断
		const {statusCode}=res;            //状态码
		const contentType=res.headers['content-type'];    //文件类型
		cheeriolog.appendLine(statusCode + " " +contentType);
		let err=null;
		if (statusCode!=200) {
			err=new Error("请求状态错误");
		}else if(!/^text\/html/.test(contentType))
		{
			//格式类型是网页文件
			err=new Error("请求类型错误");
		}
		if (err) {
			console.log(err);
			cheeriolog.appendLine('错误');
			res.resume();//重置缓存
			return false;
		}	
		//数据的处理
		//数据分段，只要接受数据就会触发data事件chunk每次接受的数据片段
		let rawData='';
		res.on('data',(chunk)=>{
			// console.log('数据传输');
			cheeriolog.appendLine('------');
			rawData +=chunk.toString('utf8');
			cheeriolog.appendLine(rawData);
		})
		//数据流传输完毕
		res.on('end',(chunk)=>{
			//将请求的数据保存到本地
			// fs.writeFileSync('./baidu.html',rawData);
			fs.writeFileSync('C:/Users/liuzh/Desktop/1.html',rawData);
			cheeriolog.appendLine('数据传输完毕');
			//通过cheerio分析
			let $=cheerio.load(rawData);    //将请求的网页数据进行转化
			$('img').each((index,el)=>{
				cheeriolog.appendLine($(el).attr('src'));
			})
		})
	}).on('error',(err)=>{
		cheeriolog.appendLine('请求错误');
		console.log(err);
	});
}