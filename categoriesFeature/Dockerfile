
FROM public.ecr.aws/lambda/nodejs:14

COPY categoriesLambda.ts ../package.json ../tsconfig.json /var/task/

#ENV key=value

RUN npm install

RUN npx tsc

RUN ls

CMD ["categoriesLambda.handler"]