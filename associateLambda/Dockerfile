# Run this Dockerfile from the caliber-backend directory
# using the command:
# docker build -t associatelambda -f associateLambda/Dockerfile
#      --build-arg PGUSER=<username> PGHOST=<host> PGPASSWORD=<password> PGDATABASE=<database> .

# Retrieiving a public image from Amazon's Elastic Container Registry
FROM public.ecr.aws/lambda/nodejs:12
# also available from amazon/aws-lambda-nodejs:12 on docker hub

# The Lambda base image expects your code to be placed in the /var/task/ folder
COPY package.json tsconfig.json /var/task/
COPY ./associateLambda/*.ts /var/task/

ENV PGUSER=${PGUSER}
ENV PGHOST=${PGHOST}
ENV PGPASSWORD=${PGPASSWORD}
ENV PGDATABASE=${PGDATABASE}
ENV PGPORT=5432

# Install npm dependencies
RUN npm install
# Transpile
RUN npx tsc

# check to see my file exists
RUN ls

# Tell lambda what to call
CMD ["associateLambda.handler"]