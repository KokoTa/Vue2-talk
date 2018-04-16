<template>
  <div class="choice">

    <!-- 分组列表 -->
    <section class="choice-groups">
      <!-- 登出 -->
      <div class="header">
        <span class="title">分组列表</span>
        <button class="button" @click="loginOut">登出</button>
      </div>
      <!-- 分组列表 -->
      <div
        class="group"
        v-for="(item, index) in groups"
        :key="index"
        @click="enterOrDeleteGroup(item._id)">
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
    <transition name="group">
      <section class="new-group" v-show="visible" @click="visible = false">
        <h1 class="new-group-header" @click.stop>请输入新分组的名字</h1>
        <input
          class="new-group-input"
          type="text"
          v-model.trim="newGroupName"
          placeholder="新建后只有管理员可删除"
          @keyup.enter="addGroup"
          @click.stop>
        <span class="line-alert">{{ alert }}</span>
        <button class="new-group-button" @click.stop="addGroup">确认</button>
      </section>
    </transition>

    <!-- 删除分组 -->
    <transition name="group">
      <section class="operate-group" v-show="operateVisible" @click="operateVisible = false">
        <button class="operate-group-button" @click.stop="goToGroup">进入</button>
        <button class="operate-group-button" @click.stop="deleteGroup">删除</button>
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
      'power',
    ])
  },
  data() {
    return {
      groups: [],
      newGroupName: '',
      alert: '',
      visible: false,
      operateVisible: false,
    }
  },
  methods: {
    ...mapMutations(['INIT_GROUPID', 'CLEAR_DATA']),
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
          if (res.status === 200) {
            this.groups = res.data.data
          }
        })
    },
    enterOrDeleteGroup(id) { // 进入or删除分组
      this.INIT_GROUPID(id)
      // 是管理员的话，需要进行判断；普通用户直接进入
      if (this.power === 1) {
        this.operateVisible = true;
      } else {
        this.goToGroup();
      }

    },
    goToGroup() { // 进入分组
      const req = {
        name: this.user_name,
        password: this.password,
        group_id: this.group_id
      }
      this.axios.post('/server/saveGroup', req) // 保存分组id
        .then((res) => {
          this.$router.push('chat')
        })
    },
    deleteGroup() { // 删除分组
      this.axios.delete(`/server/deleteGroup/${this.group_id}`)
        .then((res) => {
          if (res.data.code === 0) {
            alert('删除成功')
            this.operateVisible = false
            this.getGroups()
          } else {
            alert('删除失败')
          }
        })
    },
    loginOut() { // 登出
      // 清空token
      const match = window.document.cookie.match(/(token)=\S*/)
      if (match) {
        window.document.cookie = `${match[1]}=; Max-Age=0`
      }
    
      this.$router.push('login')
    },
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
  
  .header {
    position: absolute;
    height: 5rem;
    width: 100%;
    background: #000;
    border-bottom: 1px solid lightgray;
    top: 0;
    left: 0;
    .button {
      width: 6rem;
      font-size: 2rem;
      height: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      position: absolute;
      right: 0;
      top: 0;
      &:hover {
        cursor: pointer;
        background: #fff;
        color: #000;
      }
    }
    .title {
      display: inline-block;
      width: 100%;
      font-size: 2rem;
      line-height: 5rem;
      color: #fff;
      text-align: center;
    }
  }

  .choice-groups {
    height: 100%;
    width: 100%;
    padding-top: 4rem;
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

  .new-group, .operate-group {
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
    .new-group-button, .operate-group-button {
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
    .operate-group-button {
      margin: 2rem 0;
    }
    .line-alert {
      font-size: 2.5rem;
      color: orangered;
      margin-bottom: 2rem;
    }
  }
}

.group-enter-active, .group-leave-active {
  transition: all .3s;
}
.group-enter, .group-leave-to {
  opacity: 0;
}
.group-leave, .group-enter-to {
  opacity: 1;
}
</style>

