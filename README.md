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

### ネットワーク絡み

一番外側のネットワーク
```
aws ec2 create-vpc \
 --cidr-block 10.0.0.0/16
#成功時VPCの情報が帰ってくる

#タグはVPC作成後(vpc以外も当然できる)
aws ec2 create-tags --resources vpc-XXXXXXXXXXX \
--tags Key=Name,Value=total_out_VPC
```

インターネットゲートウェイ
```
#インターネットゲートウェイ
aws ec2 create-internet-gateway

 #VPCの紐付け
aws ec2 attach-internet-gateway \
 --internet-gateway-id igw-xxxxxxxx \
 --vpc-id vpc-xxxxxxxx
```

ルートテーブルの編集(VPC作成時に自動的に作られるので、編集)
```
aws ec2 create-route \
 --route-table-id rtb-XXXXXX \
 --destination-cidr-block 0.0.0.0/0 \
 --gateway-id igw-XXXXXXXXXXXX

```

サブネットの作成(ロードバランサーを前提に２つ作成し、availibility zoneを設定した方が良い)
```
aws ec2 create-subnet \
 --vpc-id vpc-XXXXX \
 --cidr-block XX.X.X.X/24 \
 --availability-zone --xx-xxxx-xxx
```


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

## ECR

https://qiita.com/Esfahan/items/2ddc8d481afd012da357#aws-ecr%E3%81%ABdocker-image%E3%82%92%E7%99%BB%E9%8C%B2


```

#リポジトリ作成(この段階でまだimageがあげられているわけではない)
aws ecr create-repository --repository-name リポジトリ名
#コンソールに行くと下記のようなスクリプトが出てくるのでコピペ
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin XXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com
#Login Succeededが表示される

#タグ付け&登録
docker tag (dockerイメージ):タグ \
   ecrURL/リポジトリ:タグ
例
docker tag redmine_redmine:latest \
   XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/redmine:latest

#プッシュ
docker push XXXXXXXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/redmine:latest
```

## ECS

ecs-cli インストール
```
brew install amazon-ecs-cli
```

### クラスター
クラスター作成
```
ecs-cli configure --region 地域 
--access-key XXXXXXXX \
--secret-key XXXXXXXX \
--cluster ecs-cli-test(クラスター名)
```
結果

```
INFO[0000] Saved ECS CLI cluster configuration default. 
```

クラスタ起動(オプションはシンプル)
```
ecs-cli up  \
--capability-iam --size 2 --instance-type t2.micro
```
結果(3〜5分かかる)
```
WARN[0000] You will not be able to SSH into your EC2 instances without a key pair. 
INFO[0003] Using recommended Amazon Linux 2 AMI with ECS Agent 1.42.0 and Docker version 19.03.6-ce 
INFO[0004] Created cluster                               cluster=redmine2058 region=us-east-1
INFO[0006] Waiting for your cluster resources to be created... 
INFO[0007] Cloudformation stack status                   stackStatus=CREATE_IN_PROGRESS
INFO[0070] Cloudformation stack status                   stackStatus=CREATE_IN_PROGRESS
INFO[0132] Cloudformation stack status                   stackStatus=CREATE_IN_PROGRESS
VPC created: XXXXXXXXXXXXXXXXXXXXXXX
Security Group created: XXXXXXXXXXXXX
Subnet created: subnet-XXXXXXXXXX
Subnet created: subnet-XXXXXXXXXX
Cluster creation succeeded.

```

タスク定義
```
ecs-cli compose -f docker-compose.yml up

docker-composeのimageがないとダメ ECRにあげた後、imageにECRのURLを記入

WARN[0000] Skipping unsupported YAML option for service...  option name=build service name=redmine
INFO[0002] Using ECS task definition                     TaskDefinition="redmine:4"
INFO[0002] Starting container...                         container=xxxxxxxxxx/redmine
INFO[0002] Describe ECS container status                 container=xxxxxxxxxx/redmine desiredStatus=RUNNING lastStatus=PENDING taskDefinition="redmine:4"
INFO[0016] Describe ECS container status                 container=xxxxxxxxxx/redmine desiredStatus=RUNNING lastStatus=PENDING taskDefinition="redmine:4"
INFO[0022] Started container...                          container=xxxxxxxxxx/redmine desiredStatus=RUNNING lastStatus=RUNNING taskDefinition="redmine:4"

```
タスクストップ
ecs-cli compose -f docker-compose.yml down

現状確認
ecs-cli ps

```
Name                                          State    Ports                        TaskDefinition  Health
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/redmine  RUNNING  XX.XX.XX.XX:80->3000/tcp  redmine:4       UNKNOWN

```

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
