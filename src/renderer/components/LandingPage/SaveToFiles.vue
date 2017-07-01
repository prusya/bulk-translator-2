<template>
  <div id="save_to_files">
    <div class="row space">
      <!--Empty space for tooltip-->
    </div>
    <div class="row space">
      <div class="col-sm-4 text-center">
        <label for="text_to_translate" class="label">Text to Translate:</label>
      </div>
      <div class="col-sm-7 text-center">
        <b-tooltip :content="text_to_translate_status" :show="show_tooltips">
          <b-form-input v-model="text_to_translate" type="text"
                        id="text_to_translate"
                        @input="text_to_translate_change">
          </b-form-input>
        </b-tooltip>
      </div>
    </div>

    <div class="row space">
      <!--Empty space for tooltip-->
    </div>
    <div class="row space">
      <div class="col-sm-4 text-center">
        <label for="save_path" class="label">Save Path(click to change):</label>
      </div>
      <div class="col-sm-7 text-center">
        <span @click="select_path">
          <b-tooltip :content="path_to_save_status" :show="show_tooltips">
            <b-form-input v-model="path_to_save" type="text"
                          id="save_path">
            </b-form-input>
          </b-tooltip>
        </span>
      </div>
    </div>

    <div class="row space">
      <div class="col-sm-4 text-center">
        <b-button @click="translate_text">Translate</b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="save_translated_text_to_files">Save Translated
          Text
        </b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="clear_translation">Clear Translation</b-button>
      </div>
    </div>
    <div class="row space">
      <div class="col-sm-4 text-center">
        <b-button @click="save_text_as_is_to_files">Save Text As Is</b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="open_folder">Open Folder</b-button>
      </div>
    </div>

    <div class="row space">
      <!--Empty space-->
    </div>
    <div class="row" v-for="text in translated_texts">
      <div class="col-sm-3">
        <label :for="text.short_name" class="label">{{text.full_name}}:</label>
      </div>
      <div class="col-sm-9">
        <b-form-input type="text"
                      :id="text.short_name"
                      v-model="text.text">
        </b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
  const jetpack = require('fs-jetpack')
  const fs = require('fs')
  import {Lang, Translation} from '../../shared.js'
  const {shell} = require('electron')
  const dialog = require('electron').remote.dialog
  const app = require('electron').remote.app
  const path = require('path')
  const translate = require('google-translate-api')

  export default {
    props: ['tab_index'],
    data () {
      return {
        current_langs: this.$store.state.CurrentLanguages.langs,
        langs: this.$store.state.Languages.langs,
        gpc_langs: this.$store.state.Languages.gpc_langs,
        translated_texts: [],
        text_to_translate: '',
        text_to_translate_status: this.text_to_translate ? 'OK' :
          'Error. Must contain value.',
        path_to_save: path.dirname(app.getAppPath()),
        path_to_save_status: '',
        path_to_save_writable: null,
        show_tooltips: true,
        template_start: '<?xml version="1.0" encoding="utf-8"?><resources><string name="app_name">',
        template_end: '</string></resources>'
      }
    },
    mounted() {
      console.log('SaveToFiles mounted')
      console.log(path.dirname(app.getAppPath()))
      this.check_directory_writable(this.path_to_save, this)
    },
    watch: {
      tab_index: function (val) {
        console.log('switch to tab', val)
        this.show_tooltips = val == 1
      }
    },
    methods: {
      save_text_as_is_to_files() {
        console.log('save_text_as_is_to_files')
        if (!this.text_to_translate || !this.path_to_save_writable) return
        this.current_langs.forEach(e => {
          if (['zh-cn', 'zh-tw'].includes(e.short_name) || !e.selected) return
          // Remove apostrophe and quotes
          var res_clean = this.text_to_translate
              .replace(/[\u0027\u02bb\u02bc\u02bd\u02c8]/gu, "")
          var file_name = path.join(this.path_to_save,
            'values-' + e.short_name, 'strings.xml')
          var content = this.template_start + res_clean +
            this.template_end
          jetpack.writeAsync(file_name, content)
        })
      },
      translate_text() {
        console.log('translate_text')
        if (!this.text_to_translate) return
        this.clear_translation()
        this.current_langs.forEach(e => {
          if (!e.selected) return
          var translation = new Translation()
          translation.short_name = e.short_name
          translation.full_name = e.full_name
          this.translated_texts.push(translation)
          translate(this.text_to_translate, {from: 'en', to: e.short_name})
            .then(res => {
              translation.text = res.text
            })
            .catch(err => {
              translation.text = err
            })
        })
      },
      save_translated_text_to_files() {
        console.log('save_translated_text_to_files')
        if (!this.translated_texts || !this.path_to_save_writable) return
        this.translated_texts.forEach(e => {
          if (['zh-cn', 'zh-tw'].includes(e.short_name)) return
          // Remove apostrophe and quotes
          var res_clean = e.text
              .replace(/[\u0027\u02bb\u02bc\u02bd\u02c8]/gu, "")
          var file_name = path.join(this.path_to_save,
            'values-' + e.short_name, 'strings.xml')
          var content = this.template_start + res_clean + this.template_end
          jetpack.writeAsync(file_name, content)
        })
      },
      clear_translation() {
        this.translated_texts = []
      },
      open_folder() {
        console.log('open_folder')
        shell.openItem(this.path_to_save)
      },
      check_directory_writable(path, self) {
        console.log('check_directory_writable')
        fs.access(path, fs.W_OK, function (err) {
          console.log(!err ? 'OK' : 'Error. ' + err)
          if (err) {
            self.path_to_save_status = 'Error. Directory is not writable.'
          } else {
            self.path_to_save = path
            self.path_to_save_status = 'OK'
            self.path_to_save_writable = true
          }
        })
      },
      text_to_translate_change(text) {
        console.log('text_to_translate_change')
        this.text_to_translate_status = text ? 'OK' :
          'Error. Must contain value.'
      },
      select_path() {
        console.log('select_path')
        var new_path = dialog.showOpenDialog({properties: ['openDirectory']})
        if (new_path !== undefined) {
          console.log('new path', new_path)
          this.check_directory_writable(new_path[0], this)
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
