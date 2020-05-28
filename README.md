# node

## 監視の検知スクリプト

chokidar/app.js<br>

chokidarを使い、dataディレクトリに変更があった時にconsole.logに出力

## awsのスクリプト
- aws/login_ec2.sh タグ取得時のEC2へのログイン
- aws/controller_ec2.sh ec2の起動・停止
./controller_ec2 start 停止
./controller_ec2 stop 停止
参考:https://gist.github.com/wata727/9849b639551c0c176ba4
- aws/send_sqs.js キューメッセージの作成
- aws/send_sqs.js キューメッセージの作成
- aws/receive_sql.js メッセージの受信と削除
- aws/ses.js メール送信
- aws/s3script.js s3スクリプト
- aws/s3util.js s3のユーリティリー
- aws/aws_lambda.py lambdaでのメール転送処理
- aws/aws_python.py pythonでのs3処理

### EC2 頻出コマンド

ec2起動・停止
```
#起動
aws ec2 start-instances --instance-ids ${instance-id}

#停止
aws ec2 stop-instances --instance-ids ${instance-id}
```

https://dev.classmethod.jp/articles/awscli-tips-ec2-start-stop/


情報取得(JSONでレスポンスあり)
```
#help
aws ec2 describe-tags help
#単一のインスタンス情報取得
aws ec2 describe-instances --instance-ids ${instance-id}
#複数取得
aws ec2 describe-instances --instance-ids ${instance-id} ${instance-id2} ${instance-id3}
#filter
#(例 key=Name, Value=WebServerというタグをスクリーニングしたい場合)
aws ec2 describe-instances \
    --filters "Name=tag-key,Values=Name" \
              "Name=tag-value,Values=WebServer"
下記のように書いても大丈夫
aws ec2 describe-instances --filters "Name=tag:Name,Values=WebServer"
```
詳細
https://dev.classmethod.jp/articles/aws-cli-filter-and-query-howto/

jsonパーサーを使った抽出
```
#インスタンスIDのみ取得する場合
aws ec2 describe-instances | jq '.Reservations[].Instances[].InstanceId'

#プライベートIPアドレスのみ
aws ec2 describe-instances | jq '.Reservations[].Instances[].PrivateIpAddress'

#パブリックIPアドレス
aws ec2 describe-instances | jq '.Reservations[].Instances[].PublicIpAddress'

#インスタンスID、インスタンスタイプ、プライベートIPを取得する場合
aws ec2 describe-instances | jq '.Reservations[].Instances[] | {InstanceId, InstanceType, PrivateIpAddress}'

#filter抽出 + IPアドレス
aws ec2 describe-instances \
    --filters "Name=tag-key,Values=Name" \
              "Name=tag-value,Values=WebServer" \
| jq '.Reservations[].Instances[].PublicIpAddress'


```

https://dev.classmethod.jp/articles/awscli-tips-ec2-start-stop/





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
