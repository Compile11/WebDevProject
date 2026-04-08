#!/bin/bash

set -e

cd backend
npm run start &
BACKEND_PID=$!

cd ../frontend
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
