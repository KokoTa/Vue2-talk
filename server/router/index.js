const express = require('express');
const router = express.Router();

// 连接数据库
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/talk');
// 监听数据库异常
const db = mongoose.connection;
db.on('error', () => console.log('db connect error!'));
db.on('open', () => console.log('db connect success!'));
// 引用数据模型
const Model = require('../db/model');

// 登录
router.post('/login', (req, res, next) => {
  // 用户匹配
  Model.User.findOne({
    name: req.body.name,
    password: req.body.password,
  }).exec((err, result) => {
    if (err) res.sendStatus(500);
    if (!result) {
      res.status(200).json({
        code: 1,
        data: result,
        msg: '用户/密码错误',
      });
    } else {
      res.status(200).json({
        code: 0,
        data: result,
        msg: '登录成功',
      });
    }
  });
});

// 注册
router.post('/signUp', (req, res, next) => {
  // 用户名查重
  Model.User.find({
    name: req.body.name,
  }).exec((err, result) => {
    // 错误处理
    if (err) res.sendStatus(500);

    // 如果有重复用户
    if (result.length) {
      res.status(200).json({
        code: 1, // 1 代表成功; 2 代表失败
        data: null,
        msg: '用户已存在',
      });
    } else {
      // 如果没有重复就新建用户
      const newUser = new Model.User({
        name: req.body.name,
        password: req.body.password,
        avatar_url: req.body.avatar_url,
        group_id: null,
      }).save((err, result) => {
        if (err) {
          res.sendStatus(500)
        } else {
          res.status(200).json({
            code: 0,
            data: result,
            msg: '用户注册成功',
          });
        }
      });
    }
  });
});

// 取得所有分组
router.get('/getGroups', (req, res, next) => {
  // 取得所有分组
  Model.Group.find({}).exec((err, result) => {
    if (err) res.sendStatus(500);

    if (!result.length) {
      res.status(200).json({
        code: 1,
        data: [],
        msg: '无分组',
      });
    } else {
      res.status(200).json({
        code: 0,
        data: result,
        msg: `存在${result.length}个分组`,
      });
    }
  });
});

// 取得某个分组
router.get('/getGroup/:group_id', (req, res, next) => {
  Model.Group.findOne({
    _id: req.params.group_id
  }).exec((err, result) => {
    if (err) res.sendStatus(500)
    if (!result) {
      res.status(200).json({
        code: 1,
        data: null,
        msg: '分组不存在'
      })
    } else {
      res.status(200).json({
        code: 0,
        data: result,
        msg: '查找成功'
      })
    }
  })
})

// 新建一个分组
router.post('/addGroup', (req, res, next) => {
  const newGroup = new Model.Group({
    name: req.body.name,
    image_url: req.body.image_url
  }).save((err, result) => {
    if (err) {
      res.status(200).json({
        code: 1,
        data: null,
        msg: '新建失败'
      })
    } else {
      res.status(200).json({
        code: 0,
        data: result,
        msg: '新建分组成功'
      })
    }
  })
});

// 退出某个分组
router.put('/quitGroup', (req, res, next) => {
  Model.User.findOne({
    name: req.body.name,
    password: req.body.password
  }).exec((err, result) => {
    console.log(result, req.body)
    if (err) res.sendStatus(500)
    if (!result) {
      res.status(200).json({
        code: 1,
        data: null,
        msg: '用户不存在'
      })
    } else {
      result.group_id = null
      result.save((err, r) => {
        if (err) res.sendStatus(500)
        res.status(200).json({
          code: 0,
          data: r,
          msg: '退出成功'
        })
      })
    }
  })
});

// 保存某个分组
router.post('/saveGroup', (req, res, next) => {
  Model.User.findOne({
    name: req.body.name,
    password: req.body.password
  }).exec((err, result) => {
    if (err) { 
      res.sendStatus(500)
    } else {
      // 保存分组id
      result.group_id = req.body.group_id
      result.save((err, result) => {
        if (err) { 
          res.sendStatus(500)
        } else {
          res.status(200).json({
            code: 0,
            data: result,
            msg: '保存分组id成功'
          })
        }
      })
    }
  })
});

// 获得某个分组消息
router.get('/getInfos/:group_id', (req, res, next) => {
  Model.Info.find({
    group_id: req.params.group_id
  }).exec((err, result) => {
    if (err) res.sendStatus(500)
    if (!result.length) {
      res.status(200).json({
        code: 1,
        data: [],
        msg: '无消息记录'
      })
    } else {
      res.status(200).json({
        code: 0,
        data: result,
        msg: `有${result.length}条消息`
      })
    }
  })
});

// 保存信息
router.post('/saveInfo', (req, res, next) => {
  const body = req.body;
  const newInfo = new Model.Info({
    ...body
  }).save((err, result) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.status(200).json({
        code: 0,
        data: result,
        msg: '消息保存成功'
      })
    }
  })
});


module.exports = router;
