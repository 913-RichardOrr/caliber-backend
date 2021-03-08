
# Initial Step
To start, make sure you are in root directory. Also make sure to ask product owner for database password if you will not be creating a new database instance.

# Deploy RDS Template if starting with a new DB instance
`aws cloudformation deploy --template-file ./cloudFormation/rds.yaml --stack-name <stack-name> --role-arn arn:aws:iam::855430746673:role/caliber-mobile-cf --parameter-overrides DBUsername=<db-name> DBPassword=<db-password>`

# Containerize Lambdas with Docker
## Paths for files needed for Docker
* ./associateLambda/Dockerfile
  * Use `AssociatesECR` for ECR repo name
* ./authorizer/Dockerfile
  * Use `FireBaseECR` for ECR repo name
* ./batchAssociatesLambda/Dockerfile
  * Use `BatchAssociatesECR` for ECR repo name
* ./batches/docker/Dockerfile
  * Use `BatchesECR` for ECR repo name
* ./batchWeek/lambda/Dockerfile
  * Use `BatchWeekECR` for ECR repo name
* ./categoriesFeature/Dockerfile
  * Use `CategoriesECR` for ECR repo name
* ./weekCategories/docker/Dockerfile
  * Use `WeekCategoriesECR` for ECR repo name

## Build each Docker file with environment variables (paths listed above)
`Docker build -t <image-name> -f <path-to-Dockerfile> --build-arg USER=<pg-user> --build-arg HOST=<pg-host> --build-arg PASSWORD=<pg-password> --build-arg DATABASE=<pg-database> .`

## Push Docker images to AWS
* log in to aws cli
* `aws configure`

## Enter the user credentials of your AWS account
* Enter access key id
* Enter secret access key
* Enter region

## Confirm  the logged in user
* `aws sts get-caller-identity`

## Log in to Elastic Container Registry server
* `aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com`

## Tag the images to their respective ECR repositories (names listed above)
* `docker tag <image-name>:latest <account>.dkr.ecr.<region>.amazonaws.com/<ecr-repo-name>:latest`

## Push the Docker images to their respective ECR repositories
* `docker push <account>.dkr.ecr.<region>.amazonaws.com/<ecr-repo-name>:latest`

# Deploy Lambda functions
## Paths for files needed for Lambda CloudFormation Templates
* ./associateLambda/associateLambda.yaml
* ./authorizer/authorizer.yaml
* ./batchAssociatesLambda/batchAssociatesLambda.yaml
* ./batches/cloudFormation/batches.yaml
* ./batchWeek/lambda.yaml
* ./categoriesFeature/categoriesLambda.yaml
* ./weekCategories/cloudFormation/qcweekCaetgories.yaml

## Create lambda stacks using CloudFormation (with paths listed above)
* `aws cloudformation deploy --template-file <path-to-file>.yaml --stack-name <stack-name>`

# Deploy API Gateway
* `aws cloudformation deploy --template-file ./cloudFormation/apigateway.yaml --stack-name <stack-name>`

## Deploy the Invoke Template to give API Gateway permission to use Lambdas
* `aws cloudformation deploy --template-file ./cloudFormation/invoke.yaml --stack-name <stack-name> --capabilities CAPABILITY_IAM`