const state = {
  keys: []
}

const mutations = {
  add_key (state, key) {
    state.keys.push(key)
  },
  remove_key (state, key) {
    // TODO
  },
  flush_keys (state) {
    state.keys.splice(0, state.keys.length)
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
