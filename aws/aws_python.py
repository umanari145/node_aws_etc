import os
import boto3
from os.path import join,dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

BUCKET_NAME = os.environ.get("BUCKET_NAME")
REGION = os.environ.get("REGION")

s3 = boto3.resource('s3')

file_key = 's3のキー'


s3 = boto3.client('s3', region_name = REGION)
mail_object = s3.get_object(Bucket = BUCKET_NAME, Key = file_key)
#オブジェクトの情報
#print(mail_object)

mail_body = mail_object['Body'].read().decode('utf-8')
#ここでメールヘッダ見れる
#print(mail_body)



print(body)
