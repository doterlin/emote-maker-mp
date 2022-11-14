<template>
	<div class="wrapper">
		<text class="tip">您如有任何建议和bug反馈请点击下方按钮提交：</text>
		<button open-type="feedback" class="m-button save large">去反馈</button>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			content: '',
			email: '',
			nickname: ''
		};
	},
	methods: {

	},
	onLoad() {},
	onShareAppMessage() {
		return {
			title: this.$config.APP_NAME,
			path: `/pages/index/main`
		};
	}
};
</script>

<style>
.wrapper,
page {
	height: 100%;
	background: #f7f7f7;
}

.save{
	margin-top: 30rpx;
}

.wrapper{
	padding: 30rpx;
}
.tip{
	margin-bottom: 20rpx;
	font-size: 28rpx;
	color: #666;
}

.form {
	/* padding: 0 10rpx; */
	background: #fff;
}

.submit {
	padding: 0 20rpx;
	margin-top: 40rpx;
}
</style>
