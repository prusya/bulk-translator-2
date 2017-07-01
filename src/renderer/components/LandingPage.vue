<template>
  <div id="wrapper">
    <main>
      <div class="container-fluid">
        <div class="row">
          <div class="col col-sm-12">
            <b-tabs v-model="tab_index">
              <b-tab title="Save to Google Play" active>
                <save-to-google-play>
                </save-to-google-play>
              </b-tab>
              <b-tab title="Save to Files">
                <save-to-files :tab_index="tab_index"></save-to-files>
              </b-tab>
              <b-tab title="Languages">
                <languages></languages>
              </b-tab>
              <b-tab title="Keys">
                <keys></keys>
              </b-tab>
              <b-tab title="Instructions">
                <instructions></instructions>
              </b-tab>
              <b-tab title="Tips">
                <tips></tips>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import Languages from './LandingPage/Languages'
  import SaveToFiles from './LandingPage/SaveToFiles'
  import Instructions from './LandingPage/Instructions'
  import Keys from './LandingPage/Keys'
  import Tips from './LandingPage/Tips'
  import SaveToGooglePlay from './LandingPage/SaveToGooglePlay'

  export default {
    name: 'landing-page',
    components: {
      Languages,
      SaveToFiles,
      Instructions,
      Keys,
      Tips,
      SaveToGooglePlay
    },
    data () {
      return {
        tab_index: null,
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    /*border: #ff0000 solid 1px !important;*/
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  #wrapper {
    background: radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, 0.9) 100%
    );
    min-height: 100%;
    padding: 0px 0px;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    /*justify-content: space-between;*/
  }

  main > div {
    flex-basis: 100%;
  }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }

  .container-fluid {
    padding-right: 0px;
    padding-left: 0px;
  }
</style>
