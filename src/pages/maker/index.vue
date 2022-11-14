<template>
	<div class="maker-container page">
		<canvas v-show="!showCropper" canvas-id="maker" class="maker" style="width: 600rpx; height: 600rpx;" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" />
		<div class="flex flex-bet maker-header">
			<button @click="doCustomer" class="m-button">自定义图片</button>
			<button open-type="share" class="m-button warn">分享一下吧！</button>
		</div>
		<div class="maker-area" v-if="inited">
			<div class="input-wrapper flex flex-bet">
				<i-input :value="userText[selectedIndex].txt" @change="changeTxt" :placeholder="userText[selectedIndex].plc" maxlength="-1" class="input" />
				<i-icon type="right" size="28" color="#3EC983" i-class="bold" @click="completeText" />
				<i-icon type="close" size="22" color="#D34827" i-class="bold" class="ml20" @click="removeLastText" />
			</div>
			<!-- <i-divider content="可拖动文字进行位移" height="32" class="divider-txt"></i-divider> -->
			<div class="setting">
				<span class="label">字号</span>
				<slider
					activeColor="#2d8cf0"
					min="10"
					max="50"
					:value="userText[selectedIndex].fontSize"
					@changing="changeFontsize"
					@change="changeFontsize"
					class="input-number"
				/>
				<!-- <i-input-number min="10" max="50" :value="userText[selectedIndex].fontSize" @change="changeFontsize" class="input-number"/> -->
			</div>
			<div class="setting">
				<span class="label">颜色</span>
				<color-selector @changeColor="changeColor" :currentColor="userText[selectedIndex].currentColor" />
			</div>
			<div class="btn-area">
				<!-- <button open-type="share" class="m-button warn share-button">分享模版</button> -->
				<button @click="doMake" class="m-button save large">生成表情</button>
			</div>
		</div>

		<!-- cropper -->
		<div class="cropper-area" v-show="showCropper">
			<div class="cropper-wrapper">
				<mpvue-cropper
					ref="cropper"
					:option="cropperOpt"
					@ready="cropperReady"
					@beforeDraw="cropperBeforeDraw"
					@beforeImageLoad="cropperBeforeImageLoad"
					@beforeLoad="cropperLoad"
				></mpvue-cropper>
			</div>
			<div class="cropper-buttons" :style="{ color: cropperOpt.boundStyle.color }">
				<div class="upload btn" @tap="uploadTap">更换图片</div>
				<div class="flex">
					<div class="getCropperImage btn" :style="{ backgroundColor: '#D34827' }" @tap="showCropper = false">取消</div>
					<div class="getCropperImage btn" :style="{ backgroundColor: cropperOpt.boundStyle.color }" @tap="getCropperImage">确定</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import colorSelector from '../../components/color-selector';
import { doAnimationFrame, abortAnimationFrame, rpx2px } from '../../utils';
import MpvueCropper from 'mpvue-cropper';

let wecropper;
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 100 * width/750;

let ctx;
const initText = [
	{
		txt: '输入文字',
		currentColor: '#000',
		fontSize: 20,
		x: rpx2px(300),
		y: rpx2px(600) - 50
	},
	{
		txt: '',
		currentColor: '#000',
		fontSize: 20,
		x: rpx2px(300),
		y: rpx2px(600) - 30
	},
	{
		txt: '',
		currentColor: '#000',
		fontSize: 20,
		x: rpx2px(300),
		y: rpx2px(600) - 10
	}
];

export default {
	components: {
		'color-selector': colorSelector,
		MpvueCropper
	},
	data() {
		return {
			// userText: initText.map(item => ({...item})),
			inited: false,
			oneText: {
				txt: '',
				plc: '输入第{{index}}组文字, 可拖动文字',
				x: rpx2px(300),
				y: rpx2px(600) - 50
			},
			userText: [],
			curFontSize: 16,
			curColor: '#000',
			selectedIndex: 0, // 当前操作的文本index
			path: '', // 加载下来的模版的temp path，要想在canvas里面绘制img，必须加载到本地，不能直接引用远程地址

			showCropper: false,
			cropperOpt: {
				//cropper配置
				id: 'cropper',
				targetId: 'targetCropper',
				pixelRatio: device.pixelRatio,
				width,
				height,
				scale: 4,
				zoom: 8,
				cut: {
					x: (width - rpx2px(600)) / 2,
					y: (height - rpx2px(600)) / 2,
					width: rpx2px(600),
					height: rpx2px(600)
				},
				boundStyle: {
					color: '#04b00f',
					mask: 'rgba(0,0,0,0.8)',
					lineWidth: 1
				}
			}
		};
	},
	watch: {
		userText: {
			handler: function() {
				this.updateCanvas();
			},
			deep: true
		}
	},
	methods: {
		doCustomer() {
			this.showCropper = true;
		},
		removeLastText() {
			if (this.selectedIndex === 0) return (this.userText[this.selectedIndex].txt = '');
			this.selectedIndex--;
			this.userText.splice(-1);
		},
		completeText() {
			if (this.userText[this.selectedIndex].txt === '')
				return wx.showToast({
					title: '请输入文字哦!',
					icon: 'none',
					duration: 1000
				});
			this.selectedIndex++;
			this.addText();
		},
		addText() {
			let _oneText = {
				...this.oneText,
				// txt: this.oneText.txt.replace('{{index}}', this.selectedIndex + 1),
				plc: this.oneText.plc.replace('{{index}}', this.selectedIndex + 1),
				currentColor: this.curColor,
				fontSize: this.curFontSize,
				y: rpx2px(600) - Math.abs(50 - 20 * this.selectedIndex)
			};
			this.userText.push(_oneText);
			// this.selectedIndex++
		},
		touchstart(e) {
			this.userText[this.selectedIndex].x = e.x;
			this.userText[this.selectedIndex].y = e.y;
			this.updateCanvas();
		},
		touchmove(e) {
			this.userText[this.selectedIndex].x = e.x;
			this.userText[this.selectedIndex].y = e.y;
			this.animationId = doAnimationFrame(this.updateCanvas); // touch move的时候节流一下 可能性能会好些（心理作用😂 ）
		},
		touchend(e) {
			abortAnimationFrame(this.animationId);
		},
		changeTxt({ mp }) {
			this.userText[this.selectedIndex]['txt'] = mp.detail.detail.value;
		},
		changeColor(color) {
			this.userText[this.selectedIndex]['currentColor'] = color;
		},
		changeFontsize({ mp }) {
			this.userText[this.selectedIndex]['fontSize'] = mp.detail.value;
		},
		changeSelectedIndex({ mp }) {
			this.selectedIndex = mp.detail.key;
		},
		updateCanvas() {
			ctx.drawImage(this.path, 0, 0, rpx2px(600), rpx2px(600));
			ctx.setTextAlign('center'); // 必须每次在updateCanvas重新设置，否则模拟器上生效但真机下不会生效
			this.userText.forEach(item => {
				ctx.font = `bold ${item.fontSize}px/${item.fontSize}px sans-serif`;
				ctx.setFillStyle(item.currentColor);
				ctx.fillText(item.txt, item.x, item.y);
			});
			ctx.draw();
		},
		doMake() {
			wx.canvasToTempFilePath({
				canvasId: 'maker',
				success: function(res) {
					wx.previewImage({
						current: res.tempFilePath,
						urls: [res.tempFilePath]
					});
				}
			});
		},
		share() {},

		cropperReady(...args) {
			console.log('cropper ready!');
		},
		cropperBeforeImageLoad(...args) {
			console.log('before image load');
		},
		cropperLoad(...args) {
			console.log('image loaded');
		},
		cropperBeforeDraw(...args) {
			// Todo: 绘制水印等等
		},
		uploadTap() {
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: res => {
					const src = res.tempFilePaths[0];
					//  获取裁剪图片资源后，给data添加src属性及其值

					wecropper.pushOrigin(src);
				}
			});
		},
		getCropperImage() {
			wecropper
				.getCropperImage({ original: true })
				.then(src => {
					// wx.previewImage({
					//   current: '', // 当前显示图片的http链接
					//   urls: [src] // 需要预览的图片http链接列表
					// })
					this.initImg(src);
					this.showCropper = false;
				})
				.catch(e => {
					console.error('获取图片失败');
					this.showCropper = false;
					wx.showToast({
						title: '自定义图片失败!',
						icon: 'none',
						duration: 1000
					});
				});
		},

		initImg(url) {
			const imageResource = !!url ? url : this.$root.$mp.query.url;
			wx.getImageInfo({
				src: imageResource,
				success: res => {
					// 重置文本
					this.userText = [];
					this.selectedIndex = 0;
					this.addText();
					this.path = res.path;
					this.inited = true;
				}
			});
		}
	},
	mounted() {
		wecropper = this.$refs.cropper;
	},
	onLoad() {
		ctx = wx.createCanvasContext('maker');
		this.initImg();
	},
	onShareAppMessage() {
		return {
			title: !this.userText[0].txt ? '我发现了个斗图神器！': this.userText[0].txt,
			path: `/pages/index/main?id=${this.$root.$mp.query.id}&url=${this.$root.$mp.query.url}`
		};
	}
};
</script>

<style>
page {
	height: 100%;
	overflow: hidden;
}
.maker-container {
	margin-top: 30rpx;
	height: 100%;
}

.maker-header {
	margin: 20rpx auto 10rpx;
	/* margin-top: 20rpx; */
	width: 600rpx;
}
.maker {
	/* width: 300px; */
	/* height: 300px; */
	margin: 0 auto;
	background-size: contain;
	border: 1px solid #dddee1;
}
.maker-area {
	width: 300px;
	margin: 0 auto;
	position: relative;
}

.input {
	margin: 20rpx 0;
	margin-right: 20rpx;
	border: 1px solid #dddee1;
	width: 100%;
}
.label {
	font-size: 14px;
	width: 80rpx;
	display: inline-block;
	line-height: 60rpx;
}
.input-number {
	display: inline-block;
	width: 100%;
}
.btn-area {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.button {
	flex: 1;
}
.divider-txt {
	top: -10rpx;
	position: relative;
}
.share-button {
	margin-right: 20rpx;
}
.button button {
	margin: 0;
}
.setting {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}
.save {
	display: block;
	width: 100%;
}

/* cropper  */
.cropper-area {
	position: fixed;
	top: 0;
	height: 100%;
	left: 0;
	z-index: 10;
}
.cropper-wrapper {
	position: relative;
	top: 0;
	height: 100%;
	background-color: #e5e5e5;
	overflow: hidden;
}

.cropper-buttons {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	line-height: 100rpx;
}

.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
	text-align: center;
}

.cropper {
	position: absolute;
	top: 0;
	left: 0;
}

.cropper-buttons {
	background-color: #090909;
}

.btn {
	height: 60rpx;
	line-height: 60rpx;
	padding: 0 24rpx;
	border-radius: 2px;
	color: #ffffff;
	margin-left: 10rpx;
}
</style>
