# customPush

> 任意网络信息定制化推送服务

 [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Usage

```bash
git clone https://github.com/browniu/customPush.git && npm i && node index.js
```

## Config

```javascript
// index.js
//...
const configIndex = 1
//...
```



```jsx
// infoConfig.js
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
    tempLength: 3,
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

```

| Keys       | Description                |
| ---------- | -------------------------- |
| title      | 推送标题                   |
| target     | 推送目标服务器             |
| url        | 获取信息的目标站点地址     |
| interval   | 信息检索间隔(min)          |
| tempLength | 查重库容量                 |
| step       | 页面操作步骤               |
| infoFormat | 信息内容格式               |
| network    | 网络延迟判断标示           |
| delay      | 执行页面操作步骤后延迟时间 |

## Requirements

* [Bark](https://github.com/Finb/Bark) 推送客户端
* [Puppeteer](https://github.com/GoogleChrome/puppeteer) 脚本浏览器

## Update

### 0.0.1
* 实现预期功能

## License

MIT © browniu [browniu](https://github.com/browniu)
