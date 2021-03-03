## creat docker image

### build a docker file
`docker build -t <image-name> .`

### build a docker file with environment variables
`docker build -t <image-name> -f <path-to-Dockerfile> --build-arg USER=<pg-user> --build-arg HOST=<pg-host> --build-arg PASSWORD=<pg-password> --build-arg DATABASE=<pg-database> .`

### run a docker file
`docker run <name>:latest`

## push docker image to aws
### log in to aws cli
`aws configure`

enter access key id \
enter secret access key \
enter region 
### confirm logged in
`aws sts get-caller-identity`

### log in to ecr server
`aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com`

### tag a image
`docker tag <image-name>:latest <account>.dkr.ecr.<region>.amazonaws.com/<ecr-repo-name>:latest`

### push docker image to a ecr repository
`docker push <account>.dkr.ecr.<region>.amazonaws.com/<ecr-repo-name>:latest`

## create stacks using cloudFormation
### deploy lambda function
`aws cloudformation deploy --template-file <path-to-file>.yaml --stack-name <stack-name>`

### deploy api gateway
`aws cloudformation deploy --template-file <path-to-file>.yaml --stack-name <stack-name> --capabilities CAPABILITY_IAM`

### describe stack events
`aws cloudformation describe-stack-events --stack-name <stack-name>`

### delete a stack
`aws cloudformation delete-stack --stack-name <stack-name>`

### view all lambda functions
`aws lambda list-functions`