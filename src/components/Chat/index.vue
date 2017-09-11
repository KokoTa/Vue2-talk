<template>
	<div class="chat-container">
		<header>
			<button>A I</button>
			<button @click="gotoIndex">主 页</button>
		</header>
		<section>
			
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
			<textarea v-model.trim="text" rows="1" @input="lineStandard"></textarea>
			<button>提交</button>
		</footer>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'

	export default {
		name: 'Chat',
		data() {
			return {
				showEmoji: false,
				emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳'],
				text: '',
				textDOM: {}
			}
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
			},
			lineStandard() {
				this.textDOM.scrollTop = this.textDOM.scrollHeight - this.textDOM.clientHeight;
			}
		},
		mounted() {
			this.textDOM = document.querySelector('textarea');
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