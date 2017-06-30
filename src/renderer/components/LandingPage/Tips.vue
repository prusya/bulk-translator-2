<template>
  <div id="tips">
    <div class="row space">
      <div class="col-sm-12">
        <b-list-group class="label">
          <b-list-group-item>
            Ctrl + Shift + I to open console
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    mounted() {
      console.log('Tips mounted')
    }
  }
</script>

<style scoped>
  .label {
    color: #2c3e50;
    font-size: 18px;
    font-weight: bold;
  }
</style>
