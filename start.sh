#!/bin/sh
set -ex

exec bun run db:deploy

exec /sbin/tini -- node server.js