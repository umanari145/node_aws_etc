const AWS = require('aws-sdk')

AWS.config.update({
   //バージニア北部
  region:'us-east-1'
})

let ses = new AWS.SES();

let params = {
  Destination: {
    ToAddresses:['matsu@3films.com']
  },
  Message: {
    Body:{
      Text:{
        Data: '本日は晴天なり',
        Charset: 'utf-8'
      }
    },
    Subject:{
      Data: 'サンプルタイトルです。',
      Charset: 'utf-8'
    }
  },
  Source: 'matsumoto@dt30.net'
};


ses.sendEmail(params, (err, data)=>{
  if (err) console.log(err, err.stack)
  console.log(data)
})
