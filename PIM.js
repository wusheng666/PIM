// LiteLoader-AIDS automatic generated
/// <reference path="e:\/dts/helperlib/src/index.d.ts"/> 
ll.registerPlugin(
    /* name */ "PIM",
    /* introduction */ "当玩家进服后进行欢迎",
    /* version */ [0.2],
    /* otherInformation */ null
); 
var Versions = 0.2;
var ordinary = false; //是否显示玩家从那个地区来
var judgment = true; //是否开启管理员进服提示
var UpdateTime = 1000 * 60 //更新间隔时间默认一分钟
var cp = pl.isOP(pl)
function join(pl){
        var name = pl.realName
        var Device = pl.getDevice();
        var datF = {
            "IP": Device.ip,
            "OS": Device.os,
            "clientID": Device.clientId,
            "xuid": pl.xuid,
            "PermLevel": pl.permLevel
        };
        if(judgment = true){
            if(cp = true){
                mc.broadcast(`管理员:${name}已加入游戏，请各位玩家文明游戏拒绝作弊`)
            }
    }else{
        JoinTell(datF.IP.split(":")[0], name);
    }
}
    function JoinTell(ip, name) {
        if (ordinary = false) {
            mc.broadcast(`§l§b欢迎玩家:§a${name}§b加入服务器`)
        }else{
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
    }
function update() {
    network.httpGet("https://github.com/wusheng666/PIM/blob/main/version.txt", (status, result) => {
        logger.debug(status, ' ', result);
        if (status == 200) {
            if (Version != result) {
                logger.info(`获取到新版本：${result}...开始下载...`);
                logger.info(result);
                network.httpGet("https://github.com/wusheng666/PIM/blob/main/PIM.js", (status, result) => {
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
}//自动更新脚本
mc.listen("onJoin", Join);//监听玩家进服



