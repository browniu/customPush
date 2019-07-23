// 依赖项
const puppeteer = require('puppeteer');
let request = require('request');

// 配置项
const gap = 5
let tempInfo = ''

// 核心-数据抓取
async function getInfo() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com/');
    await page.focus('#kw');
    await page.type('#kw', '天气', {delay: 100});
    await page.click('#su', {delay: 3000});
    await page.click('.op_weather4_xlfilter', {delay: 5000})

    const info = await page.evaluate(() => ({
        content: {
            ontime: document.querySelector('.op_weather4_twoicon_shishi_sub').innerText,
            weather: document.querySelector('.op_weather4_twoicon_weath').innerText,
            temp: document.querySelector('.op_weather4_twoicon_shishi_title').innerText,
            rain: [...document.querySelectorAll('.op_weather4_jsml')].map(dom => dom.innerText).slice(0, 4).join('-').replace(/mm/g, '')
        },
        sub: {
            title: '实时天气',
            date: new Date().toString()
        }

    }))
    // console.log(info)
    checkTemp(info)
    browser.close()

}

// 核心-消息推送
function push(info, title, date) {
    let url = 'https://api.day.app/NmAByzvdmM8EfTtNsYMGEo/'
    if (title) title = encodeURI(title)
    info = encodeURI(info) || 'xixi'
    let target = title ? url + title + '/' + info : url + info
    request(target, function (error, response, body) {
        if (response.statusCode === 200) {
            console.info('发送成功', date)
        }
    })
}

// 覆盖检查
function checkTemp(info) {
    let content = Object.values(info.content).join(' ')
    console.log(tempInfo, content)
    if (content === tempInfo) return
    push(content, info.sub.title, info.sub.date)
    tempInfo = content
}

// 执行程序
getInfo()
if (gap > 0) setInterval(() => {getInfo()}, gap * 1000 * 60)
