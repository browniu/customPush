module.exports = [{
    title: '实时天气',
    url: 'https://www.baidu.com/',
    target: 'https://api.day.app/NmAByzvdmM8EfTtNsYMGEo/',
    interval: 5,
    tempLength: 3,
    delay: 0,
    step: async (page) => {
        await page.focus('#kw');
        await page.type('#kw', '天气', {delay: 100});
        await page.click('#su', {delay: 3000});
        await page.click('.op_weather4_xlfilter', {delay: 5000})
    },
    infoFormat: (page) => (
        page.evaluate(() => ({
            content: {
                ontime: document.querySelector('.op_weather4_twoicon_shishi_sub').innerText.replace('（实时）', '>'),
                weather: document.querySelector('.op_weather4_twoicon_weath').innerText,
                temp: document.querySelector('.op_weather4_twoicon_shishi_title').innerText,
                rain: [...document.querySelectorAll('.op_weather4_jsml')].map(dom => dom.innerText).slice(0, 3).join('-').replace(/mm/g, '')
            },
            sub: {
                date: new Date().toString().substr(0, 24),
                networkCheckPoint: [...document.querySelectorAll('.op_weather4_jsml')].map(dom => dom.innerText).slice(0, 3).join('-').replace(/mm/g, '')
            }
        }))
    ),
    network: {
        enable: true,
        label: '0-0-0'
    }
}, {
    title: '微博话题',
    url: 'https://weibo.com/a/hot/realtime',
    target: 'https://api.day.app/NmAByzvdmM8EfTtNsYMGEo/',
    interval: 10,
    tempLength: 5,
    delay: 10,
    step: async (page) => {},
    infoFormat: (page) => (
        page.evaluate(() => ({
            content: {
                top: document.querySelectorAll('.UG_list_c .S_txt1')[0].innerText
            },
            sub: {
                date: new Date().toString().substr(0, 24),
                networkCheckPoint: null
            }
        }))
    ),
    network: {
        enable: false
    }
}]
