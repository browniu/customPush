// 依赖项
const puppeteer = require('puppeteer');
let request = require('request');

// 配置项
const configs = require('./infoConfig')
const configIndex = 1
const config = configs[configIndex]

let tempInfo = Array.apply(null, {length: config.tempLength})
let tempInfoIndex = 0


// 核心-数据抓取
async function getInfo() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(config.url);
    await config.step(page)
    setTimeout(async () => {
        const info = await config.infoFormat(page)
        checkTemp(info)
        browser.close()
    }, config.delay * 1000)


}

// 核心-消息推送
function push(info, title, date) {
    let url = config.target
    if (title) title = encodeURI(title)
    info = encodeURI(info).replace(/#/g,'') || 'xixi'
    let target = title ? url + title + '/' + info : url + info
    request(target, function (error, response) {
        if (response.statusCode === 200) {
            print('r', '发送成功', date)
        }
    })
}

// 覆盖检查
function checkTemp(info) {
    const currInfo = Object.values(info.content).join(' ')
    if (tempInfo.some(e => e === currInfo)) {
        print('n', '数据未更新')
    } else if (config.network.enable && info.sub.networkCheckPoint.match(config.network.label)) {
        print('w', '因网络延时过高，本次获取的数据无效')
    } else {
        print('c', tempInfo[tempInfoIndex], currInfo)
        push(currInfo, config.title, info.sub.date)
        tempInfo[tempInfoIndex] = currInfo
        tempInfoIndex++
        if (tempInfoIndex > config.tempLength - 1) tempInfoIndex = 0
    }
}

// 控制台输出
function print(type, content, sub = '') {
    switch (type) {
        case 'r':
            console.log('\033[42;30m DONE \033[0;32m ' + content + ' \033[0m' + sub);
            break;
        case 'c':
            console.log('\033[46;30m COMP \033[0;35m ' + content + ' \033[0;31m ' + sub + ' \033[0m')
            break;
        case 'w':
            console.log('\033[41;30m FIELD \033[0;31m ' + content + ' \033[0m' + sub);
            break
        case 'n':
            console.log('\033[43;30m WARN \033[0;33m ' + content + ' \033[0m' + sub)
    }
}

// 执行程序
getInfo()
if (config.interval) setInterval(() => {getInfo()}, config.interval * 1000 * 60)
