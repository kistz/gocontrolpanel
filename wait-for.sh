#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

# Wait for Redis to be available on port 6379
until nc -z "$host" 6379; do
  echo "Waiting for Redis at $host:6379..."
  sleep 1
done

exec $cmd