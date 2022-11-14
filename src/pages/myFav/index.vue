<!-- 搜索和列表展示组件 -->
<template>
	<div class="content">
		<div class="loadding" v-if="!loaded">正在加载...</div>
		<div class="img-list" v-else>
				<div class="tip">{{ favList.length === 0? '你还没有收藏任何表情哦!': ('一共收藏了' + favList.length + '个表情, 长按表情可取消收藏') }} </div>
				<image
					v-for="(img, index) in favList"
					:data-id="img.id"
					:src="img.url"
					:data-type="img.type"
					:data-url="img.url"
					class="image"
					@tap="toImg"
					@longpress="cancelLikeImg"
					:key="img.id"
					:class="{'no-margin': (index + 1) % 3 === 0}"
				/>
		</div>
	</div>
</template>

<script>

export default {
  data () {
    return {
      favList: [],
			loaded: false
    }
  },

  methods: {
		toImg({mp}){
			let data = mp.target.dataset;
			console.log(data.type)
			if(data.type === 'source'){
				wx.previewImage({
				  current: data.url, // 当前显示图片的http链接
				  urls: [data.url] // 需要预览的图片http链接列表
				})
			}else if(data.type === 'diy'){
				wx.navigateTo({
					url: `/pages/maker/main?id=${data.id}&url=${data.url}`
				});
			}
		},
		
    cancelLikeImg({ mp }){
			let id = mp.target.dataset.id;
			let index = this.getImgIndex(id);
			if(index!==null){
				this.favList.splice(index, 1);
				wx.setStorageSync('fav_imgs', this.favList);
			}
			
		},

		getImgIndex(id){
			let i = null;
			this.favList.forEach( (item, index) => {
				if(item.id === id) i = index;
			})
			return i;
		}
  },
  onLoad () {
    var favImgs = wx.getStorageSync('fav_imgs') || [];
		this.favList = favImgs;
		this.loaded = true;
  },
  onShareAppMessage() {
  	return {
  		title: this.$config.APP_NAME,
  		path: `/pages/index/main`
  	};
  }
}
</script>

<style lang="scss">
	@import '../../theme/theme.scss';
	
	page{
		height: 100%;
	}
	.content{
		height: 100%;
	}
	.tip{
		color: $font-color;
		width: 100%;
		font-size: $font-size - 2rpx;
		padding: 20rpx 0;
		text-align: center;
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
