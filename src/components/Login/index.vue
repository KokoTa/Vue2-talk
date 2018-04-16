<template>
	<div class="login-container">
		<!-- 背景视频 -->
		<section class="video">
			<video
				src="/static/movie/office.mp4"
				autoplay
				loop>
				您的浏览器不支持内嵌视频，请使用更高版本的浏览器0_0
			</video>
		</section>
		<!-- 页面主体 -->
		<section class="content">
			<h1>
				<span
					class="icon"
					:class="{ 'active': type }"
					@click="type = true">
					登录
				</span>
				<span class="icon-or">Or</span>
				<span
					class="icon"
					:class="{ 'active': !type }"
					@click="type = false">
					注册
				</span>
			</h1>
			<div class="line">
				<span class="line-title">用户名：</span>
				<input 
					class="line-input"
					type="text"
					v-model.trim="name" 
					@keyup.enter="operate"
					autofocus>
			</div>
			<div class="line">
				<span class="line-title">密码：</span>
				<input 
					class="line-input"
					type="password"
					v-model.trim="password" 
					@keyup.enter="operate">
			</div>
			<div class="line">
				<button class="line-button" @click="operate">确认</button>
			</div>
			<div class="line">
				<span class="line-alert">{{ alert }}</span>
			</div>
		</section>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'

	export default {
		name: 'Login',
		data() {
			return {
				type: true, // true 代表登录；false 代表注册
				name: '',
				password: '',
				alert: ''
			}
		},
		methods: {
			...mapMutations([
				'INIT_USER',
				'INIT_GROUPID',
				'CLEAR_DATA'
			]),
			operate() {
				if(this.name === "" || this.password === "") {
					this.alert = '请填写完整信息'
					return false;
				}

				const userInfo = {
					name: this.name,
					password: this.password,
					avatar_url: '/static/avatar/' + Math.floor(Math.random()*23 + 1) + '.jpg'
				}

				if (this.type) {
					// 登录
					this.axios.post('/server/login', userInfo)
						.then((res) => {
							if (res.data.code === 0) {
								const data = res.data.data
								this.INIT_USER({ ...data })
								
								if (!data.group_id) { // 是否参与了分组
									this.$router.push('choice')
								} else {
									this.INIT_GROUPID(data.group_id)
									this.$router.push('chat')
								}
							}
							this.alert = res.data.msg
						})
				} else {
					// 注册
					this.axios.post('/server/signUp', userInfo)
						.then((res) => {
							if (res.data.code === 0) {
								const data = res.data.data
								this.INIT_USER({ ...data })

								this.$router.push('choice')
							}
							this.alert = res.data.msg
						})
				}

				return true;
			}
		},
		created() {
			this.CLEAR_DATA()
			
			// 判断cookie中是否存在token，存在就进行验证
			const match = window.document.cookie.match(/token=\S*/g);
			if (match) {
				this.axios.get('/server/checkToken')
					.then((res) => { // 通过就自动登录
						if (res.data.code === 0) {
							const data = res.data.data
							this.INIT_USER({ ...data })

							if (!data.group_id) {
								this.$router.push('choice')
							} else {
								this.INIT_GROUPID(data.group_id)
								this.$router.push('chat')
							}
						}
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		height: 100%;
		width: 100%;
		background: black;
		position: relative;
		
		.content {
			height: 100%;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: absolute;
			z-index: 10;
			.icon {
				display: inline-block;
				box-sizing: border-box;
				margin: 0 1rem 1rem;
				padding: 1rem;
				color: white;
				font-size: 3rem;
				border: 1px solid #fff;
				border-radius: 10%;
				transition: all .3s;
				&.active, &:hover {
					cursor: pointer;
					color: lightblue;
					border: 1px solid lightblue;
					background: black;
				}
			}
			.icon-or {
				font-size: 3rem;
				color: #fff;
			}
			.line {
				margin: 1rem;
				.line-title {
					display: inline-block;
					width: 10rem;
					color: #fff;
					font-size: 2.5rem;
					text-align: right;
					vertical-align: middle;
				}
				.line-input {
					height: 4rem;
					width: 12rem;
					font-size: 2.5rem;
					font-weight: bolder;
					padding: 2rem .5rem;
					outline: none;
					background: inherit;
					border: none;
					border-bottom: 1px solid white;
					color: white;
				}
				.line-button {
					font-size: 2.5rem;
					padding: .6rem 1.5rem .7rem;
					border: 1px solid #fff;
					border-radius: 10%;
					outline: none;
					background: transparent;
					color: #fff;
					margin-top: 1rem;
					transition: all .3s;
					&:hover {
						color: #000;
						background: #fff;
						cursor: pointer;
					}
				}
				.line-alert {
					font-size: 2.5rem;
					color: orangered;
				}
			} 
		}

		.video {
			position: absolute;
			height: 100%;
			width: 100%;
			z-index: 5;
			display: flex;
			justify-content: center;
			align-items: center;
			video {
				height: 100%;
			}
		}
	}
</style>