# Run this Dockerfile from the caliber-backend directory
# using the command:
# docker build -t associatelambda -f associateLambda/Dockerfile
#      --build-arg USER=<username> --build-arg HOST=<host> --build-arg PASSWORD=<password> --build-arg DATABASE=<database> .

# Retrieiving a public image from Amazon's Elastic Container Registry
FROM public.ecr.aws/lambda/nodejs:12
# also available from amazon/aws-lambda-nodejs:12 on docker hub

# The Lambda base image expects your code to be placed in the /var/task/ folder


COPY ./package.json /var/task/
COPY ./tsconfig.json /var/task/
COPY ./*.ts /var/task/

# Install npm dependencies
RUN npm install
# Transpile
RUN npx tsc

# ENV variables for accessing database
ARG USER
ARG HOST
ARG PASSWORD
ARG DATABASE

ENV PGUSER=${USER}
ENV PGHOST=${HOST}
ENV PGPASSWORD=${PASSWORD}
ENV PGDATABASE=${DATABASE}
ENV PGPORT=5432

# check to see my file exists
RUN ls

# Tell lambda what to call
CMD ["WeekCategoriesLambda.handler"]


