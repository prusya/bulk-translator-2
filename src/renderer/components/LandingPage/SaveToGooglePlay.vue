<template>
  <div id="save_to_files">
    <div class="row space">
      <div class="col-sm-2 text-center">
        <label for="package_name" class="label">Package name:</label>
      </div>
      <div class="col-sm-4 text-center">
        <b-form-input v-model="package_name" type="text"
                      id="package_name"
                      name="package_name">
        </b-form-input>
      </div>
      <div class="col-sm-1 text-center">
        <label for="key_name" class="label">Key:</label>
      </div>
      <div class="col-sm-5 text-center">
        <b-form-select v-model="selected_key"
                       :options="current_keys"
                       class="mb-3"
        ></b-form-select>
      </div>
    </div>

    <div class="row space">
      <div class="col-sm-2 text-center">
        <label for="app_name" class="label">App Name:</label>
      </div>
      <div class="col-sm-1 text-center">
        <span class="label">{{
          app_name.length}}/50</span>
      </div>
      <div class="col-sm-9 text-center">
        <b-form-input v-model="app_name" type="text"
                      id="app_name"
                      @input="text_to_translate_change">
        </b-form-input>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-2 text-center">
        <label for="short_descr" class="label">Short Descr:</label>
      </div>
      <div class="col-sm-1 text-center">
        <span class="label">{{short_descr.length}}/80</span>
      </div>
      <div class="col-sm-9 text-center">
        <b-form-input v-model="short_descr" textarea :rows=2
                      id="short_descr"
                      @input="text_to_translate_change">
        </b-form-input>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-2 text-center">
        <label for="long_descr" class="label">Long Descr:</label>
      </div>
      <div class="col-sm-1 text-center">
        <span class="label">{{long_descr.length}}/4000</span>
      </div>
      <div class="col-sm-9 text-center">
        <b-form-input v-model="long_descr" textarea :rows=4
                      id="long_descr"
                      @input="text_to_translate_change">
        </b-form-input>
      </div>
    </div>

    <div class="row space">
      <div class="col-sm-4 text-center">
        <b-button @click="translate_text">Translate</b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="save_translated_text_to_google">Send To Google
        </b-button>
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="clear_translation">Clear Translation</b-button>
      </div>
    </div>
    <div class="row space">
      <div class="col-sm-4 text-center">
      </div>
      <div class="col-sm-4 text-center">
        <b-button @click="save_text_as_is_to_google">Send To Google As
          Is
        </b-button>
      </div>
    </div>

    <div class="row space">
      <div class="col-sm-2 text-center">
        <span class="label">Errors:</span>
      </div>
      <div class="col-sm-10">
        <div v-if="errors.length">
          <div v-for="err in errors">
            <li>{{err}}</li>
          </div>
        </div>
        <div v-else>
          None
        </div>
      </div>
    </div>

    <div class="row space">
      <!--Empty space-->
    </div>

    <div class="row" v-for="text in translated_texts">
      <b-btn block class="mt-1" v-b-toggle="text.short_name"
             v-bind:class="{salmon:text.app_name.length>50||
      text.short_descr.length>80||text.long_descr.length>4000}">{{text.full_name
        }}
      </b-btn>
      <b-collapse :id="text.short_name" class="full_width border">

        <div class="row" v-bind:class="{salmon:text.app_name.length>50}">
          <div class="col-sm-2 text-center">
            <label :for="text.short_name+'app'" class="label">App Name:</label>
          </div>
          <div class="col-sm-1 text-center">
            <span class="label">{{text.app_name.length}}/50</span>
          </div>
          <div class="col-sm-9 text-center">
            <b-form-input v-model="text.app_name" type="text"
                          :id="text.short_name+'app'"
                          @input="text_to_translate_change">
            </b-form-input>
          </div>
        </div>

        <div class="row" v-bind:class="{salmon:text.short_descr.length>80}">
          <div class="col-sm-2 text-center">
            <label :for="text.short_name+'short'"
                   class="label">Short Descr:</label>
          </div>
          <div class="col-sm-1 text-center">
            <span class="label">{{text.short_descr.length}}/80</span>
          </div>
          <div class="col-sm-9 text-center">
            <b-form-input v-model="text.short_descr" textarea :rows=2
                          :id="text.short_name+'short'"
                          @input="text_to_translate_change">
            </b-form-input>
          </div>
        </div>

        <div class="row" v-bind:class="{salmon:text.long_descr.length>4000}">
          <div class="col-sm-2 text-center">
            <label :for="text.short_name+'long'" class="label">Long
              Descr:</label>
          </div>
          <div class="col-sm-1 text-center">
            <span class="label">{{text.long_descr.length}}/4000</span>
          </div>
          <div class="col-sm-9 text-center">
            <b-form-input v-model="text.long_descr" textarea :rows=4
                          :id="text.short_name+'long'"
                          @input="text_to_translate_change">
            </b-form-input>
          </div>
        </div>

      </b-collapse>
    </div>

  </div>
</template>

<script>
  const translate = require('google-translate-api')
  import {Translation} from '../../shared.js'
  const googleapis = require('googleapis')
  const googleAuth = require('google-auth-library')
  const androidpublisher = googleapis.androidpublisher('v2')

  export default {
    data () {
      return {
        current_langs: this.$store.state.CurrentLanguages.langs,
        current_keys: this.$store.state.Keys.keys,
        selected_key: null,
        translated_texts: [],
        app_name: '',
        short_descr: '',
        long_descr: '',
        package_name: '',
        errors: []
      }
    },
    mounted() {
      console.log('SaveToGooglePlay mounted')
    },
    methods: {
      translate_text() {
        console.log('translate_text')
        this.clear_translation()
        this.current_langs.forEach(e => {
          if (!e.selected) return
          var translation = new Translation()
          translation.short_name = e.short_name
          translation.full_name = e.full_name
          translation.gpc_name = e.gpc_name
          this.translated_texts.push(translation)
          translate(this.app_name, {from: 'en', to: e.short_name})
            .then(res => {
              translation.app_name = res.text
            })
            .catch(err => {
              translation.app_name = err
              translation.app_name_error = err
              this.errors.push(e.full_name + ' app name: ' + err)
            })
          translate(this.short_descr, {from: 'en', to: e.short_name})
            .then(res => {
              translation.short_descr = res.text
            })
            .catch(err => {
              translation.short_descr = err
              translation.short_descr_error = err
              this.errors.push(e.full_name + ' short descr: ' + err)
            })
          translate(this.long_descr, {from: 'en', to: e.short_name})
            .then(res => {
              translation.long_descr = res.text
            })
            .catch(err => {
              translation.long_descr = err
              translation.long_descr_error = err
              this.errors.push(e.full_name + ' long descr: ' + err)
            })
        })
        console.log(this.translated_texts)
      },
      clear_translation() {
        this.translated_texts = []
        this.errors = []
      },
      text_to_translate_change(text) {
        console.log('text_to_translate_change')
      },
      save_translated_text_to_google() {
        console.log('save_translated_text_to_google')
        this.errors = []
        this.google_send()
      },
      save_text_as_is_to_google() {
        console.log('save_text_as_is_to_google')
        this.clear_translation()
        this.current_langs.forEach(e => {
          if (!e.selected) return
          var translation = new Translation()
          translation.short_name = e.short_name
          translation.full_name = e.full_name
          translation.gpc_name = e.gpc_name
          translation.app_name = this.app_name
          translation.short_descr = this.short_descr
          translation.long_descr = this.long_descr
          this.translated_texts.push(translation)
        })
        console.log(this.translated_texts)
        this.google_send()
      },
      google_send() {
        console.log('google_send')
        var self = this
        var auth = new googleAuth()
        var oauth2Client = new auth.OAuth2()
        if (!this.selected_key) {
          this.errors.push('[Key] Error. Key not selected.')
          return
        }
        if (!this.package_name) {
          this.errors.push('[Package] Error. Package not seleted.')
          return
        }
        if (!this.translated_texts.length) {
          this.errors.push('[Translation] Error. Translations not found.')
          return
        }
        var key = this.current_keys
          .find(x => x.client_email == this.selected_key)
        console.log('key', this.selected_key, key)

        var jwt = new googleapis.auth.JWT(
          key.client_email,
          null,
          key.private_key,
          ['https://www.googleapis.com/auth/androidpublisher'])

        jwt.authorize(function (err, result) {
          oauth2Client.setCredentials({
            access_token: result.access_token
          })
          console.log('jwt.authorize')
          if (err) {
            this.errors.push('[Authorize] Error. ' + err)
            return
          }

          androidpublisher.edits.insert({
            auth: oauth2Client,
            packageName: self.package_name //com.neocortex.tesllang
          }, function (err, resp) {
            if (err) {
              self.errors.push('[Insert edit] Error. ' + err)
              console.log('androidpublisher.edits.insert' + err)
              return
            }
            if (resp) {
              console.log('androidpublisher.edits.insert', resp)
              var promises = []
              self.translated_texts.forEach(e => {
                var p = new Promise((resolve, reject) => {
                  console.log('Promise', e)
                  androidpublisher.edits.listings.update({
                    auth: oauth2Client,
                    packageName: self.package_name,
                    //com.neocortex.tesllang
                    editId: resp.id,
                    language: e.gpc_name,
                    resource: {
                      language: e.gpc_name,
                      title: e.app_name,
                      shortDescription: e.short_descr,
                      fullDescription: e.long_descr,
                    }
                  }, function (err, res) {
                    console.log('androidpublisher.edits.listings.update')
                    console.log('   err', err)
                    console.log('   resp', res)
                    if (err) {
                      console.log('[Insert translation] Error. ' + err)
                      self.errors.push('[Insert translation] Error. ' + err)
                      reject(err)
                      return
                    }
                    if (res) {
                      resolve(res)
                    }
                  })
                })
                promises.push(p)
              })
              Promise.all(promises).then(values => {
                androidpublisher.edits.commit({
                  auth: oauth2Client,
                  packageName: self.package_name,
                  //com.neocortex.tesllang
                  editId: resp.id,
                }, function (err, res) {
                  console.log('androidpublisher.edits.commit')
                  console.log('   err', err)
                  console.log('   resp', res)
                  if (err) {
                    console.log('[Edit commit] Error. ' + err)
                    self.errors.push('[Edit commit] Error. ' + err)
                  }
                  if (res) {
                    self.errors.push('None. Save to Google Probably Success!')
                  }
                })
              })
            }
          })
        })
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

  .border {
    border: 1px solid #202020;
    border-radius: 5px;
  }

  .collapse-enter-active, .collapse-leave-active {
    transition: all 0s ease;
    overflow: hidden;
  }

  .full_width {
    width: 100%;
  }

  .salmon {
    border: 3px solid salmon;
  }
</style>
