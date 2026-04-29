# syntax = docker/dockerfile:1
FROM registry.gitlab.com/systracorp/hq/infra/docker/python-gunicorn-nginx:3.14 AS base
LABEL maintainer="Cyrille Pontvieux <cpontvieux@systra.com>"
EXPOSE 80
USER root
# Install system dependencies
# https://docs.gunicorn.org/en/stable/design.html
# https://gitlab.com/systracorp/hq/infra/docker/-/blob/master/python-gunicorn-nginx/3.14/gunicorn-conf.py
ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    GUNICORN_CHDIR=/var/www/myapp/back \
    GUNICORN_WSGI_FILE=./wsgi.py \
    CI=1
ARG POSTGRES_VER=17
RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y \
        ca-certificates \
        curl \
        git \
        gnupg \
        sqlite3 \
        zstd \
 && install -d /usr/share/postgresql-common/pgdg \
 && curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc -s https://www.postgresql.org/media/keys/ACCC4CF8.asc \
 && . /etc/os-release \
 && echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $VERSION_CODENAME-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
 && apt-get update \
 && apt-get install -y postgresql-client-$POSTGRES_VER \
 && apt-get clean -y
# Transparent ssh connections
RUN mkdir -p ~user/.ssh /var/www/myapp \
 && echo '\
Host *\n\
    UserKnownHostsFile /dev/null\n\
    StrictHostKeyChecking no\n\
' > ~user/.ssh/config \
 && chown -R user: ~user /var/www/myapp
WORKDIR /var/www/myapp
ENV PIP_CACHE_DIR=/var/www/myapp/.cache/pip \
    UV_CACHE_DIR=/var/www/myapp/.cache/uv
# prepare volume mount permissions
RUN mkdir -p $PIP_CACHE_DIR $UV_CACHE_DIR \
 && chmod a+w $PIP_CACHE_DIR/. $UV_CACHE_DIR/. \
 && chown -R user: $PIP_CACHE_DIR $UV_CACHE_DIR
ARG VER
RUN /usr/local/bin/update-os
RUN mkdir -p media \
 && chown user: media
# switch to regular user
USER user
ENV HOME=/home/user
COPY --chown=user: ./pyproject.toml ./uv.lock ./
ENV UV_PYTHON=${PYTHON_VERSION} \
    UV_FROZEN=1 \
    UV_NO_SYNC=1 \
    UV_NO_PROGRESS=1 \
    NO_COLOR=1
RUN uv venv \
 && uv sync --no-default-groups \
 && uv pip install 'gunicorn[gevent]'

########################################
FROM node:24-alpine AS jsbuild
RUN apk add jq gettext
ENV YARN_CACHE_FOLDER=/tmp/yarn-cache \
    YARN_IGNORE_ENGINES=1
RUN mkdir -p /app $YARN_CACHE_FOLDER \
 && chmod a+w $YARN_CACHE_FOLDER/. \
 && chown -R node: /app $YARN_CACHE_FOLDER
WORKDIR /app
USER node
COPY --chown=node: package.json yarn.lock .npmr[c] ./
RUN --mount=type=secret,mode=0444,id=GITLAB_TOKEN export GITLAB_TOKEN=$(cat /run/secrets/GITLAB_TOKEN 2>/dev/null) \
 && yarn install
COPY --chown=node: ./ ./
#check=skip=SecretsUsedInArgOrEnv
ENV GITLAB_TOKEN=XXX \
    MAPBOX_PUBLIC_KEY='###MAPBOX_PUBLIC_KEY###' \
    NO_COLOR=true
RUN yarn run build

########################################
FROM base AS final
LABEL maintainer="Cyrille Pontvieux <cpontvieux@systra.com>"
EXPOSE 80
# entrypoint (/app/prestart.sh for this base image) and health checker
COPY --chown=root: docker/prestart.sh /app/
COPY --chown=root: docker/nginx-server.conf /app/
COPY --chown=root: docker/docker-healthcheck /
HEALTHCHECK --interval=60s --timeout=10s --retries=5 --start-period=180s CMD ["/docker-healthcheck"]
ARG VER
LABEL version=$VER
COPY --chown=user: \
     --exclude=docker* \
     --exclude=docs \
     --exclude=back/tests \
     --exclude=front/.scripts \
     --exclude=front/src \
     --exclude=front/static \
     --exclude=front/tests \
     --exclude=front/*.*js \
     ./ ./
COPY --chown=user: --from=jsbuild /app/front/dist ./front/dist
COPY --chown=user: --from=jsbuild /app/front/vite.manifest.json ./front/
VOLUME /var/www/myapp/back/db
VOLUME /var/www/myapp/back/media
RUN echo "*** Django Quick Check" \
 && uv run ./back/manage.py check \
 && echo "*** Django Collect Static" \
 && uv run ./back/manage.py collectstatic --clear --noinput -v 0 \
 && rm -rf front/dist
