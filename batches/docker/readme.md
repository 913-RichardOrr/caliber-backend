1. make sure that you are in the caliber-backend directory
2. build the docker file
   a. `docker build -f .\batches\docker\Dockerfile -t batches .`
3. deploy the cloud stack
   1. make sure that the IAM role has the `AmazonEC2ContainerRegistryFullAccess` permission.
   2. you should already have the `AWSCloudFormationFullAccess` permission already. 
   3. `aws cloudformation deploy --template-file .\batches\docker\ecr.yaml --stack-name BatchesLambda`
4. 