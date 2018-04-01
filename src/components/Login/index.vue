<template>
	<div class="login-container">
		<section>
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
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		height: 100%;
		width: 100%;
		background: black;
		position: relative;
		
		section {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.icon {
				display: inline-block;
				box-sizing: border-box;
				margin: 0 1rem 1rem;
				padding: 1rem;
				color: white;
				font-size: 4rem;
				border: 1px solid black;
				transition: all .3s;
				&.active, &:hover {
					cursor: pointer;
					color: lightblue;
					border: 1px solid lightblue;
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
					font-size: 3rem;
					text-align: right;
					vertical-align: bottom;
				}
				.line-input {
					height: 4rem;
					width: 15rem;
					font-size: 3rem;
					font-weight: bolder;
					padding: 2rem;
					outline: none;
					background: inherit;
					border: none;
					border-bottom: 1px solid white;
					color: white;
				}
				.line-button {
					font-size: 2rem;
					padding: 0.5rem 1rem;
					border: 1px solid #fff;
					background: #000;
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
	}
</style>