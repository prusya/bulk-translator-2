<template>
  <div id="languages">
    <div class="row space">
      <div class="col-sm-4 text-center">
        <b-button @click="revert_checkboxes">Revert Checkboxes</b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="save_checkboxes">Save Checkboxes</b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="reset_checkboxes">Reset Checkboxes</b-button>
      </div>
    </div>
    <div class="row space">
      <div class="col-sm-4" v-for="lang in current_langs">
        <b-form-checkbox :id="lang.short_name"
                         :value="lang.short_name"
                         :checked="lang.selected ? lang.short_name : ''"
                         :unchecked-value="lang.short_name"
                         @change="checkbox_change"
                         class="label">
          {{ lang.full_name }}
        </b-form-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
  const jetpack = require('fs-jetpack')
  import {Lang} from '../../shared.js'

  export default {
    data () {
      return {
        current_langs: this.$store.state.CurrentLanguages.langs,
        langs: this.$store.state.Languages.langs,
        gpc_langs: this.$store.state.Languages.gpc_langs,
      }
    },
    mounted() {
      console.log('Languages mounted')
      this.build_checkboxes()
    },
    methods: {
      build_checkboxes() {
        console.log('build_checkboxes')
        var saved_langs = jetpack.read(__static +
          '/store/lang_state.json', 'json')
        for (var short_name in this.langs) {
          var full_name = this.langs[short_name]
          var gpc_name = this.gpc_langs[short_name]
          var selected = saved_langs[short_name] ? true : false
          this.$store.commit('add_lang', new Lang(short_name, full_name,
            gpc_name, selected))
        }
      },
      revert_checkboxes() {
        console.log('revert_checkboxes')
        this.current_langs.forEach(e => {
          this.$store.commit('revert_selected', e.short_name)
        })
      },
      save_checkboxes() {
        console.log('save_checkboxes')
        var selected = this.current_langs.filter(x => x.selected == true)
        var state = {}
        selected.forEach(e => {
          state[e.short_name] = e.full_name
        })
        jetpack.write(__static +
          '/store/lang_state.json', state)
      },
      reset_checkboxes() {
        console.log('reset_checkboxes')
        var saved_langs = jetpack.read(__static +
          '/store/lang_state.json', 'json')
        this.current_langs.forEach(e => {
          if (saved_langs[e.short_name] && !e.selected ||
            !saved_langs[e.short_name] && e.selected) {
            this.$store.commit('revert_selected', e.short_name)
          }
        })
      },
      checkbox_change(e) {
        console.log('checkbox_change')
        if (this.current_langs.find(x => x.short_name == e)) {
          this.$store.commit('revert_selected', e)
        }
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
