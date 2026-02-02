# AWS S3 Upload Configuration Guide

This document explains how to configure AWS S3 for file uploads in the survey application.

## Prerequisites

1. AWS Account with S3 access
2. IAM User with programmatic access
3. S3 Bucket created

## AWS Setup Steps

### 1. Create an S3 Bucket

1. Go to AWS Console → S3
2. Click "Create bucket"
3. Configure:
   - **Bucket name**: Choose a unique name (e.g., `nusantara-survey-uploads`)
   - **Region**: Choose a region (e.g., `ap-southeast-1` for Singapore)
   - **Block Public Access**: Keep enabled for security

### 2. Configure CORS Policy

1. Go to your bucket → Permissions → CORS configuration
2. Add the following CORS policy:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

3. Save the configuration

### 3. Create IAM User

1. Go to AWS Console → IAM → Users
2. Click "Create user"
3. **User name**: `nusantara-survey-uploader`
4. **Select AWS credential type**: Access key - Programmatic access
5. **Permissions**: "Attach policies directly"
6. Click "Create policy" and add the following:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3UploadPolicy",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::nusantara-survey-uploads",
                "arn:aws:s3:::nusantara-survey-uploads/*"
            ]
        }
    ]
}
```

Replace `nusantara-survey-uploads` with your bucket name.

7. Attach this policy to the user
8. Create the user

### 4. Get Access Keys

1. After user creation, you'll see **Access key ID** and **Secret access key**
2. Save both securely (you won't see the secret key again!)

### 5. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=EXAMPLE
AWS_SECRET_ACCESS_KEY=EXAMPLEKEY
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET_NAME=nusantara-survey-uploads
```

Replace with your actual values.

## File Upload Features

### Supported File Types
- Images: JPEG, PNG, WebP
- Documents: PDF

### File Size Limit
- Maximum: 10MB per file
- Maximum: 5 files per upload section

### Upload Locations
Files are uploaded to specific S3 paths:
1. **Bukti Pakar**: `surveys/sdm-bukti/{entryNumber}/`
2. **Dokumentasi Kegiatan**: `surveys/komunitas-dokumentasi/{entryNumber}/`
3. **Dokumentasi Alat**: `surveys/alat-dokumentasi/{entryNumber}/`
4. **Bukti Dukungan Pemda**: `surveys/pemda-bukti/{entryNumber}/`

### Security Features
- **Presigned URLs**: Temporary upload URLs (valid for 1 hour)
- **File validation**: Type and size checking before upload
- **Unique filenames**: Timestamp + random string + original name
- **Direct upload**: Files go directly to S3 (not through server)

## How It Works

1. User selects files in the survey form
2. Frontend sends file metadata to `/api/upload`
3. Backend generates a presigned S3 URL
4. Frontend uploads file directly to S3 using the presigned URL
5. S3 URL is saved to MongoDB with survey data
6. Files can be viewed/downloaded from the management page

## Testing

1. Restart the development server:
   ```bash
   pnpm dev
   ```

2. Go to http://localhost:3000/survey/section2

3. Fill out a survey entry

4. When you see file upload sections, try uploading:
   - Test images (JPG/PNG)
   - Test PDF documents
   - Test large files (>5MB to verify size limit)

5. Check the S3 bucket to see uploaded files

6. Submit the survey and check the management page to view uploaded files

## Troubleshooting

### "Access Denied" Error
- Check IAM user permissions
- Verify bucket name in environment variables
- Ensure region matches

### "CORS Error" in Browser
- Verify CORS configuration on S3 bucket
- Make sure AllowedOrigins includes your domain or `*`
- Check AllowedMethods includes PUT and POST

### Files Not Appearing in Management Page
- Check browser console for errors
- Verify files were uploaded to S3
- Check MongoDB for file URLs in survey data

### Presigned URL Expired
- URLs are valid for 1 hour
- If upload takes longer, regenerate URL
- Implement retry logic in production

## Cost Considerations

- **S3 Storage**: ~$0.023/GB/month (Singapore region)
- **S3 Requests**: $0.0004 per 1,000 PUT requests
- **Data Transfer**: $0.09/GB (first 10TB/month to internet)

For a survey system with ~100 surveys with 5 files each (5MB average):
- Storage: 100 × 5 × 5MB = 2.5GB ≈ $0.06/month
- Upload requests: 500 requests ≈ $0.20/month
- Total: ~$0.26/month (negligible)

## Production Recommendations

1. **Enable Versioning**: For file recovery
2. **Set Lifecycle Rules**: Auto-delete old uploads (e.g., 2 years)
3. **Enable Logging**: Track upload activities
4. **Use CloudFront**: For faster file delivery and caching
5. **Monitor Costs**: Set up AWS Budgets alerts

## Security Best Practices

1. Never commit `.env.local` to version control
2. Rotate access keys regularly (every 90 days)
3. Use IAM roles instead of access keys for server-side uploads
4. Enable MFA on AWS account
5. Use bucket policies for additional security layers

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
