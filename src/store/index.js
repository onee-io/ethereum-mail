/**
 * Created by onee on 05/01/2022.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 变量定义
const state = {
  provider: null
}

// 计算过滤（获取数据前的操作）
const getters = {}

// 同步修改操作
const mutations = {
  setProvider(state, data) {
    state.provider = data;
  },
  resetProvicer(state) {
    state.provider = null;
  }
}

// 异步修改操作
const actions = {
  setProvider({ commit}, data) {
    commit("setProvider", data);
  },
  resetProvider({ commit }) {
    commit("resetProvider");
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
