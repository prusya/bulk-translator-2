const state = {
  langs: []
}

const mutations = {
  add_lang (state, lang) {
    state.langs.push(lang)
  },
  revert_selected (state, short_name) {
    var lang = state.langs.find(x => x.short_name == short_name)
    lang.selected = !lang.selected
  }
}

const getters = {}

const actions = {}

export default {
  state,
  mutations,
  getters,
  actions
}
