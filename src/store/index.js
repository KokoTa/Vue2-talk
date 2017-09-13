import Vue from 'vue'
import Vuex from 'vuex'
const INIT_DATA = 'INIT_DATA';
const CLEAR_DATA = 'CLEAR_DATA';
const CHECK_LOGIN = 'CHECK_LOGIN';

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
	},
	[CHECK_LOGIN](state) {
		if(!state.userName) {
			alert('使用的用户名已失效，现在您将以匿名形式进行会话');
			state.userName = '匿名';
			state.avatarUrl = '/static/avatar/Ni.jpg';
		}
	}

}

export default new Vuex.Store({
	state,
	mutations
})