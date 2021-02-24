# Retrieiving a public image from Amazon's Elastic Container Registry
FROM public.ecr.aws/lambda/nodejs:14
RUN pwd
COPY ["tsconfig.json", "/var/task/"]
COPY ["batches/getBatchesLambda.ts", "/var/task/index.ts"]
RUN npm init -y
RUN npm install axios typescript @types/node
RUN npx tsc
CMD ["index.handler"]
