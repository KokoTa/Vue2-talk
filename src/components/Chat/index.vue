<template>
	<div class="chat-container">
		<header>
			<button @click="gotoAI">A I</button>
			<span>{{ group_name }}</span>
			<button @click="quitGroup">退 出</button>
		</header>

		<section>
			<div class="chat-area" v-for="(item, index) in infos" :key="index">
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
			<transition name='slide-right'>
				<div class="emoji" v-show="showEmoji">
					<ul v-if="emojis.length">
						<li v-for="(item, index) in emojis"
							@click="insertEmoji(index)"
							:key="index">
							{{item}}
						</li>
					</ul>
				</div>
			</transition>
			<button @click="showEmoji=!showEmoji">Emoji</button>
			<textarea
				v-model.trim="text"
				rows="1"
				@input="lineStandard"
				@keyup.ctrl.enter="sendMsg"
				@click="showEmoji = false">
			</textarea>
			<button @click="sendMsg">提交</button>
		</footer>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import moment from 'moment'
	import io from 'socket.io-client' // 当前页面引入socket

	export default {
		name: 'Chat',
		data() {
			return {
				showEmoji: false,
				emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳'],
				text: '',
				textDOM: {},
				infos: [],
				user_local: '',

				type: 1, // 下线通知的类型（0. 点击退出按钮时的退出 1. 地址栏跳转的退出）
			}
		},
		computed: {
			...mapState([
				'user_name',
				'avatar_url',
				'password',
				'group_id',
				'group_name',
			])
		},
		methods: {
			...mapMutations([
				'CLEAR_DATA',
				'CHECK_LOGIN',
				'CHAT_STANDARD',
				'INIT_GROUPNAME',
				'CLEAR_GROUPID',
			]),
			quitGroup() { // 退出分组(清空数据库、本地状态并进行下线通知)
				const req = {
					name: this.user_name,
					password: this.password
				}
				this.axios.put('/server/quitGroup', req) // 清空数据库状态
					.then((res) => {
						this.type = 0;
						
						this.CLEAR_GROUPID(); // 清空本地状态
						this.socket.emit('quitGroup') // 广播下线通知
						this.$router.push('choice')
					})
			},
			quitGroupSimple() { // 退出分组(只进行下线通知)
				this.type = 0;
				
				this.socket.emit('quitGroup')
			},
			insertEmoji(index) { // 插入表情
				this.text += this.emojis[index];
				this.textDOM.focus();
				this.lineStandard();
			},
			lineStandard() { // 格式化输入后的样式
				this.textDOM.scrollTop = this.textDOM.scrollHeight - this.textDOM.clientHeight;
			},
			sendMsg() { // 发送数据(保存至数据库 + 广播消息)
				if(this.text=='') return;

				const info = {
					text: this.text,
					user_name: this.user_name,
					avatar_url: this.avatar_url,
					user_local: this.user_local,
					date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					group_id: this.group_id
				};
				// 保存至数据库
				this.axios.post('/server/saveInfo', info)
					.then((res) => {
						if (res.data.code === 0) {
							// 广播消息
							this.socket.emit('groupMsg', info);
							this.infos.push(info);
							this.text = '';
						}
					})
			},
			gotoAI() { // 跳转至AI页
				this.quitGroupSimple()
				this.$router.push('/AI');
			},
			getGroupInfo() { // 获得该分组信息
				this.axios.get(`/server/getGroup/${this.group_id}`)
					.then((res) => {
						if (res.data.code === 0) {
							this.INIT_GROUPNAME(res.data.data.name)
							this.getGroupMsg()
						}
					})
			},
			getGroupMsg() { // 获得该分组内消息
				this.axios.get(`/server/getInfos/${this.group_id}`)
					.then((res) => {
						if (res.data.code === 0) {
							this.infos = res.data.data
						}
					})
			},
		},
		mounted() {
			this.textDOM = document.querySelector('textarea');

			// 初始化连接
			this.socket = io(`http://localhost:3000?group_id=${this.group_id}`)

			// 监听事件，显示当前房间在线人数
			this.socket.on('online', (msg) => {
				let num = document.createElement('div');
				num.className = 'linePeople';
				num.textContent = '当前在线' + msg + '人';
				document.querySelector('section').appendChild(num);
				this.CHAT_STANDARD(); // 手动插入不会出发updated生命周期，需要手动调用
			});
			this.socket.on('offline', (msg) => {
				let num = document.createElement('div');
				num.className = 'linePeople';
				num.textContent = '当前在线' + msg + '人';
				document.querySelector('section').appendChild(num);
				this.CHAT_STANDARD();
			});

			// 监听事件，接收信息
			this.socket.on('outerText', (msg) => {
				this.infos.push(msg);
			})

			// 获得定位
			this.axios.get('/api')
				.then((res) => {
					this.user_local = res.data.content.address;
				});
		},
		updated() { // 数据更新时对聊天界面的显示进行格式化
			this.CHAT_STANDARD();
		},
		created() {
			if (!this.group_id) { // 没有分组就不能进入此路由
				this.$router.replace('/choice')
			} else {
				this.INIT_GROUPNAME('')
				this.getGroupInfo()
			}
		},
		beforeDestroy() {
			if (this.type) { // 根据type来区分是按钮退出还是路由跳转退出
				this.quitGroupSimple();
			}
		},
	}
</script>

<style lang='scss' scoped>
	@import '../../assets/style/component.scss';
</style>