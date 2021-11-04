<template>
  <div class="hello">
    <h1>{{msg}}</h1>
    <h2>我是测试页面</h2>
  </div>
</template>
<script>
export default {
  name: "test",
  data() {
    return {
      msg: "welcome vue world"
    };
  }
};
</script>

// add "scoped" attribute to limit css to this component only
<style scoped>
h1，h2 {
  font-weight: normal;
  color: #42b983;
}
</style>
