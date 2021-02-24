
FROM public.ecr.aws/lambda/nodejs:14

COPY WeekCategoriesLambda.ts ../package.json ../tsconfig.json /var/task/

ENV PGUSER=calibermobile PGHOST=calibermobile.cvtq9j4axrge.us-east-1.rds.amazonaws.com PGPASSWORD=C3EsJGj6kcRtnAN PGDATABASE=calibermobile PGPORT=5432

RUN npm install

RUN npx tsc

RUN ls

CMD ["build/WeekCategoriesLambda.handler"]