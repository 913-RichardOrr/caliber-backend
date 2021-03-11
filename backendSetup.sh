#!/usr/bin/env bash

stackName=caliberMobile
roleArn=arn:aws:iam::855430746673:role/caliber-mobile-cf

#import the environment variables from the file
source env.example

# setting up database on cloudformation
# aws cloudformation deploy --template-file ./cloudFormation/rds.yaml --stack-name $stackName \
#     --role-arn $roleArn --parameter-overrides DBUsername=$USER DBPassword=$PASSWORD

#create 4 arrays, one for ECR names, dockerfile paths, lambda names, lambda cf files
dockerfilePaths=(./associateLambda/Dockerfile ./authorizer/Dockerfile ./batchAssociatesLambda/Dockerfile \
    ./batches/docker/Dockerfile ./batchWeek/lambda/Dockerfile ./categoriesFeature/Dockerfile \
    ./weekCategories/docker/Dockerfile
)
ecrs=(AssociatesECR FireBaseECR BatchAssociatesECR \
    BatchesECR BatchWeekECR CategoriesECR \
    WeekCategoriesECR
)
imageNames=(associates-lambda firebase-lambda batch-associates-lambda \
    batches-lambda batchweek-lambda categories-lambda \
    weekcategories-lambda
)
lambdaCFPaths=(./associateLambda/associateLambda.yaml ./authorizer/authorizer.yaml ./batchAssociatesLambda/batchAssociatesLambda.yaml \
    ./batches/cloudFormation/batches.yaml ./batchWeek/lambda.yaml ./categoriesFeature/categoriesLambda.yaml \
    ./weekCategories/cloudFormation/qcweekCaetgories.yaml
)
#deploy ECR
aws cloudformation deploy --template-file ./cloudFormation/ecr.yaml --stack-name $stackName --role-arn $roleArn

#loop to build, tag, push docker images and deploy lambdas
for index in "${!dockerfilePaths[@]}"
    do 
        echo "dockerfilePath: ${dockerfilePaths[$index]}"
        echo "ECR name: ${ecrs[$index]}"
        echo "image name: ${imageNames[$index]}"
        echo "lambda CF paths: ${lambdaCFPaths[$index]}"
        docker build -t ${imageNames[$index]} -f ${dockerfilePaths[$index]} --build-arg USER=$USER --build-arg HOST=$HOST --build-arg PASSWORD=$PASSWORD --build-arg DATABASE=$DATABASE .
        aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.$REGION.amazonaws.com
        docker tag ${imageNames[$index]}:latest $ACCOUNT.dkr.ecr.$REGION.amazonaws.com/${ecrs[$index]}:latest
        docker push $ACCOUNT.dkr.ecr.$REGION.amazonaws.com/${ecrs[$index]}:latest
        aws cloudformation deploy --template-file ${lambdaCFPaths[$index]} --stack-name $stackName
    done

#deploy api gateway
aws cloudformation deploy --template-file ./cloudFormation/apigateway.yaml --stack-name $stackName

#deploy invoke template
aws cloudformation deploy --template-file ./cloudFormation/invoke.yaml --stack-name $stackName --capabilities $roleArn
