FROM public.ecr.aws/lambda/nodejs:14

COPY ./categoriesFeature/*.ts package.json tsconfig.json /var/task/

ARG v1
ARG v2
ARG v3
ARG v4

ENV PGUSER=${v1}
ENV PGHOST=${v2}
ENV PGPASSWORD=${v3}
ENV PGDATABASE=${v4}

RUN npm install

RUN npx tsc

RUN ls

CMD ["categoriesLambda.handler"]