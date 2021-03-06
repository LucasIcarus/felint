/* global Promise */

var childProcess = require('child_process');
var readline = require('readline');

/**
 * 判断是否需要更新felint
 * @param  {[type]} version [description]
 * @return {[type]}         [description]
 */
function checkUpdate(version) {
    var resFn;
    var p = new Promise(function(res, rej) {
        resFn = res;
    });
    childProcess.exec(
        'npm view felint@latest version',
        function(err, stdout) {
            stdout = stdout.trim();
            var isUpdating = false;
            if (err) {
                console.log('check update fail...');
                resFn(isUpdating);
            } else {
                try {
                    var latestVersion = stdout;
                    if (version !== latestVersion) {
                        var rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                        rl.question('find new version, you should update now.(Y/n)?', function(ans) {
                            rl.close();
                            if (ans !== 'n') {
                                isUpdating = true;
                                console.log('install felint@latest...');
                                childProcess.exec(
                                    'npm install -g felint@latest',
                                    function(err, stdout) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(stdout);
                                        }
                                    }
                                );
                            }
                            resFn(isUpdating);
                        });
                    } else {
                        resFn(isUpdating);
                    }
                } catch (e) {
                    console.log(e);
                    resFn(isUpdating);
                }
            }
        }
    );
    return p;
}

module.exports = checkUpdate;