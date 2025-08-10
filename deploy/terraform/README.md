# Terraform Deployment (AWS)

Modules to provision:
- ECR repositories for each service
- ECS (or EKS) cluster and services
- RDS PostgreSQL
- ElastiCache Redis
- S3 bucket for attachments and static assets
- CloudFront distribution for frontend
- ALB for backend and AI services

Steps:
1. Configure AWS credentials
2. `terraform init`
3. `terraform apply -var-file=env/dev.tfvars`

Outputs will include service endpoints and RDS connection details.