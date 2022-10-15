import * as AWS from 'aws-sdk';

export class S3Service {
  async singleUploadToS3(file: Express.Multer.File) {
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });

    await s3
      .upload({
        Bucket: process.env.BUCKET,
        Key: `images/${file.originalname}`,
        Body: file.buffer,
      })
      .promise();
    const data = s3.getSignedUrl('getObject', {
      Bucket: process.env.BUCKET,
      Key: `images/${file.originalname}`,
    });
    return data;
  }
}
