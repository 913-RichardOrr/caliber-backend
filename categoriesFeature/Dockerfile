FROM public.ecr.aws/lambda/nodejs:14

COPY ./categoriesFeature/CategoriesHelpers.ts ./categoriesFeature/CategoriesLambda.ts package.json tsconfig.json /var/task/

ARG USER
ARG HOST
ARG PASSWORD
ARG DATABASE

ENV PGUSER=${USER}
ENV PGHOST=${HOST}
ENV PGPASSWORD=${PASSWORD}
ENV PGDATABASE=${DATABASE}

RUN npm install

RUN npx tsc

RUN ls

CMD ["CategoriesLambda.handler"]