<template>
	<div class="chat-container">
		<header>
			<button @click="gotoIndex">主 页</button>
		</header>

		<section>
			<div class="chat-area" v-for="item in allText">
				<div v-if="item.userName==userName">
					<div class="chat-time">
						{{item.date}}
					</div>
					<div class="chat-msg">
						<span class="chat-local">[ {{item.userLocal}} ]</span>
						<span class="chat-author">{{item.userName}}</span>
						<img :src="item.avatarUrl">
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
						<img :src="item.avatarUrl">
						<span class="chat-author">{{item.userName}}</span>
						<span class="chat-local">[ {{item.userLocal}} ]</span>
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
				showEmoji: false,
				text: '',
				textDOM: {},
				allText: [],
				userLocal: '',
				userid: 0,
				AINum: Math.floor(Math.random()*23 + 1)
			}
		},
		computed: {
			...mapState([
				'userName',
				'avatarUrl'
			])
		},
		methods: {
			...mapMutations([
				'CLEAR_DATA',
				'CHECK_LOGIN'
			]),
			gotoIndex() {
				this.CLEAR_DATA();
				this.$router.push('/');
			},
			insertEmoji(index) {
				this.text += this.emojis[index];
				this.textDOM.focus();
				this.lineStandard();
			},
			lineStandard() {
				this.textDOM.scrollTop = this.textDOM.scrollHeight - this.textDOM.clientHeight;
			},
			sendMsg() {
				if(this.text=='') return;

				this.allText.push({
					text: this.text,
					userName: this.userName,
					avatarUrl: this.avatarUrl,
					userLocal: this.userLocal,
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
						userName: '自嗨机器人',
						avatarUrl: '/static/avatar/' + this.AINum + '.jpg',
						userLocal: '第三世界',
						data: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
					});
				});

				this.text = '';
			}
		},
		mounted() {
			this.textDOM = document.querySelector('textarea');
			this.CHECK_LOGIN();
			this.userid = Math.floor(Math.random()*100);
			this.axios.get('/api')
				.then((res) => {
					this.userLocal = res.data.content.address;
				});
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../assets/style/component.scss';
</style>