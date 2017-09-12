<template>
	<div class="chat-container">
		<header>
			<button>A I</button>
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
				'CLEAR_DATA'
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
			}
		},
		mounted() {
			this.textDOM = document.querySelector('textarea');

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
	.chat-container {
		height: 100%;
		position: relative;
 	}
	header {
		position: absolute;
		top: 0;
		height: 4rem;
		width: 100%;
		background: #BDBDD7;
		button {
			height: 100%;
			background: transparent;
			border: none;
			outline: none;
			color: #E9E2D0;
			padding: 0 20px;
		}
		button:nth-of-type(2) {
			float: right;
		}
	}

	section {
		height: 100%;
		padding: 4rem 0;
		overflow: auto;
		::-webkit-scrollbar{
			display:none;
		}
		.chat-area {
			padding: 1rem;
			.chat-time {
				text-align: center;
				margin-bottom: .5rem;
				color: gray;
			}
			.chat-msg {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 1.5rem;
				.chat-local, .chat-author {
					margin-right: 1rem;
				}
				.chat-local {
					font-size: 1rem;
					color: gray;
				}
				img {
					width: 24px;
					height: 24px;
				}
			}
			.chat-content {
				text-align: right;
				padding: .5rem 0;
				font-size: 2rem;
			}
			.chat-msg-other {
				justify-content: flex-start;
				.chat-local, .chat-author {
					margin-right: 0;
					margin-left: 1rem;
				}
			}
			.chat-content-other {
				text-align: left;
			}
		}
	}


	footer {
		position: absolute;
		bottom: 0;
		height: 4rem;
		width: 100%;
		display: flex;
		justify-content: center;
		align-item: center;
		button {
			flex-basis: 4rem;
			background: #BDBDD7;
			color: #E9E2D0;
		}
		textarea {
			flex: 1;
			font-size: 3rem;
			line-height: 3rem;
			width: 1rem; /* 设置的值大小无所谓，不设置宽度flex布局会混乱 */
			padding: .5rem 1rem;
			color: gray;
			resize: none;
			overflow: auto;
		}
		textarea:focus {
			color: black;
		}
		button, textarea {
			border: none;
			outline: none;
		}
		.emoji {
			width: 100%;
			height: 8rem;
			position: absolute;
			bottom: 4rem;
			border-top: 1px solid white;
			display: flex;
			ul {
				list-style: none;
				margin: 0;
				padding: 0;
				display: flex;
				flex-wrap: wrap;
				align-content: space-around;
				li {
					text-align: center;
					width: 2rem;
					height: 2rem;
					line-height: 2rem;
					font-size: 2rem;
				}
			}
		}
	}
</style>