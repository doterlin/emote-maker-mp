<!-- 搜索和列表展示组件 -->
<template>
	<div class="wrapper">
		<div class="content-area">
			<search @comfirm="doSearch" :number="count" />

			<scroll-view @scroll="onScroll" :scroll-y="true" class="result-wrapper" @scrolltolower="loadMore" enable-flex="true">
				<image
					v-for="(img, index) in templateList"
					:id="'img-' + index"
					:data-id="img._id"
					:src="img.url"
					:data-url="img.url"
					:alt="img.desc"
					class="image"
					@tap="clickImage"
					@longpress="likeImg"
					:key="img.url"
					:class="{'no-margin': (index + 1) % 3 === 0}"
				/>
				<view class="loadding" :style="{ visibility: spinShow ? 'visible' : 'hidden' }">正在加载...</view>
				<view class="result-plc" id="plc"></view>
			</scroll-view>
		</div>
	</div>
</template>

<script>
import search from './search.vue'
// const { $Message } = require('../../static/iview/base/index');

export default {
  props: {
    fetchType: String
  },
  data () {
    return {
      imgIndex: '',
      query: '',
      templateList: [],
      spinShow: true,
      current: 1, // 当前页
      count: 1, // 总页数
      loadding: false,
      onePageNum: 18,
      maxFavNum: 500
    }
  },
  components: {
    search
  },
  methods: {
    doSearch (key) {
      console.log('search:', key)
      this.query = key
      this.search()

      wx.reportAnalytics('search_key', {
        type: this.fetchType,
        key: key
      })
    },
    likeImg ({ mp }) {
      let data = mp.target.dataset
      var favImgs = wx.getStorageSync('fav_imgs') || []
      if (favImgs.length >= this.maxFavNum) {
        return wx.showToast({
				  title: '收藏失败, 收藏个数达到上限!',
				  icon: 'none',
				  duration: 1000
        })
      }
      // console.log('favImg', {id: data.id, url: data.url, type: this.fetchType})
      if (!favImgs.some(item => data.id === item.id)) {
        favImgs.push({id: data.id, url: data.url, type: this.fetchType})
        wx.setStorageSync('fav_imgs', favImgs)
        wx.showToast({
				  title: '收藏成功!',
				  icon: 'success',
				  duration: 1000
        })
      } else {
        wx.showToast({
				  title: '该表情已收藏过!',
				  icon: 'none',
				  duration: 1000
        })
      }
    },
    search () {
      // 重置翻页
      this.current = 1
      this.getPics(true)
    },
    clickImage ({ mp }) {
      this.$emit('clickImg', {url: mp.target.dataset.url, id: mp.target.dataset.id})
      // wx.navigateTo({
      // 	url: `/pages/maker/main?url=${mp.target.dataset.url}`
      // });
    },

    loadMore () {
      // console.log('@scrolltolower!!!');
      this.current++
      this.getPics()
    },

    async getCount (where) {
      const count = await this.$db.collection('imageLink').where(where).count()
      this.count = count.total
    },
    getPics (isReset) {
      this.spinShow = true
      this.loadding = true // 防止重复加载

      let condition = {
        type: this.fetchType
      }
      if (this.query) {
        condition.desc = this.$db.RegExp({ // 模糊查找
          regexp: '.*' + this.query.split('').join('.*') + '.*',
          options: 'i'
        })
      }
      if (isReset) wx.showLoading()
      this.$db
        .collection('imageLink')
        .where(condition)
        .skip((this.current - 1) * this.onePageNum) // 跳过结果集中的前 n 条，从第 n+1 条开始返回
        .limit(this.onePageNum) // 限制返回数量
        .get()
        .then(async res => {
          // console.log('response.data', res.data);
          if (isReset) {
            await this.getCount(condition)
            wx.hideLoading()
          }
          this.templateList = isReset ? res.data : this.templateList.concat(res.data)
          this.spinShow = false
          this.loadding = true
        })
        .catch(err => {
          console.error(err)
          this.loadding = false
          this.spinShow = false
        })
    }

  },
  created () {
    this.getCount({
      type: this.fetchType
    })
    this.getPics()
  }
}
</script>

<style scoped lang="scss">
.result-wrapper {
	box-sizing: border-box;
	height: calc(100% - 140rpx);
	overflow: hidden;
}
.result-plc {
	height: 20rpx;
	width: 100%;
}
.image {
	border-radius: 10rpx;
	box-shadow: 0 4rpx 25rpx -18rpx #333333;
	width: 216rpx;
	height: 216rpx;
	margin: 0 21rpx 18rpx 0;
	background: #fff;
	&.no-margin{
		margin-right: 0;
	}
}
</style>
