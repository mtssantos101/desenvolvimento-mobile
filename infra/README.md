# Configuração de S3 para Hospedagem de Site Estático

Este diretório contém a configuração Terraform para criar um bucket S3 hospedando um site estático.

## 📋 Pré-requisitos

- Terraform >= 1.0
- AWS CLI configurada com credenciais válidas
- Uma conta AWS ativa

## 🚀 Como usar

### 1. Preparar as variáveis

```bash
# Copie o arquivo de exemplo
cp terraform.tfvars.example terraform.tfvars

# Edite o arquivo terraform.tfvars com seus valores
vim terraform.tfvars
```

**Importante:** O `bucket_name` deve ser **globalmente único** em toda a AWS.

### 2. Inicializar o Terraform

```bash
terraform init
```

### 3. Visualizar o plano

```bash
terraform plan
```

### 4. Aplicar a configuração

```bash
terraform apply
```

Confirme digitando `yes` quando solicitado.

### 5. Deploy do seu site

Após criar o bucket, você pode fazer upload dos arquivos da aplicação:

```bash
# Construir a aplicação React
cd ../app
npm run build

# Fazer upload dos arquivos para o S3
aws s3 sync dist/ s3://des-mobile-sports-hub-2026 --delete
```

## 📊 Outputs disponíveis

Após a aplicação, você terá acesso aos seguintes outputs:

- **bucket_name**: Nome do bucket S3
- **website_endpoint**: URL para acessar o site (ex: `http://bucket.s3-website-us-east-1.amazonaws.com`)
- **bucket_domain_name**: Domínio regional do bucket
- **bucket_arn**: ARN do bucket para referências

Para ver os outputs:

```bash
terraform output
```

## 🔒 Segurança

A configuração atual:
- ✅ Permite acesso público de leitura (necessário para um website)
- ✅ Bloqueia operações de eliminação acidental
- ✅ Habilita versionamento para recuperação
- ✅ Configura CORS para requisições cross-origin

## 🌐 Acessar seu site

Após o deploy, seu site está disponível em:

```
http://des-mobile-sports-hub-2026.s3-website-sa-east-1.amazonaws.com
```

## 📝 Estrutura dos arquivos

- `provider.tf` - Configuração do provider AWS
- `s3.tf` - Recurso principal do bucket S3
- `variables.tf` - Definição de variáveis
- `outputs.tf` - Definição dos outputs (bucket_name, website_endpoint, etc)
- `terraform.tfvars` - Valores das variáveis (não commitado no git)
- `terraform.tfvars.example` - Exemplo de arquivo de configuração

## 🗑️ Destruir a infraestrutura

⚠️ **Cuidado!** Isso deletará o bucket e seu conteúdo.

```bash
terraform destroy
```

## 🔗 Próximos passos

Para melhorar seu setup, considere:

1. **CloudFront**: Adicionar uma distribuição CDN para melhor performance
2. **Certificado SSL**: Usar um domínio customizado com HTTPS
3. **Backup**: Configurar replicação de bucket
4. **Logging**: Habilitar logs de acesso do S3

## 📚 Referências

- [AWS S3 Website Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Terraform AWS S3 Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)
