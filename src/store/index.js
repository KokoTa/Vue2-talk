import Vue from 'vue'
import Vuex from 'vuex'
const CHANGE_USERNAME = 'CHANGE_USERNAME';

Vue.use(Vuex);

const state = {
	userName: '',
	avatarUrl: '/static/avatar/'
}

const mutations = {
	[CHANGE_USERNAME](state, name) {
		state.userName = name;
	}
}

export default new Vuex.Store({
	state,
	mutations
})