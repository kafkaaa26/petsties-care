import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '@core/config/app.config';
import { CommonService } from './common.service';
import { logger } from '@core/models/logger';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly commonService: CommonService) {
    this.bucketName = config.aws.s3.bucketName;
    this.s3Client = new S3Client({
      region: config.aws.s3.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }

  // Generate unique file key
  generateFileKey(fileOriginalName: string): string {
    const fileExtension = fileOriginalName.split('.').pop();
    return `avatars/${this.commonService.generateUUIDv4()}.${fileExtension}`;
  }

  // Upload file to S3
  async uploadFile(file: any, customKey?: string): Promise<string> {
    const key = customKey || this.generateFileKey(file.originalname);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.buffer.length,
      // ACL: 'public-read',
    });

    await this.s3Client.send(command);

    return `https://${this.bucketName}.s3.${config.aws.s3.region}.amazonaws.com/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    logger.log('Deleting file from S3:', key);
    if (!key) return;

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async deleteMultiFile(keys: string[]): Promise<void> {
    if (!keys || keys.length === 0) return;
    const deleteParams = {
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: false,
      },
    };
    const command = new DeleteObjectsCommand(deleteParams);
    await this.s3Client.send(command);
  }

  async generatePresignedUrlToPut(
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async generatePresignedUrlToGet(
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
