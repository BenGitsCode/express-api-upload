'use strict';

require('dotenv').load();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');

const path = require('path');
const crypto = require('crypto');

const s3Upload = (options)=>{
  let ext = path.extname(options.originalname);
  let folder = (new Date()).toISOString().split('T')[0];
  let stream = fs.createReadStream(options.path);

  return new Promise((resolve, reject)=>{
    crypto.randomBytes(16, (error, buffer)=>{
      if(error){
        reject(error);
      }
      else {
        resolve(buffer.toString('hex'));
      }
    })
  })
  .then((filename)=>{
    let params = {
      ACL: 'public-read',
      ContentType: options.mimetype,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${folder}/${filename}${ext}`,
      Body: stream
    };

    return new Promise((resolve, reject)=>{
      s3.upload(params, function (error, data){
        if(error){
          // console.log(error);
          reject(error);
        }
        else {
          // console.log(data);
          resolve(data);
        }
      });
    })
  })
};

module.exports = s3Upload;
