const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com/');
    await page.focus('#kw');
    await page.type('#kw', '天气', {delay: 100});
    await page.click('#su');
    setTimeout(async () => {
        const info = await page.evaluate(() => document.querySelector('.op_weather4_twoicon_weath').innerHTML);
        console.log('weather:', info.replace(/^\s*|\s*$/g, ''));
        browser.close()
    }, 2000)
})();