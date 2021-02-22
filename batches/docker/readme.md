1. make sure that you are in the caliber-backend directory
2. build the docker file
   a. `docker build -f .\batches\docker\Dockerfile -t batches .`
3. deploy the cloud stack
   1. make sure that the IAM role has the `AmazonEC2ContainerRegistryFullAccess` permission.
   2. you should already have the `AWSCloudFormationFullAccess` permission already. 
   3. `aws cloudformation deploy --template-file .\batches\docker\ecr.yaml --stack-name BatchesLambda`
4. add the built docker image to the ECR that was created.
   1. Register Docker with ECR
      1. `aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <accountnumber>.dkr.ecr.<region>.amazonaws.com`
   2. Tag Image for ECR
      1. `docker tag <image>:latest <accountnumber>.dkr.ecr.<region>.amazonaws.com/<image>:latest`
   3. Upload to ECR
      1. `docker push <accountnumber>.dkr.ecr.<region>.amazonaws.com/<image>:latest`
