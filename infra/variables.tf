variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Nome do bucket S3 (deve ser globalmente único)"
  type        = string
  default     = "meu-site-estatico-bucket"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.bucket_name))
    error_message = "O nome do bucket deve conter apenas letras minúsculas, números e hífens."
  }
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "website-estatico"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment deve ser dev, staging ou prod."
  }
}

variable "enable_cloudfront" {
  description = "Habilitar distribuição CloudFront"
  type        = bool
  default     = false
}
