// LiteLoader-AIDS automatic generated
/// <reference path="e:\/dts/helperlib/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "PIM",
    /* introduction */ "玩家进入服务器后欢迎，并将其数据记录",
    /* version */ [0.1],
    /* otherInformation */ null
); 



let Version = 0.1;
let UpdateTime = 1000 * 60; //更新间隔（默认一分钟单位毫秒）
let debug = false;
let dataF;

function Join(pl) {
    let name = pl.realName;
    let Device = pl.getDevice();
    let datF = {
        "IP": Device.ip,
        "OS": Device.os,
        "clientID": Device.clientId,
        "xuid": pl.xuid,
        "PermLevel": pl.permLevel
    };
    dataF.set(name, datF);
    logger.debug(JSON.stringify(datF));
    logger.info(`玩家${name}加入了游戏.IP:${Device.ip}`);
    JoinTell(datF.IP.split(":")[0], name);
}

function JoinTell(ip, name) {
    if (ip == "127.0.0.1" || ip.split(".")[0] == "192") {
        mc.broadcast(`§l§b欢迎来自地区:§e(本地)§b的玩家:§a${name}§b加入服务器`);
    } else {
        network.httpGet(`https://ipchaxun.com/${ip}/`, (code, da) => {
            if (code == 200) {
                let dat = da.split('\n')[64];
                let dz = dat.replace('<span class="name">归属地：</span><span class="value">', '').replace('</span>', '');
                if(dz != "</div>") {
                    mc.broadcast(`§l§b欢迎来自地区:§e(${dz})§b的玩家:§a${name}§b加入服务器`)
                } else {
                    mc.broadcast(`§l§b欢迎来自地区:§e([无法获取])§b的玩家:§a${name}§b加入服务器`)
                }
            } else {
                mc.broadcast(`§l§b欢迎来自地区:§e([无法获取])§b的玩家:§a${name}§b加入服务器`);
            }
        })
    }
}

function update() {
    network.httpGet("https://gitee.com/wusheng666666/pim/raw/master/version.txt", (status, result) => {
        logger.debug(status, ' ', result);
        if (status == 200) {
            if (Version != result) {
                logger.info(`获取到新版本：${result}...开始下载...`);
                logger.info(result);
                network.httpGet("https://gitee.com/wusheng666666/pim/raw/master/PIM.js", (status, result) => {
                    if (status != 200) {
                        logger.error(`插件自动更新失败:${status}`);
                    } else {
                        let LxlConf = data.openConfig(".\\plugins\\LiteXLoader\\config.ini", "ini");
                        let path = `${LxlConf.getStr("Main", "PluginsDir", ".\\plugins")}\\PIM.js`;
                        LxlConf.close();
                        file.writeTo(path, result.replace(/\r/g, ''));
                        logger.info('下载完成,开始更新...');
                        mc.runcmdEx('llse reload PIM.js');
                    }
                })
            }
        }
    })
}

function load() {
    logger.setTitle("PIM");
    logger.setConsole(true, (debug ? 5 : 4));
    if (debug) {
        logger.setFile('.\\logs\\PLMDebug.log', 5);
    }
    setInterval(update, UpdateTime);
    file.mkdir('.\\plugins\\wusheng\\PIM');
    dataF = data.openConfig('.\\plugins\\wusheng\\PIM\\data.json', 'json', '{}');
    mc.listen("onJoin", Join);
    log('[PIM]作者:wusheng,版本：' + Version);
}
load();