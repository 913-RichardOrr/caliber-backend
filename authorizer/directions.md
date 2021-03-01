## creating docker image
docker build -t firebaselambda .

docker run firebaselambda:latest

## push docker image to aws
aws configure

enter access key id
enter secret access key
enter region

aws sts get-caller-identity

aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123.dkr.ecr.us-west-2.amazonaws.com

docker tag firebaselambda:latest 123.dkr.ecr.us-west-2.amazonaws.com/firebase-lambda:latest

docker push 123.dkr.ecr.us-west-2.amazonaws.com/firebase-lambda:latest


## create a lambda function
aws cloudformation deploy --template-file authorizer.yaml --stack-name firebaselambda

aws cloudformation delete-stack --stack-name firebaselambda

## deploy api gateway
aws cloudformation deploy --template-file authorizer/gatewayTestAuthorizer.yaml --stack-name calibermobile-apigateway

aws cloudformation describe-stack-events --stack-name calibermobile-apigateway

aws cloudformation delete-stack --stack-name calibermobile-apigateway