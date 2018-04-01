const express = require('express')
const app = express()
// https://stackoverflow.com/questions/27492101/what-is-happening-when-requirehttp-server-is-evaluated-with-an-express-app
// app.listen(port) = require('http').Server(app).listen(port)
// socket.io 需要一个服务器实例进行套接
const server = require('http').Server(app);
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const router = require('./router')

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// 解析 application/json
app.use(bodyParser.json())
// 解析 cookie
app.use(cookieParser())
// 静态文件路径
app.use(express.static(path.join(__dirname, 'public')));
// 路由
app.use(router);
// 错误处理
app.use((req, res, next) => {
  const err = 'Error router!';
  next(err);
})
app.use((err, req, res, next) => {
  res.status(500)
  res.send(err)
})

// socket.io 逻辑
let num = 0; // 在线人数统计
io.on('connection', (socket) => { // 当有连接进入时
  console.log('online')

  // 通过 localhost:3000?group_id=xxx 的方式来划分房间
  const roomId = socket.handshake.query.group_id
  console.log(roomId)

  socket.join(roomId) // 加入某房间

  socket.to(roomId).emit('online', ++num); // 加入房间后，向房间内其他人广播online事件

  socket.to(roomId).on('groupMsg', (msg) => { // 当有人在某房间内发送消息时
    console.log('message')
    socket.to(roomId).emit('outerText', msg); // 向房间内其他人广播outerText事件
  })

  socket.to(roomId).on('quitGroup', () => { // 当有人退出房间时
    console.log('quitGroup')
    socket.to(roomId).emit('offline', --num); // 向其他人广播offline事件
    socket.leave(roomId) // 离开房间
  })

  socket.on('disconnect', () => { // 当有人关闭应用时
    console.log('offline')
    socket.to(roomId).emit('offline', --num); // 向房间内其他人广播offline事件
    socket.leave(roomId) // 离开房间
  })

})

// 监听
server.listen(3000, () => {
  console.log('Server ok');
})