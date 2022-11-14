const fs = require('fs')
const Crawler = require('crawler') // 爬虫工具

exports.main = async (event, context) => {
  // diy任务
  const diyTask = new Task('https://fabiaoqing.com/diy/lists/page/{{index}}.html', 39, 'diy', 'diy-2019-10-29.json') // 每次跑需修改pagenum, 文件名等
  diyTask.run()

  // source任务
  // const sourceTask = new Task('https://fabiaoqing.com/biaoqing/lists/page/{{index}}.html', 200, 'source', 'source-2019-10-29.json');
  // sourceTask.run();
}

class Task {
  constructor (urlTpl, maxPage, type, outputFileName) {
    this.url = urlTpl
    this.maxPage = maxPage
    this.type = type
    this.fileName = outputFileName

    this.index = 1
    this.number = 0
    this.c = null
    this.result = '' // result存储爬取结果
    this.imgSelector = 'img.ui.image.lazy'
  }

  run () {
    this._init()
    this._getImgInfo()
  }

  _init () {
    let ts = this
    ts.c = new Crawler({
      // 在每个请求处理完毕后将调用此回调函数
      maxConnections: 5,
      callback: function (error, res, done) {
        console.log('crawler catched: ', ts._getUrl())
        if (error) {
          console.log(error)
        } else {
          var $ = res.$
          $(ts.imgSelector).each(async function (item) {
            try {
              let data = {
                desc: this.attribs.title,
                url: ts._trans2https(this.attribs['data-original']),
                date: new Date(),
                type: ts.type
              }
              ts.result += (JSON.stringify(data) + '\n')
              ts.number++
            } catch (e) {
              // TODO handle the exception
            }
          })
        }

        ts.index++
        if (ts.index <= ts.maxPage) {
          ts._getImgInfo()
        } else {
          console.warn(`[${ts.type}]getImgInfo end!! number: ${ts.number}`)
          fs.writeFile(ts.fileName, ts.result, function (err) {
            if (err) { console.error('write fail!!') }
          })
        }
        done()
      }
    })
  }

  _getImgInfo () {
    this.c.queue(this._getUrl())
  }

  _trans2https (url) {
    return url.replace('http://', 'https://')
  }

  _getUrl () {
    return this.url.replace('{{index}}', this.index)
  }
}
