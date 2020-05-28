#!/bin/bash

action=$1

instance_id=`aws ec2 describe-instances \
    --filters "Name=tag-key,Values=Name" \
              "Name=tag-value,Values=WebServer" \
| jq -r '.Reservations[].Instances[].InstanceId'`
#jqコマンド -rオプションでダブルクオートなしでデータが取れる

if [ ${action} = "start" ];then
    #起動
    aws ec2 start-instances --instance-ids ${instance_id}
elif [ ${action} = "stop" ];then
    #停止
    aws ec2 stop-instances --instance-ids ${instance_id}
else
    echo "Error: Invalid Argument";
fi

#"をトル
#ip=${ipaddress//\"/}
#echo ${ip}
#ssh ec2-user@${ip} -i ~/.ssh/ec2_20200526.pem
