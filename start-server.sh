#!/bin/bash

cd /home/z/my-project

while true; do
  echo "Starting server at $(date)"
  DATABASE_URL="postgresql://postgres.gtvzgfifbfymsdkvejin:!KCBF8c2HFr,9X3@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require" \
    bun next dev -H 0.0.0.0 -p 3000 >> /tmp/dev-restart.log 2>&1

  echo "Server stopped at $(date), restarting in 5 seconds..."
  sleep 5
done
