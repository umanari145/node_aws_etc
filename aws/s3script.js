const AWS = require('aws-sdk')
const fs = require('fs');
const path = require('path');

const s3util = require('./s3util.js')
const loadenv = require('node-env-file')
loadenv('.env')


// S3 を操作するためのインスタンスを生成
const s3UtilObj = new s3util(
  process.env.ACCESS_KEY,
  process.env.SECRET_KEY,
  process.env.REGION,
  process.env.BUCKET_NAME
);
//s3UtilObj.putObject('yuuka.jpg', 'nogizaka/yuuka.jpg')
//s3UtilObj.getObject('nogizaka/yuuka.jpg', 'sugai.jpg')

s3UtilObj.getList().then((filePathList) => {
    console.log('data')
    console.log(filePathList)
},(err,msg)=> {
    console.log('データ取得に失敗しました。')
    console.log(err)
})
