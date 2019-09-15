import boto3
import re
from boto3.session import Session

def lambda_handler(event, context):
    extract_mail(event)

def extract_mail(event):

    #転送メールの送信元ドメイン名
    DOMAIN_NAME = "ドメイン名"


    BUCKET_NAME = 'バケツ名'
    FOREWARD_MAIL = ['転送先メール']
    REGION = 'us-east-1'

    session = Session(aws_access_key_id='アクセスキー',
                  aws_secret_access_key='シークレットキー',
                  region_name='リージョン')

    s3  = session.client('s3')
    ses = session.client('ses')

    messageId = event['Records'][0]['ses']['mail']['messageId']

    #本来の送信者
    MAIL_SOURCE = event['Records'][0]['ses']['mail']['source']

    #転送メールの送信者
    MAIL_FROM = MAIL_SOURCE.replace('@','=') + "@" + DOMAIN_NAME

    try:
        response = s3.get_object(
            Bucket = BUCKET_NAME,
            Key    = messageId
        )
    except Exception as e:
        raise e

    #メールヘッダの書き換え
    try:
        replaced_message = response['Body'].read().decode('utf-8')
        replaced_message = re.sub("\nTo: .+?\n", "\nTo: %s\n" % ", ".join(FOREWARD_MAIL), replaced_message,1)
        replaced_message = re.sub("\nFrom: .+?\n", "\nFrom: %s\n" % MAIL_FROM, replaced_message,1)
        replaced_message = re.sub("^Return-Path: .+?\n", "Return-Path: %s\n" % MAIL_FROM, replaced_message,1)
    except Exception as e:
        raise e


    try:
        response = ses.send_raw_email(
            Source = MAIL_FROM,
            Destinations= FOREWARD_MAIL,
            RawMessage={
                'Data': replaced_message
            }
        )
    except Exception as e:
        raise e
