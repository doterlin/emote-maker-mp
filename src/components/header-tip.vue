<template>
	<view class="header-tip">
		
	</view>
</template>

<script>
export default {
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    comfirm () {
      if (this.keyword === '') {
        return wx.showToast({
          title: '请输入关键字',
          icon: 'none',
          duration: 1500
        })
      }
      this.$emit('comfirm', this.keyword)
    }
  }
}
</script>

<style scoped lang='scss'>
	@import '../theme/theme.scss';
	
	.search-wrapper{
		overflow: hidden;
		padding: 20rpx $padding;
		box-sizing: content-box;
	}
	
	.search-input{
		border: 1rpx solid #ddd;
		border-radius: 66rpx;
		height: 66rpx;
		line-height: 64rpx;
		padding: 0 18rpx;
		background: #fff;
		color: $font-color;
		font-size: $font-size;
	}
</style>
