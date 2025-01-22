const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { prisma } = require('./db');
const { encodedPwd, secretKey } = require('./utils/tools');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//使用各种中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const jwtCheck = require('express-jwt').expressjwt({
  secret: secretKey,
  algorithms: ['HS256'],
})
// 使用自己写的路由模块
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/common', require('./routes/api/v1/common'));
// login
app.use('/api/v1/auth', require('./routes/api/v1/auth'));

app.use('/api/v1/admin/*', jwtCheck);
app.use('/api/v1/admin/managers', require('./routes/api/admin/managers'));
app.use('/api/v1/admin/article_categories', require('./routes/api/admin/article_categories'));

app.use('/api/v1/admin/articles', require('./routes/api/admin/articles'));
app.use('/api/v1/admin/reservations', require('./routes/api/admin/reservations'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(parseData(err.message, false, 'error',err.status || 500));
});

initDbData();
//初始化数据库数据
async function initDbData() {
  const countAdmin = await prisma.manager.count({  
    where: { 
      userName: 'admin' 
},
});
if (countAdmin === 0) {
  encodedPwd('admin', async (pwd) => {
  await prisma.manager.create({
    data: {
      userName: 'admin',
      password: 'pwd',
      nickName: 'admin',
      avatar:''
    },
  });
});
}
}
module.exports = app;
