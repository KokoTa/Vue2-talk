const mongoose = require('mongoose')


// 用户模型
const User = {
  name: String, // 用户名
  password: String, // 密码
  avatar_url: String, // 用户头像
  group_id: String, // 分组id
  power: Number, // 用户权限 1. 管理员 2. 普通用户
}

// 聊天组模型
const Group = {
  name: String, // 分组名
  image_url: String, // 分组图
}

// 信息模型
const Info = {
  user_name: String, // 用户名
  text: String, // 聊天内容
  avatar_url: String, // 头像
  date: String, // 发表时间
  user_local: String, // 发表地点
  group_id: String, // 分组id
}

module.exports = {
  User,
  Group,
  Info
}