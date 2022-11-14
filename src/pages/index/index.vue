<template>
  <div class="wrapper">
    <view
      :style="{ display: current === 0 ? 'block' : 'none' }"
      class="main content"
    >
      <shower fetchType="diy" @clickImg="toMaker" />
    </view>
    <view
      :style="{ display: current === 1 ? 'block' : 'none' }"
      class="main content"
    >
      <shower fetchType="source" @clickImg="previewImg" />
    </view>
    <view :style="{ display: current === 2 ? 'block' : 'none' }" class="main">
      <like />
    </view>

    <view class="tabbar flex flex-mid">
      <view
        class="tabbar-item flex-1 flex flex-mid flex-col"
        :class="{ 'tabbar-item-cur': current === index }"
        @tap="changeTabbar(index)"
        v-for="(item, index) in tabbarConf"
        :key="index"
      >
        <image
          class="tabbar-image"
          mode="scaleToFill"
          :src="current === index ? item.img : item.curImg"
        ></image>
        <view class="tabbar-text">{{ item.text }}</view>
      </view>
    </view>
  </div>
</template>

<script>
import shower from "../../components/shower.vue";
import like from "../../components/like";
export default {
  components: {
    shower,
    like,
  },
  data() {
    return {
      current: 0,
      tabbarConf: [
        {
          img: "/static/assets/icon1s.jpg",
          curImg: "/static/assets/icon1s.jpg",
          text: "自己做",
        },
        {
          img: "/static/assets/icon2s.jpg",
          curImg: "/static/assets/icon2s.jpg",
          text: "找素材",
        },
        {
          img: "/static/assets/icon3s.jpg",
          curImg: "/static/assets/icon3s.jpg",
          text: "我的",
        },
      ],
    };
  },
  methods: {
    changeTabbar(index) {
      this.current = index;
    },
    toMaker(opt) {
      wx.navigateTo({
        url: `/pages/maker/main?id=${opt.id}&url=${opt.url}`,
      });
    },
    previewImg(opt) {
      wx.previewImage({
        current: opt.url, // 当前显示图片的http链接
        urls: [opt.url], // 需要预览的图片http链接列表
      });
    },
  },
  onShareAppMessage() {
    return {
      title: this.$config.APP_NAME,
      path: `/pages/index/main`,
    };
  },

  onLoad(options) {
    if (options.url && options.id) {
      wx.navigateTo({
        url: "/pages/maker/main?id=" + options.id + "&url=" + options.url,
      });
    }

  /*   // 在页面中定义插屏广告
    let interstitialAd = null;

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: "adunit-e03dced854b04001",
      });
      interstitialAd.onLoad(() => {});
      interstitialAd.onError((err) => {});
      interstitialAd.onClose(() => {});
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      setTimeout(() => {
        interstitialAd.show().catch((err) => {
          console.error(err);
        });
      }, 15000);
    } */
  },
};
</script>

<style lang="scss">
$tabbar-height: 130rpx;
page {
  height: 100%;
  overflow: hidden;
}
.wrapper,
.content-area,
.content-area {
  height: 100%;
}

.main {
  height: calc(100% - #{$tabbar-height});
  overflow: hidden;
}

.tabbar {
  background: #fff;
  width: 100%;
  border-top: 1rpx #dedede solid;
  height: $tabbar-height;
  overflow: hidden;
}

.tabbar-item {
  /* padding: 20rpx; */
  height: 100%;
  font-weight: bold;
  font-size: 22rpx;
}
.tabbar-item-cur {
  color: #0f79b4;
}

.tabbar-item-cur {
  .tabbar-image {
    transform: scale(1.4);
  }
}
.tabbar-image {
  transition: all 0.3s ease;
  width: 60rpx;
  height: 60rpx;
}
.tabbar-text {
  margin-top: 10rpx;
}
</style>
