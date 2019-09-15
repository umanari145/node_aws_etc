const AWS = require('aws-sdk')
var loadenv = require('node-env-file')
loadenv('.env')

AWS.config.update({
  region:'us-east-1'
})

let sqs = new AWS.SQS()

let send_data = {
  "message":"本日は晴天なり"
}

let params = {
  MessageBody: JSON.stringify(send_data),
  QueueUrl:process.env.QUEUE_URL
}

//awscli
// aws sqs send-message \
// --queue-url  URL \
// --message-body 'hogehoge'

sqs.sendMessage(params, (err, data) => {
  if (err) {
    console.log("Err", err);
  }
  console.log(data)
})
