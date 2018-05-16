const router = require('koa-router')()
var request = require('request')
var cheerio = require('cheerio')

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
    // 爬取内容
    let readWebData = function() {
        return new Promise((resolve, reject) => {
            request('http://cr5p.com', (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let $ = cheerio.load(body)
                    let hrefs = []
                    let pictures = []
                    let data = []
                    let domain = 'http://cr5p.com'

                    $('.prdList a').map((item, ele) => {
                        hrefs.push(ele.attribs.href)
                    })
                    $('.prdList img').map((item, ele) => {
                        pictures.push(ele.attribs.src)
                    })

                    for (let i = 0; i < pictures.length; i++) {
                        data.push({
                            href: domain + hrefs[i],
                            picture: domain + pictures[i]
                        })
                    }
                    resolve({
                        data: JSON.stringify(data)
                    })
                } else {
                    reject({data: false})
                }
            })
        })
    }

    await ctx.render('index',  await readWebData())
})

module.exports = router
