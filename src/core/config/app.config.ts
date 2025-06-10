import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3008,
  environment: process.env.NODE_ENV || 'development',
  jwt_access_token_expires_in: !isNaN(
    Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
  )
    ? Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN)
    : process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h',
  jwt_refresh_token_expires_in: !isNaN(
    Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
  )
    ? Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)
    : process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',

  timezone: process.env.TZ || 'Asia/Tokyo',
  jwt_secret: process.env.JWT_SECRET || '',
  api_prefix: '/petstie-care/api',
  app: {
    jsonLimit: '1mb',
  },
  encoding: {
    shift_jis: 'Shift_JIS',
    utf8: 'utf8',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3: {
      region: process.env.AWS_S3_REGION || 'ap-northeast-1',
      bucketName: process.env.AWS_S3_BUCKET_NAME || '',
    },
    ses: {
      region: process.env.AWS_SES_REGION || 'us-east-1',
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: process.env.EMAIL_SECURE !== 'false',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      fromAddress: process.env.EMAIL_FROM,
    },
  },
  logoUrl:
    process.env.LOGO_URL ||
    'https://atmablap-rag-file-store.s3.us-east-1.amazonaws.com/clinics/logo.jpeg',
};
