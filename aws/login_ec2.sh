#!/bin/bash
ipaddress=`aws ec2 describe-instances \
    --filters "Name=tag-key,Values=Name" \
              "Name=tag-value,Values=WebServer" \
| jq '.Reservations[].Instances[].PublicIpAddress'`
#"をトル
ip=${ipaddress//\"/}
#echo ${ip}
ssh ec2-user@${ip} -i ~/.ssh/ec2_20200526.pem
