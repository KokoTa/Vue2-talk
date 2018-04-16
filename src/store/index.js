import Vue from 'vue'
import Vuex from 'vuex'
const INIT_USER = 'INIT_USER';
const INIT_GROUPID = 'INIT_GROUPID';
const INIT_GROUPNAME = 'INIT_GROUPNAME';
const CLEAR_DATA = 'CLEAR_DATA';
const CLEAR_GROUPID = 'CLEAR_GROUPID';
const CHECK_LOGIN = 'CHECK_LOGIN';
const CHAT_STANDARD = 'CHAT_STANDARD';

Vue.use(Vuex);

const state = {
	// 当前用户
	user_name: '',
	password: '',
	avatar_url: '',
	power: '',

	// 用户分组
	group_id: '',
	group_name: '',

	// 分组消息
	messages: [],
}

const mutations = {
	[INIT_USER](state, { name, password, avatar_url, power }) { // 初始化用户
		state.user_name = name
		state.password = password
		state.avatar_url = avatar_url
		state.power = power
	},
	[INIT_GROUPID](state, group_id) {
		state.group_id = group_id
	},
	[INIT_GROUPNAME](state, group_name) {
		state.group_name = group_name
	},
	[CLEAR_GROUPID](state) {
		state.group_id = ''
	},
	[CLEAR_DATA](state) { // 清空状态
		state.user_name = ''
		state.password = ''
		state.avatar_url = ''
		state.power = ''
		state.group_id = ''
		state.group_name = ''
	},
	[CHAT_STANDARD](state) { // 聊天记录框scrollTop格式化
		let chatDOM = document.querySelector('section')
		let fHeight = document.querySelector('footer').clientHeight
		chatDOM.scrollTop = chatDOM.scrollHeight - chatDOM.clientHeight + fHeight
	}

}

export default new Vuex.Store({
	state,
	mutations
})