const mongoose = require('mongoose')
const Schema = require('./schema')

const User = mongoose.model('User', Schema.User)
const Group = mongoose.model('Group', Schema.Group)
const Info = mongoose.model('Info', Schema.Info)

module.exports = {
  User,
  Group,
  Info
}