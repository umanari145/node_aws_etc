const AWS = require('aws-sdk')
const fs = require('fs');
const _ = require('lodash');

module.exports = class s3util{

    /**
     * インスタンス生成
     * @param string accessKey アクセスキー
     * @param string secretKey シークレットキー
     * @param string region    地域
     * @param string bucketName バケツ名
     */
    constructor(accessKey, secretKey, region, bucketName) {
        this.s3Client = new AWS.S3({
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: region,
        })
        this.bucketName = bucketName
    }

    /**
     * ファイルのアップロード
     * @param  string filePath ローカルのファイルパス
     * @param  string keyPath  s3上のkey
     */
    putObject(filePath, keyPath) {
        let params = {
            Bucket: this.bucketName,
            Key:keyPath
        }

        let fileObj = fs.readFileSync(filePath);
        if (!fileObj) {
            console.log('ファイルが存在しません。');
        }
        params.Body = fileObj;
        this.s3Client.putObject(params, function(err, data) {
          if (err) {
              console.log(err, err.stack);
          } else{
              console.log(data);
          }
        });
    }

    /**
     * ファイルのダウンロード
     * @param  string keyPath  s3上のkey
     * @param  string filePath ローカルのファイルパス
     */
    getObject(keyPath ,filePath) {
        let params = {
            Bucket: this.bucketName,
            Key:keyPath
        }
        this.s3Client.getObject(params, function (error, data) {
            if (error != null) {
              console.log("Failed to retrieve an object: " + error);
            } else {
              console.log("Loaded " + data.ContentLength + " bytes");
              var ws = fs.createWriteStream(filePath, {flags: 'a'});
              ws.write(data.Body);
            }
        })
    }

    /**
     * ファイルパスの一覧
     * @return Array ファイルパス
     */
    async getList() {
        let params = {
            Bucket:this.bucketName,
        }

        let filePathList = await this.s3Lists(params).then(data => {
            if (data) {
                let fileArr = new Array()
                _.forEach(data.Contents, (object) =>{
                    if(object.Key) {
                        fileArr.push(object.Key)
                        //console.log('each object ' + object.Key)
                    }
                })
                return fileArr
            }
        },(err,msg)=> {
            console.log('S3からの一覧に失敗しました。')
            console.log(err)
        })
        //console.log(filePathList)
        console.log('return getList')
        return filePathList
    }

    /**
     * 一覧の取得
     * @params params パラメーター
     */
    s3Lists(params) {
        return new Promise ((resolve,reject) => {
            this.s3Client.listObjects(params, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        });
    }
}
