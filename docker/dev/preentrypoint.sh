#!/bin/sh
set -e
eval $(fixuid -q)
# UID/GID now match user/group, $HOME has been set to user’s home directory
