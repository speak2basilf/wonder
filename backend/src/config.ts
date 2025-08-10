export const config = {
  jwtSecret: process.env.JWT_SECRET || 'dev',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'dev',
  encryptionKeyBase64: process.env.ENCRYPTION_KEY_BASE64 || '',
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB || 'cliniglobal',
    user: process.env.POSTGRES_USER || 'cliniglobal',
    password: process.env.POSTGRES_PASSWORD || 'cliniglobal_password'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379)
  },
  s3: {
    bucket: process.env.S3_BUCKET || 'cliniglobal-attachments',
    region: process.env.AWS_REGION || 'us-east-1'
  },
  integrations: {
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || ''
    }
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || '',
    index: process.env.PINECONE_INDEX || 'cliniglobal-crm'
  }
};