const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const { parseData } = require('../../../utils/tools');

//如果上传目录不存在，那么就先创建目录
if(!fs.existsSync(('./public/uploads'))) {
    fs.mkdirSync('./public/uploads');
    recursive = true;
}

//设置上传文件的存储路径
const storage = multer.diskStorage({
    //目录设置
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    //文件名设置
    filename: function (req, file, cb) {
      cb(
        null, 
        Math.round(Math.random()*1e9) +
        file.fieldname + '-' + Date.now() + path.extname(file?.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

router.post('/upload', upload.single('file') ,(req, res) => {
  // upload file
  res.json(parseData('/uploads/' + req.file.filename))

})

module.exports = router;