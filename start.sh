#!/bin/sh
set -ex

npx prisma migrate deploy && exec node server.js
