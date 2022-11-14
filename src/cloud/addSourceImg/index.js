const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
const qiniu = require('qiniu')

cloud.init({
  env: 'develop-u9id2'
})

const db = cloud.database()
const sourceCol = db.collection('image')

const accessKey = 'wdhbN6BJ6TRmoxvQSxoj-W3n5hpP9cqEGqA0XvrI'
const secretKey = 'xUG07GGQPlB5v_k2U11v9CUyIoGwMPFVU4eh8Lbt'
const bucket = 'emote-maker'
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const putPolicy = new qiniu.rs.PutPolicy({
  scope: bucket
})
let uploadToken = putPolicy.uploadToken(mac)
let config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z2 // 华南机房
config.useCdnDomain = true
let formUploader = new qiniu.form_up.FormUploader(config)
let putExtra = new qiniu.form_up.PutExtra()
const imgDomain = 'http://pz1f65wii.bkt.clouddn.com/' // 对外图片访问域名

// 定时更新token
setInterval(() => {
  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket
  })
  uploadToken = putPolicy.uploadToken(mac)
}, 1000 * 60 * 4)

exports.main = async (event, context) => {
  const imgSoucePath = path.resolve('../../../bqb-img/static', './')
  const imgDiyPath = path.resolve('../../../bqb-img/diy', './')

  let files = fs.readdirSync(imgSoucePath)
  files = files.slice(2400) // TODO: 暂时跳过一部分
  console.log('static', ' 总个数', files.length)
  group(files, 4).forEach((arr, index) => { // 分n组同步进行, 注意n不能太大, 否则数据查询报错
    setTimeout(() => {
      handleImgs(arr, 'static', ' [数组' + index + '] ', imgSoucePath)
    }, index * 2000 + 10) // 尽量错开时间
  })

  // handleImgs(imgDiyPath, 'diy')
  // const fileStream = fs.createReadStream(path.join(imgSoucePath, 'demo.jpg'))
  // return await cloud.uploadFile({
  //   cloudPath: 'demo.jpg',
  //   fileContent: fileStream,
  // })
}

// 数组切割
function group (array, groupNum) {
  let subGroupLength = Math.floor(array.length / groupNum)
  let index = 0
  let newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength))
  }
  return newArray
}

// 存储图片和记录db， type为图片类型，1是diy， 2是素材
async function handleImgs (files, type, arrId, imgPath) {
  console.log(arrId, type, ' 个数', files.length)

  // DEBUG, don`t delete this
  // const _get = await get('心平气和 切勿急躁（汤普森）.jpg', type);
  // if(_get.data.length > 0){
  // 	let ids = _get.data.filter((_item,index) => index > 0).map((_item, index)=>{
  // 		return _item._id
  // 	})
  // 	console.log('_get', _get, ids)
  // 	remove(ids)
  // }

  let succNum = 0,
    failNum = 0,
    index = 0,
    dumpNum = 0
  handelFiles() // 主入口

  async function handelFiles () {
    // console.log(`当前任务, type: ${type} index: ${index}`)
    const item = files[index]
    const savePath = type + '/' + index + '/' + item

    if (index >= files.length - 1) {
      return console.log(arrId + 'handleImgs type ' + type + ' end! ', {
        succNum,
        failNum,
        dumpNum
      })
    }

    try {
      const _get = await get(item, type)
      if (_get.data.length > 0) {
        console.warn('重复: ', arrId, index, item)
        dumpNum++
        let ids = _get.data.filter((_item, index) => index > 0).map((_item, index) => {
          return _item._id
        })
        await remove(ids) // 去重, 除了第一个, 其他去掉
        index++
        handelFiles()
        return
      }
    } catch (e) {
      console.error('Catch "get() or remove()" error', arrId, index, item)
      setTimeout(() => {
        // index++
        handelFiles()
      }, Math.random() * 100 + 20)
      return
    }
    const uploadImgRes = await uploadImg(path.join(imgPath, item), savePath)

    if (!!uploadImgRes && !!uploadImgRes.respBody && !!uploadImgRes.respBody.hash) {
      try {
        const uploadImgInfoRes = await uploadImgInfo({
          index: index,
          desc: item,
          url: imgDomain + encodeURIComponent(savePath),
          key: uploadImgRes.respBody.key,
          hash: uploadImgRes.respBody.hash,
          date: new Date(),
          type
        })
        if (uploadImgInfoRes) succNum++
        else failNum++
      } catch (e) {
        console.error('Catch "add()" error: ', arrId, index, item)
        setTimeout(() => {
          handelFiles()
        }, Math.random() * 200 + 20)
        return
      }
    } else {
      failNum++
      // console.log('uploadImgRes2:', uploadImgRes)
    }
    index++
    handelFiles()
  }
}

// 存储图片
async function uploadImg (filePath, key) {
  // 文件上传
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, filePath, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        throw respErr
      }
      if (respInfo.statusCode == 200) {
        // console.log('formUploader qiqiu succ: ',respBody, respInfo);
      } else {
        console.error('formUploader qiqiu error: ', respInfo.statusCode, respBody)
      }
      resolve({
        respErr,
        respBody,
        respInfo
      })
    })
  })
}

// 是否存在
async function get (desc, type) {
  return await sourceCol.where({
    desc,
    type
  }).get()
}

// 删除相关记录
async function remove (ids) {
  if (ids.length <= 0) return true
  return await sourceCol.where({
    _id: db.command.in(ids)
  }).remove()
}

// 上传文件信息到db
async function uploadImgInfo (fileInfo) {
  return await sourceCol.add({
    data: fileInfo
  })
}
