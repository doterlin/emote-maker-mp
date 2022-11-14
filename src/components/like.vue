<template>
	<div class="wrapper content-area">
		<view class="user-header">
			<open-data class="avatar" type="userAvatarUrl"></open-data>
			<open-data class="nickname" type="userNickName"></open-data>
		</view>
		
		<i-cell-group>
			<i-cell title="我的收藏" is-link url="/pages/myFav/main"></i-cell>
			<i-cell title="建议反馈" is-link url="/pages/feedback/main"></i-cell>
			<i-cell title="赞赏作者" @click="appreciate"></i-cell>
		</i-cell-group>
			<view class="footer-fixed">
				<!-- <view class="statement contact-txt">投放广告是为了支持我服务器费用和时间投入，感谢支持！</view> -->
				<view class="statement contact-txt red">个人开发者，服务器有限，gif动图生成会变成静态图，请知悉！</view>
				<view class="statement contact-txt">本应用所有图片资源均来自网络，如有侵权请联系作者进行删除</view>
				<div class="contact-txt contact-email-txt"><i-icon type="mail" /> 453845311@qq.com</div>
			</view>
	</div>
</template>

<script>
export default {
	methods: {
		appreciate(){
			console.log('appreciate');
			wx.previewImage({
			  urls: ['https://6e6f-note-1888d4-1258018830.tcb.qcloud.la/qrcode.jpg?sign=6b2f375d3f5b6af2bf863795bee155ad&t=1572343078']
			})
			
		}
	}
};
</script>

<style scoped lang="scss">
$tabbar-height: 130rpx;
.content {
	padding: 0;
}
.footer-fixed{
	position: fixed;
	bottom: $tabbar-height + 10rpx;
	width: 100%;
	text-align: center;
}
.user-header {
	background: linear-gradient(to right, #536976 , #292E49);
	padding: 60rpx 0;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;

	.avatar {
		width: 140rpx;
		height: 140rpx;
		overflow: hidden;
		border-radius: 100%;
		border: 10rpx solid #bbbec4;
	}
	.nickname {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #fff;
	}
}

.contact-txt {
	color: #BFBFBF;
	font-size: 22rpx;
	margin: 20rpx;
	text-align: center;
}

.contact-txt.red {
	color: #B43E1F;
}
.contact-txt.contact-email-txt {
	margin: -16rpx 0 10rpx;
}
</style>
