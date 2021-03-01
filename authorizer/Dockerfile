#run this file in authorizer folder

# Retrieiving a public image from Amazon's Elastic Container Registry
FROM public.ecr.aws/lambda/nodejs:12
# also available from amazon/aws-lambda-nodejs:12 on docker hub

# The Lambda base image expects your code to be placed in the /var/task/ folder
COPY tsconfig.json authorizerHelper.ts authorizerHandler.ts firebase.json /var/task/

# Install npm dependencies
RUN npm init -y
RUN npm install firebase-admin typescript
# Transpile
RUN npx tsc

# check to see my file exists
RUN ls

# Tell lambda what to call
CMD ["authorizer.handler"]

