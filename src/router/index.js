import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login' // 登录/注册
import Choice from '@/components/Choice' // 选择分组
import Chat from '@/components/Chat' // 小组聊天
import AI from '@/components/AI' // AI对话
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
  	{
  		path: '/',
  		name: 'Login',
  		component: Login
  	},
		{
			path: '/choice',
			name: 'Choice',
			component: Choice
		},
  	{
  		path: '/chat',
  		name: 'Chat',
  		component: Chat
  	},
    {
      path: '/AI',
      name: 'AI',
      component: AI
    },
		{
			path: '*',
			redirect: '/'
		}
  ]
})

router.beforeEach((to, from, next) => {
	// 检查登录状态
	if (to.path !== '/' && (!store.state.user_name || !store.state.password)) {
		next('/')
	} else {
		next()
	}
})

export default router
