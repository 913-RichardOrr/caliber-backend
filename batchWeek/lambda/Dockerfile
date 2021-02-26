# Retrieiving a public image from Amazon's Elastic Container Registry
FROM public.ecr.aws/lambda/nodejs:12
# also available from amazon/aws-lambda-nodejs:12 on docker hub

# The Lambda base image expects your code to be placed in the /var/task/ folder
COPY *.ts package.json tsconfig.json /var/task/

# Install npm dependencies
RUN npm install
# Transpile
RUN npx tsc

ARG USER
ARG HOST
ARG PASSWORD
ARG DATABASE

ENV PGUSER=${USER}
ENV PGHOST=${HOST}
ENV PGPASSWORD=${PASSWORD}
ENV PGDATABASE=${DATABASE}
# check to see my file exists
RUN ls


# Tell lambda what to call
CMD ["index.handler"]