import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '@core/config/app.config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = config.aws.s3.bucketName;
    this.s3Client = new S3Client({
      region: config.aws.s3.region,
      credentials: {
        accessKeyId: config.aws.s3.accessKeyId,
        secretAccessKey: config.aws.s3.secretAccessKey,
      },
    });
  }

  signedGetObject = async (
    bucket: string,
    key: string,
    fileName?: string,
    download?: boolean,
  ): Promise<string> => {
    const params = {
      Bucket: bucket || this.bucketName,
      Key: key,
      Expires: config.aws.s3.urlDownloadExpiresIn,
      ResponseContentDisposition: 'inline',
    };

    if (fileName && download) {
      params.ResponseContentDisposition = `attachment;filename="${encodeURIComponent(
        fileName,
      )}"`;
    }

    return await getSignedUrl(this.s3Client, new GetObjectCommand(params), {
      expiresIn: 3600,
    });
  };

  uploadFileToS3AndGetSignedUrl = async (
    bucket: string,
    key: string,
    body: any,
    fileName?: string,
  ) => {
    const s3Key = `${config.aws.s3.prefixExport}/${key}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket || this.bucketName,
        Key: s3Key,
        Body: body,
      }),
    );

    return this.signedGetObject(
      bucket,
      s3Key,
      fileName || key.split('/').pop(),
      true,
    );
  };
}
