# syntax = docker/dockerfile:1
FROM registry.gitlab.com/systracorp/hq/infra/docker/python-gunicorn-nginx:3.14
USER root
ENV NODE_VERSION=24.15.0 \
    NODE_SHA256=44836872d9aec49f1e6b52a9a922872db9a2b02d235a616a5681b6a85fec8d89 \
    NODE_ENV=development \
    FIXUID_VER=0.6.0 \
    FIXUID_SHA256=8c47f64ec4eec60e79871796ea4097ead919f7fcdedace766da9510b78c5fa14 \
    PYTHONUNBUFFERED=1
ADD https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz node.tar.gz
ADD https://github.com/boxboat/fixuid/releases/download/v$FIXUID_VER/fixuid-$FIXUID_VER-linux-amd64.tar.gz fixuid.tar.gz
RUN echo "$NODE_SHA256 *node.tar.gz" | sha256sum -c - \
 && tar -xzf "node.tar.gz" -C /usr/local --strip-components=1 \
 && rm "node.tar.gz" \
 && npm install -g yarn \
 && echo "$FIXUID_SHA256 *fixuid.tar.gz" | sha256sum -c - \
 && tar -xzf "fixuid.tar.gz" -C /usr/local/bin \
 && rm "fixuid.tar.gz" \
 && mkdir -p /etc/fixuid \
 && printf "user: $USER\n\
group: $USER\n\
paths: \n\
    - /run\n\
    - /var/log/supervisor\n\
    - /etc/supervisor/conf.d\n\
    - /etc/nginx/nginx.conf\n\
    - /etc/nginx/conf.d\n\
    - /home/$USER\n\
    - /home/$USER/.cache/uv\n\
    - /home/$USER/.cache/yarn\n\
    - /opt/cache/pip\n\
    - /app/.venv\n\
    - /app/node_modules\n\
    - /app/back/media\n\
    - /app/back/schedule\n\
" > /etc/fixuid/config.yml \
 && rm /etc/supervisor/conf.d/*.conf \
 && mkdir -p \
  /opt/cache/pip \
  /home/$USER/.cache/uv \
  /home/$USER/.cache/yarn \
 && chown -R $USER: \
  /etc/supervisor/conf.d \
  /etc/nginx/conf.d \
  /etc/nginx/nginx.conf \
  /opt/cache/pip \
  /home/$USER/.cache/uv \
  /home/$USER/.cache/yarn
USER $USER
ENV UV_CACHE_DIR=/home/${USER}/.cache/uv \
    UV_PYTHON=${PYTHON_VERSION} \
    UV_FROZEN=1 \
    UV_NO_SYNC=1 \
    UV_NO_PROGRESS=1 \
    NO_COLOR=1 \
    DJANGO_HOST=0.0.0.0 \
    VITE_HOST=0.0.0.0
RUN mkdir -p \
    /app/.venv \
    /app/node_modules \
    /app/back/{media,schedule}
VOLUME \
    /opt/cache/pip \
    /app/.venv \
    /app/node_modules \
    /app/back/media \
    /app/back/schedule
WORKDIR /app
COPY --chown=$USER: ./pyproject.toml ./uv.lock ./yarn.lock ./package.json .npmr[c] *.md ./
RUN --mount=type=secret,mode=0444,id=GITLAB_TOKEN export GITLAB_TOKEN=$(cat /run/secrets/GITLAB_TOKEN 2>/dev/null) \
 && uv venv \
 && uv sync \
 && yarn install
