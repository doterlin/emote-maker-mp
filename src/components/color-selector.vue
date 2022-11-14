<template>
  <div class="color-container">
    <div v-for="color in colors" :style="{'background-color':color}" :class="{'color-item':true,'selected':currentColor===color}" :data-color="color" @click="handleClick" :key="color"></div>
  </div>
</template>

<script>
export default {
  props: ['currentColor'],
  data () {
    return {
      colors: ['#000', '#fff', '#ed3f14', '#80848f', '#19be6b', '#2d8cf0', '#ff9900']
    }
  },
  methods: {
    handleClick (e) {
      const color = e.target.dataset.color
      this.$emit('changeColor', color)
    }
  }

}
</script>

<style>
.color-container{
  display: flex;
  justify-content: space-between;
  flex: 1;
}
.color-item {
	transition: all .2s ease;
  width: 46rpx;
  height: 46rpx;
  border-radius: 50%;
  display: inline-block;
	border: 2rpx solid #dddee1;
}
.selected{
	transform: scale(1.3);
}
</style>
