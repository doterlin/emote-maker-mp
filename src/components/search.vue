<template>
	<div class="search-wrapper">
		<input class="search-input" maxlength="20" v-model="keyword" type="text" confirm-type="search" placeholder="搜索表情包，作者在努力更新中..." @confirm="comfirm" />
		<div class="search-tip">共找到<text class="search-primary">{{number}}</text>个, 长按表情可收藏</div>
	</div>
</template>

<script>
export default {
  props: ['number'],
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    comfirm () {
      this.$emit('comfirm', this.keyword)
    }
  }
}
</script>

<style scoped lang='scss'>
	@import '../theme/theme.scss';
	
	.search-wrapper{
		height: 140rpx;
		color: $font-color;
		font-size: $font-size;
		overflow: hidden;
		padding: 20rpx 0;
		box-sizing: border-box;
	}
	
	.search-tip{
		font-size: $font-size - 2rpx;
		margin-top: 10rpx;
		text-align: center;
	}
	.search-primary{
		color: #2d8cf0;
		padding: 0 10rpx;
	}
	
	.search-input{
		border: 1rpx solid #ddd;
		border-radius: 66rpx;
		height: 66rpx;
		line-height: 64rpx;
		padding: 0 18rpx;
		background: #fff;
	}
</style>
