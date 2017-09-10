<template>
	<div class="login-container">
		<header>
			<a href="https://github.com/KokoTa" target="_blank">Author</a>
			<a href="#" @click='openMask=!openMask'>About</a>
		</header>
		<section>
			<h1>请输入名字</h1>
			<input type="text"
				v-model.trim="name" 
				@keyup.enter="login" 
				autofocus>
		</section>
		<transition name="fade" mode="out-in">
			<article class="mask" v-show="openMask" @click='openMask=!openMask'>
				<div class="about">
					<h1>Vue2-talk</h1>
					<h1>技术栈</h1>
					<ul>
						<li>Vue三剑客</li>
						<li>Socket.io</li>
						<li>图灵机器银</li>
						<li>axios</li>
					</ul>
				</div>
			</article>
		</transition>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'

	export default {
		name: 'Login',
		data() {
			return {
				openMask: false,
				name: ''
			}
		},
		methods: {
			...mapMutations([
				'INIT_DATA'
			]),
			login() {
				if(this.name === "") {
					return;
				}
				this.INIT_DATA(this.name);
				this.$router.push('chat');
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
	}
	a {
		width: 6rem;
		height: 6rem;
		line-height: 6rem;
		text-decoration: none;
		text-align: center;
		position: absolute;
		background: transparent;
		color: white;
		text-shadow: .3rem .5rem .5rem white;
		font-weight: bolder;
		font-size: 1.4rem;
	}
	a:nth-of-type(1) {
		right: 7.5rem;
	}
	a:nth-of-type(2) {
		right: .5rem;
	}
	section {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		h1 {
			color: white;
			font-size: 4rem;
		}
		input {
			height: 4rem;
			width: 20rem;
			font-size: 3rem;
			font-weight: bolder;
			padding: 1rem;
			outline: none;
		}
	}
	.mask {
		position: fixed;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, .5);
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.about {
			height: 30rem;
			width: 20rem;
			background: #eee;
			text-align: center;
			box-shadow: 0 0 20px black inset;
			h1 {
				font-size: 3rem;
			}
			p {
				font-size: 2rem;
			}
			ul {
				margin: 0;
				padding: 0;
				li {
					list-style: none;
					padding: 1rem;
				}
			}
		}
	}
</style>