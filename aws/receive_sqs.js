const AWS = require('aws-sdk')
var loadenv = require('node-env-file')
loadenv('.env')

AWS.config.update({
  region:'us-east-1'
})

let sqs = new AWS.SQS()

let params = {
  QueueUrl:process.env.QUEUE_URL
}


sqs.receiveMessage(params, (err, data) => {
  if (err) {
    console.log("receive Err", err);
  }
  var messages = data['Messages']

  for(var i=0; i < messages.length; i++) {
    let delete_params = {
      QueueUrl:process.env.QUEUE_URL,
      ReceiptHandle:messages[i]['ReceiptHandle']
    }
    sqs.deleteMessage(delete_params,(err, data) => {
      if (err) {
        console.log("delete Err", err);
      }
      console.log(data)
    })
  }
})
