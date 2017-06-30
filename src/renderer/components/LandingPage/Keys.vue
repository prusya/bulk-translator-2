<template>
  <div id="keys">
    <div class="row space">
      <div class="col-sm-4 text-center">
        <b-button @click="save_key">Load Key</b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="remove_all_keys">Remove All Keys</b-button>
      </div>
    </div>

    <div class="row space">
      <div class="col-sm-12">
        <b-list-group class="label">
          <b-list-group-item v-for="key in current_keys"
                             :key="key.client_email">
            <div class="col-sm-10">{{key.client_email}}</div>
            <div class="col-sm-2">
              <b-button @click="remove_key" :tag="key.client_email">
                Remove
              </b-button>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
  </div>
</template>

<script>
  const jetpack = require('fs-jetpack')
  const dialog = require('electron').remote.dialog

  export default {
    data () {
      return {
        current_keys: this.$store.state.Keys.keys
      }
    },
    mounted() {
      console.log('Keys mounted')
      this.load_keys()
    },
    methods: {
      load_keys() {
        console.log('load_keys')
        this.$store.commit('flush_keys')
        jetpack.find(__static + '/store/keys/', {matching: '*.json'})
          .forEach(file => {
            var key_obj = jetpack.read(file, 'json')
            this.$store.commit('add_key', key_obj)
          })
      },
      save_key() {
        console.log('save_key')
        var full_path = dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            {name: 'JSON Files', extensions: ['json']}
          ]
        })
        if (full_path !== undefined) {
          var file_name = /.*\\(.*)/.exec(full_path[0])[1]
          console.log('saving key', file_name)
          jetpack.copy(full_path[0],
            __static + '/store/keys/' + file_name)
          this.load_keys()
        }
      },
      remove_all_keys() {
        console.log('remove_all_keys')
        jetpack.find(__static + '/store/keys/', {matching: '*.json'})
          .forEach(file => {
            console.log('removing', file)
            jetpack.remove(file)
          })
        this.load_keys()
      },
      remove_key(e) {
        console.log('remove_key')
        var client_email = e.target.attributes.tag.value
        jetpack.find(__static + '/store/keys/', {matching: '*.json'})
          .forEach(file => {
            var key_obj = jetpack.read(file, 'json')
            if (key_obj.client_email == client_email) {
              console.log('removing', file)
              jetpack.remove(file)
            }
          })
        this.load_keys()
      }
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
