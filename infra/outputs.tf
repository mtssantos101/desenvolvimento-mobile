output "bucket_name" {
  description = "Nome do bucket S3"
  value       = aws_s3_bucket.website.id
}

output "website_endpoint" {
  description = "URL para acessar o site"
  value       = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "bucket_domain_name" {
  description = "Domínio regional do bucket"
  value       = aws_s3_bucket.website.bucket_regional_domain_name
}

output "bucket_arn" {
  description = "ARN do bucket"
  value       = aws_s3_bucket.website.arn
}
