#!/usr/bin/env bash

stackName=caliberMobile
roleArn=arn:aws:iam::855430746673:role/caliber-mobile-cf

#import the environment variables from the file
source env.example
echo $PASSWORD
# setting up database  on cloudformation
# aws cloudformation deploy --template-file ./cloudFormation/rds.yaml --stack-name $stackName \
#     --role-arn $roleArn --parameter-overrides DBUsername=$USER DBPassword=$PASSWORD

#associative array of ECR names as keys and dockerfile paths as values
declare -A dockerfileArray
dockerfileArray[AssociatesECR]=./associateLambda/Dockerfile
dockerfileArray[FireBaseECR]=./authorizer/Dockerfile
dockerfileArray[BatchAssociatesECR]=./batchAssociatesLambda/Dockerfile
dockerfileArray[BatchesECR]=./batches/docker/Dockerfile
dockerfileArray[BatchWeekECR]=./batchWeek/lambda/Dockerfile
dockerfileArray[CategoriesECR]=./categoriesFeature/Dockerfile
dockerfileArray[WeekCategoriesECR]=./weekCategories/docker/Dockerfile
echo $dockerfileArray
#loop to build docker images
