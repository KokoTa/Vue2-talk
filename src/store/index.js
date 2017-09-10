import Vue from 'vue'
import Vuex from 'vuex'
const INIT_DATA = 'INIT_DATA';
const CLEAR_DATA = 'CLEAR_DATA';

Vue.use(Vuex);

const state = {
	userName: '',
	avatarUrl: ''
}

const mutations = {
	[INIT_DATA](state, name) {
		state.userName = name;
		state.avatarUrl = '/static/avatar/' + Math.floor(Math.random()*23 + 1) + '.jpg';
	},
	[CLEAR_DATA](state) {
		state.userName = '';
		state.avatarUrl = '';
	}
}

export default new Vuex.Store({
	state,
	mutations
})