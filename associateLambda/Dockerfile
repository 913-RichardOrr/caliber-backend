# Retrieiving a public image from Amazon's Elastic Container Registry
FROM public.ecr.aws/lambda/nodejs:12
# also available from amazon/aws-lambda-nodejs:12 on docker hub

# The Lambda base image expects your code to be placed in the /var/task/ folder
COPY *.ts ../package.json ../tsconfig.json /var/task/

#ENV: will need details for accessing database

# Install npm dependencies
RUN npm install
# Transpile
RUN npx tsc

# check to see my file exists
RUN ls

# Tell lambda what to call
CMD ["associateLambda.handler"]