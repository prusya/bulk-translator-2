<template>
  <div id="instructions">
    <div class="row space">
      <div class="col-sm-12">
        <b-list-group class="label">
          <b-list-group-item>1. Go to &nbsp;<a @click="follow_link"
            href="https://console.developers.google.com/projectselector/apis/library"
            target="_blank">https://console.developers.google.com/projectselector/apis/library</a>
          </b-list-group-item>

          <b-list-group-item>
            2. Click `Create a new project`
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_1">
          </b-list-group-item>

          <b-list-group-item>
            3. Enter project name and click `Create`
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_2">
          </b-list-group-item>

          <b-list-group-item>
            4. After project is created, Library tab will open.
            Click `Google Play Developer API`
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_3">
          </b-list-group-item>

          <b-list-group-item>
            5. API information window will open. Click
            `Enable` to be able to use the API
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_4">
          </b-list-group-item>

          <b-list-group-item>
            6. API statistics window will open. Click `Create
            credentials` to create a servivce account
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_5">
          </b-list-group-item>

          <b-list-group-item>
            7. Click `service account`
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_6">
          </b-list-group-item>

          <b-list-group-item>
            8. Click `Create service account`
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_7">
          </b-list-group-item>

          <b-list-group-item>
            9. Account creation window will open. Enter
            `Account name`. Choose role `Project -> Owner`.
            Check `Create new private key` and choose JSON type
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_8">
          </b-list-group-item>

          <b-list-group-item>
            10. Service account is now created. Save the file with
            private key
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_1_9">
          </b-list-group-item>

          <b-list-group-item>
            11. Go to &nbsp;<a @click="follow_link"
            href="https://play.google.com/apps/publish/#ApiAccessPlace">
            https://play.google.com/apps/publish/#ApiAccessPlace</a>
          </b-list-group-item>

          <b-list-group-item>
            12. Click `Link` next to the previously created
          project
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_2_1">
          </b-list-group-item>

          <b-list-group-item>
            13. After link is created, API access page will
          open. In the Service Accounts section click `Grant
          access` next to the previously created service
          account
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_2_2">
          </b-list-group-item>

          <b-list-group-item>
            14. Permission scopes selection page will open. Click
          `Add user`
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_2_3">
          </b-list-group-item>

          <b-list-group-item>
            15. Go to `Keys` tab in Bulk Translator program.
          Click `Load key` and choose the file with private
          key created previously
          </b-list-group-item>
          <b-list-group-item>
            <img :src="image_3_1">
          </b-list-group-item>

          <b-list-group-item>
            16. Now you can select and use service accounts
          represented by keys under `Keys` dropdown on `Save to
          Google Play` tab
          </b-list-group-item>
        </b-list-group>

      </div>
    </div>
  </div>
</template>

<script>
  const {shell} = require('electron')

  export default {
    data () {
      return {
        image_1_1: 'static/store/instructions/1.1.png',
        image_1_2: 'static/store/instructions/1.2.png',
        image_1_3: 'static/store/instructions/1.3.png',
        image_1_4: 'static/store/instructions/1.4.png',
        image_1_5: 'static/store/instructions/1.5.png',
        image_1_6: 'static/store/instructions/1.6.png',
        image_1_7: 'static/store/instructions/1.7.png',
        image_1_8: 'static/store/instructions/1.8.png',
        image_1_9: 'static/store/instructions/1.9.png',
        image_2_1: 'static/store/instructions/2.1.png',
        image_2_2: 'static/store/instructions/2.2.png',
        image_2_3: 'static/store/instructions/2.3.png',
        image_3_1: 'static/store/instructions/3.1.png',
      }
    },
    mounted() {
      console.log('Instructions mounted')
    },
    methods: {
      follow_link(e) {
        console.log('follow', e.target.href)
        e.preventDefault()
        shell.openExternal(e.target.href)
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

  img {
    max-width: 100%;
  }
</style>
