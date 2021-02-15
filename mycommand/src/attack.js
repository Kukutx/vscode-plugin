const vscode = require('vscode');
const parse = require('url-parse');
const chalk = require('chalk');

module.exports=(context) => {
vscode.commands.registerCommand('mycommand.attack', ()=> {   
    AttackUrl();
  })
}

//输出面板
// let Attacklog = vscode.window.createOutputChannel('Attacklog');//在输出的任务选项下创建一个输出面板
let Attacklog = vscode.window.createOutputChannel('AttackLog');//在输出的任务选项下创建一个输出面板

//攻击网址输入
async function AttackUrl() {
	const result = await vscode.window.showInputBox({
		placeHolder: '请输入要估计的网址（带协议头，如：http:,https:）',
		validateInput: (text) => {
      //判断协议头
      // vscode.window.showInformationMessage(text);
			return (text.substr(0,5)==='http:'||text.substr(0,6)==='https:') ? null : '请输入正确的网址!';
		}
	});
  Attackhttp(result);
	vscode.window.showInformationMessage(`attack: ${result}`);
}

//attack
function Attackhttp(uri){
    const parts = parse(uri);
    const server = parts.protocol == 'https:' ? require('https') : require('http');
    const runs = [1, 10, 10, 100, 100, 100, 200, 200, 200, 200, 500, 1000, 10000]    
    /**
     * 对HTTP / HTTPS端点进行压力测试，并增加曲线
     *
     * 使用方式: attack https://url.com/foo
     */
    if(uri===undefined||uri===null){
      vscode.window.showErrorMessage("不能为空");
      return 0;
    }
     //显示输出面板
    Attacklog.show();                        
    Attacklog.appendLine("attack:" + uri);
    // console.log(parts);
    function attack (count, cb) {
      let good = 0
      let bad = 0
      let requests = []
      for (let n = 0; n < count; n++) {
        requests.push(
          server.get({
            hostname: parts.hostname,
            port: parts.port,
            agent: false
          }, function (res) {
            good++
            if (good + bad == count) {
              cb(good, bad)
            }else{
                console.log(res);
            }
          })
          .on('error', function(err) {
            bad++
            //如果超过20％的请求出错，则保释
            if (bad/(good+bad) > 0.2) {
              // cancel in flight requests
              requests.forEach(function (request) {
                if (request.abort) {
                  request.abort()
                }
              })
              cb(good, bad)
            }
            if (good + bad == count) {
              cb(good, bad)
            }else{
                // console.log(err);
                Attacklog.appendLine("error");
                throw err;
            }
          })
        )
      }
    }  
    function go (runs) {
      let start = Date.now()
      attack(runs[0], function (good, bad) {
        let total = good + bad;
        let rate = good/total;
        let time = Date.now() - start;
        let niceRate = (100*rate).toFixed(2) + '%';
        if (rate == 1) {
          niceRate = chalk.green(niceRate)
        } else if (rate > 0.9) {
          niceRate = chalk.yellow(niceRate)
        } else {
          niceRate = chalk.red(niceRate)
        }
        // console.log(chalk.blue(runs[0], 'requests:', good + '/' + total, '(' + niceRate + ') - done in', time + 'ms (' + (time/total).toFixed(2), 'ms/request, ' + (total/(time/1000)).toFixed(2) + 'qps)'));
        Attacklog.appendLine(chalk.blue(runs[0], 'requests:', good + '/' + total, '(' + niceRate + ') - done in', time + 'ms (' + (time/total).toFixed(2), 'ms/request, ' + (total/(time/1000)).toFixed(2) + 'qps)'));
        if (rate > 0.8) {
          setTimeout(function(){
            go(runs.slice(1))
          }, 5000);
    
        } else {
          Attacklog.appendLine('done!')
        }

      })
    }
    Attacklog.appendLine('swarming:'+ uri + '...');
    go(runs)
}