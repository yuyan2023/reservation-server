const bcrypt = require('bcryptjs'); 
const { token } = require('morgan');
const jwt = require('jsonwebtoken');
/**
 * 
 * @param {*} date 
 * @param {*} success 
 * @param {*} errorMessage 
 * @param {*} errorCode 
 * @returns 
 */
function parseData(
    date = {},
    success = true,
    errorMessage = '',
    errorCode = '',
) {
  // parse date
  return {
    date,
    success,
    errorMessage,
    errorCode,
  };
}

const saltRounds = 10;

/**
 * 加密密码
 * @param {*} password 
 * @param {*} cb 
 */
function encodedPwd(password,cb) {
  bcrypt.hash(password + '', saltRounds ,(err,hash) => {
    if (err) throw err;
    cb(hash);
  });
}

/**
 * 验证密码
 * @param {*} password 密码
 * @param {*} hash 加密之后的密码
 * @param {*} cb 回调函数
 */
function comparePwd(password, hash, cb) {
  bcrypt.compare(password +'', hash, (err,res) => {
    if(err) throw err;
    cb(res);
  })
}

const secretKey ='arivin-key'
/**
 * 生成token数据
 * @param {*} user 
 * @returns 
 */
function generateToken(user) {

  const token = jwt.sign(
    {userId: user.id,},
     secretKey,
    {expiresIn: '5h'}
  );
  return token;
  
}

module.exports = {  
    parseData,
    encodedPwd,
    comparePwd,
    generateToken
    };