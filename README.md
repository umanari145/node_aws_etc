# node

## 監視の検知スクリプト

chokidar/app.js<br>

chokidarを使い、dataディレクトリに変更があった時にconsole.logに出力

## awsのスクリプト

- aws/send_sqs.js キューメッセージの作成
- aws/send_sqs.js キューメッセージの作成
- aws/receive_sql.js メッセージの受信と削除
- aws/ses.js メール送信
- aws/s3script.js s3スクリプト
- aws/s3util.js s3のユーリティリー
- aws/aws_lambda.py lambdaでのメール転送処理
- aws/aws_python.py pythonでのs3処理


### SES
aws/ses.js<br>
matsumoto@dt30.netからumanari145@gmail.com送信

SESからS3への書き込み許可
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowSESPuts",
            "Effect": "Allow",
            "Principal": {
                "Service": "ses.amazonaws.com"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::バケット名/*",
            "Condition": {
                "StringEquals": {
                    "aws:Referer": "アカウントID"
                }
            }
        }
    ]
}
```
### SQS

キューサービス・・時間のかかる処理などを一時保存していき随時実行することなどができる

登録
aws sqs send-message --queue-url QueueUrl \
--message-body "test message nagabuchi" \

受信
aws sqs receive-message --queue-url QueueUrl

削除
aws sqs delete-message --queue-url QueueUrl
--receipt-handle

### Lambda
サーバーレスサービス
- メール受信後、S3に保存
- ファイル操作など

## SNS
aws sns publish \
        --topic-arn "arn:aws:sns:リージョン番号:sns番号:sns名" \
        --message '本日は晴天なり' \
        --subject "test"

## SES
aws ses send-email --destination "ToAddresses=送信先メールアドレス" \
 --message "Subject={Data=TEST,Charset=utf8},Body={Text={Data='ホゲホゲ',Charset=utf8}}" \
 --source-arn (AWSのarn) \
 --from "送信元メールアドレス" --region us-east-1

## S3
s3コマンド
aws s3 cp あげたいファイルパス s3://bucket名/フォルダパス/ ←スラッシュ忘れない

### 一覧取得
aws s3 ls s3://バケット名/フォルダ名/ | awk '{print $1}'

### 抽出
aws s3 ls s3://バケット名/フォルダ名/ | grep sample

### ファイルダウンロード
aws s3 cp s3://バケット名/ファイルパス ./

## firebase

- firebase/crud.php 登録 API
- firebase/crud_test.php APIテスト
