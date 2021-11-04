<template style="margin-top:20px;">
  <div class="mod-home">
    <!-- <el-button @click="jumpRunList" type="primary">跑步列表</el-button> -->
    <router-link to="/runList">
      <button>跑步列表</button>
    </router-link>
    <!-- <router-link to="/weekCount">
      <button>按周统计</button>
    </router-link> -->
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {};
  },
  methods: {
    jumpRunList() {
      this.$router.push("/runList");
    }
  }
};
</script>

<style>
.mod-home {
  line-height: 1.5;
  float:left;
}
</style>

