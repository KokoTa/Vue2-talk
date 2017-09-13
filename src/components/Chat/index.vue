<template>
	<div class="chat-container">
		<header>
			<button @click="gotoAI">A I</button>
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
			<transition name='slide-right'>
				<div class="emoji" v-show="showEmoji">
					<ul v-if="emojis.length">
						<li v-for="(item, index) in emojis"
							@click="insertEmoji(index)">
							{{item}}
						</li>
					</ul>
				</div>
			</transition>
			<button @click="showEmoji=!showEmoji">Emoji</button>
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
				emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳'],
				text: '',
				textDOM: {},
				allText: [],
				userLocal: ''
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
				let info = {
					text: this.text,
					userName: this.userName,
					avatarUrl: this.avatarUrl,
					userLocal: this.userLocal,
					date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
				};
				socket.emit('groupMsg', info);
				this.allText.push(info);
				this.text = '';
			},
			gotoAI() {
				this.$router.push('/AI');
			}
		},
		mounted() {
			this.textDOM = document.querySelector('textarea');
			this.CHECK_LOGIN();

			// 显示在线人数
			socket.on('online', (msg) => {
				let num = document.createElement('div');
				num.className = 'linePeople';
				num.textContent = '当前在线' + msg + '人';
				document.querySelector('section').appendChild(num);
			});
			socket.on('offline', (msg) => {
				let num = document.createElement('div');
				num.className = 'linePeople';
				num.textContent = '当前在线' + msg + '人';
				document.querySelector('section').appendChild(num);
			});

			// 建立连接，接收信息
			socket.on('outerText', (msg) => {
				this.allText.push(msg);
			})

			// 获得定位
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