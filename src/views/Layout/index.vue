<template>
  <div class="v-body">
    <div class="v-sider">
      <Sider></Sider>
    </div>
    <div class="v-container">
      <div class="v-top">
        <Top></Top>
      </div>
      <div class="v-wrap">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Sider from './sider.vue'
import Top from './top.vue'
export default {
  components: {
    Sider, Top
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
