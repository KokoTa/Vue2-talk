<template>
  <div class="choice">
    <!-- 分组列表 -->
    <section class="choice-groups">
      <!-- 分组列表 -->
      <div
        class="group"
        v-for="(item, index) in groups"
        :key="index"
        @click="goToGroup(item._id)">
        <img class="group-img" :src="item.image_url" alt="分组图片">
        <span class="gorup-name">{{ item.name }}</span>
      </div>
      <!-- 添加新分组的按钮 -->
      <div 
        class="group"
        @click="openDialog">
        <span class="group-add">+</span>
      </div>
    </section>
    <!-- 新建分组 -->
    <transition name="new-group">
      <section class="new-group" v-show="visible" @click="visible = false">
        <h1 class="new-group-header" @click.stop>请输入新分组的名字</h1>
        <input
          class="new-group-input"
          type="text"
          v-model.trim="newGroupName"
          placeholder="新建后不可删除"
          @keyup.enter="addGroup"
          @click.stop>
        <span class="line-alert">{{ alert }}</span>
        <button class="new-group-button" @click.stop="addGroup">确认</button>
      </section>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'choice',
  computed: {
    ...mapState([
      'user_name',
      'password',
      'group_id',
    ])
  },
  data() {
    return {
      groups: [],
      newGroupName: '',
      alert: '',
      visible: false,
    }
  },
  methods: {
    ...mapMutations(['INIT_GROUPID']),
    openDialog() {
      this.visible = true
      this.alert = ''
    },
    addGroup() {
      if (this.newGroupName === "") {
        this.alert = '新分组不能为空'
        return
      }

      const req = {
        name: this.newGroupName,
        image_url: `/static/group/${Math.floor((Math.random() * 154) + 1)}.jpg`
      }

      this.axios.post('/server/addGroup', req)
        .then((res) => {
          if (res.data.code === 0) {
            this.visible = false;
            this.newGroupName = ''
            this.getGroups()
          } else {
            this.alert = res.data.msg
          }
        })
      
    },
    getGroups() {
      this.axios.get('/server/getGroups')
        .then((res) => {
          if (res.data.code === 0) {
            this.groups = res.data.data
          }
        })
    },
    goToGroup(id) {
      this.INIT_GROUPID(id)
      
      const req = {
        name: this.user_name,
        password: this.password,
        group_id: id
      }
      this.axios.post('/server/saveGroup', req) // 保存分组id
        .then((res) => {
          this.$router.push('chat')
        })
    }
  },
  created() {
    // 如果存在group_id就不能进入此路由，因为用户已经属于某分组，除非他退出分组
    if (this.group_id) {
      this.$router.replace('/chat');
    } else {
      this.getGroups()
    }
  }
}
</script>

<style lang="scss" scoped>
.choice {
  height: 100%;
  width: 100%;
  padding: 1rem;
  overflow: hidden;
  background: #000;
  font-weight: bolder;
  position: relative;
  .choice-groups {
    height: 100%;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .group {
      width: 50%;
      height: 33.33%;
      box-sizing: border-box;
      color: #fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all .3s;
      .group-img {
        display: inline-block;
        width: 50%;
        margin-top: .5rem;
      }
      .gorup-name {
        font-size: 2rem;
        margin-top: 1rem;
      }
      .group-add {
        font-size: 10rem;
        margin-bottom: 1rem;
      }
      &:hover {
        background: lightblue;
        color: #000;
        cursor: pointer;
      }
    }
  }
  .new-group {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #fff;
    .new-group-header {
      font-size: 3rem;
    }
    .new-group-input {
      margin-bottom: 2rem;
      font-size: 2rem;
      padding: 1rem;
      border: 3px solid black;
      border-radius: 10px;
      outline: none;
    }
    .new-group-button {
      font-size: 2rem;
      padding: .8rem 1.8rem;
      border: 1px solid #000;
      background: #000;
      color: #fff;
      outline: none;
      border-radius: 10px;
      &:hover {
        background: #fff;
        color: #000;
        cursor: pointer;
      }
    }
    .line-alert {
      font-size: 2.5rem;
      color: orangered;
      margin-bottom: 2rem;
    }
  }
}

.new-group-enter-active, .new-group-leave-active {
  transition: all .3s;
}
.new-group-enter, .new-group-leave-to {
  opacity: 0;
}
.new-group-leave, .new-group-enter-to {
  opacity: 1;
}
</style>

