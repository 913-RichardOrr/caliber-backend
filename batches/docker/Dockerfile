# Retrieiving a public image from Amazon's Elastic Container Registry
FROM public.ecr.aws/lambda/nodejs:14
RUN pwd
COPY ["batches/axios/nodejs/package.json", "tsconfig.json", "/var/task/"]
COPY ["batches/getBatchesLambda.ts", "/var/task/index.ts"]
RUN npm install
RUN npm install typescript @types/node
RUN npx tsc
RUN ls
CMD ["index.handler"]
