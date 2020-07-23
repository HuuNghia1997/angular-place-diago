FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /
RUN chmod 777 docker-entrypoint.sh

WORKDIR /usr/share/nginx/html
COPY dist/citizens-admin .

ENTRYPOINT [ "/docker-entrypoint.sh" ]
