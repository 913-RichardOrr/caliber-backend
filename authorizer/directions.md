## creating docker image
docker build -t name .

docker run name:latest

## push docker image to aws
aws configure

enter access key id
enter secret access key

aws sts get-caller-identity

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123.dkr.ecr.us-east-1.amazonaws.com

docker tag authorizer:latest 123.dkr.ecr.us-east-1.amazonaws.com/authorizer:latest

docker push 123.dkr.ecr.us-east-1.amazonaws.com/authorizer:latest


## create a lambda function
aws cloudformation deploy --template-file filename.yaml --stack-name namestack

aws delete-stack --stack-name namestack