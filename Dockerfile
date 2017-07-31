FROM amazonlinux:latest

RUN yum install -y nginx && \
    touch /var/log/nginx/access.log

COPY unicorn_command /usr/share/nginx/html/

EXPOSE 80

COPY ./docker-entrypoint.sh /
RUN ["chmod", "+x", "/docker-entrypoint.sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
