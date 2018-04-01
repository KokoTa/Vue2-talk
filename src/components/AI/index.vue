<template>
	<div class="chat-container">
		<header>
			<button @click="goback">返 回</button>
		</header>

		<section>
			<div class="chat-area" v-for="(item, index) in allText" :key="index">
				<div v-if="item.user_name==user_name">
					<div class="chat-time">
						{{item.date}}
					</div>
					<div class="chat-msg">
						<span class="chat-local">[ {{item.user_local}} ]</span>
						<span class="chat-author">{{item.user_name}}</span>
						<img :src="item.avatar_url">
					</div>
					<div class="chat-content">
						{{item.text}}
					</div>
				</div>
				<div v-else>
					<div class="chat-time">
						{{item.date}}
					</div>
					<div class="chat-msg chat-msg-other">
						<img :src="item.avatar_url">
						<span class="chat-author">{{item.user_name}}</span>
						<span class="chat-local">[ {{item.user_local}} ]</span>
					</div>
					<div class="chat-content chat-content-other">
						{{item.text}}
					</div>
				</div>
			</div>
		</section>

		<footer>
			<textarea v-model.trim="text" rows="1" @input="lineStandard" @keyup.ctrl.enter="sendMsg"></textarea>
			<button @click="sendMsg">提交</button>
		</footer>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import moment from 'moment'

	export default {
		name: 'Chat',
		data() {
			return {
				text: '',
				textDOM: {},
				allText: [],
				user_local: '',
				userid: 0,
				AINum: Math.floor(Math.random()*23 + 1)
			}
		},
		computed: {
			...mapState([
				'user_name',
				'avatar_url'
			])
		},
		methods: {
			...mapMutations([
				'CLEAR_DATA',
				'CHAT_STANDARD'
			]),
			goback() {
				this.$router.go(-1);
			},
			lineStandard() {
				this.textDOM.scrollTop = this.textDOM.scrollHeight - this.textDOM.clientHeight;
			},
			sendMsg() {
				if(this.text=='') return;

				this.allText.push({
					text: this.text,
					user_name: this.user_name,
					avatar_url: this.avatar_url,
					user_local: this.user_local,
					date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
				})

				this.axios.post('/AI', {
					"info": this.text,
					"userid": this.userid,
					"key": 'cbcb99ec886842b48e37e4719cfbaaa8'
				})
				.then((res) => {
					this.allText.push({
						text: res.data.text,
						user_name: '自嗨机器人',
						avatar_url: '/static/avatar/' + this.AINum + '.jpg',
						user_local: '第三世界',
						data: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
					});
				});

				this.text = '';
			}
		},
		mounted() {
			this.textDOM = document.querySelector('textarea');
			this.userid = Math.floor(Math.random()*100);
			this.axios.get('/api')
				.then((res) => {
					this.user_local = res.data.content.address;
				});
		},
		updated() {
			this.CHAT_STANDARD();
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../assets/style/component.scss';
</style>