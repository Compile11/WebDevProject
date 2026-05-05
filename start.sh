#!/bin/bash

set -e

cd backend
npm run start &
BACKEND_PID=$!

cd ../frontend
npm run dev &
FRONTEND_PID=$!

if command -v stripe >/dev/null 2>&1; then
  echo "Stripe CLI found. Startin webhook listener..."
  stripe listen --forward-to localhost:5000/api/stripe/webhook > /dev/null &
  STRIPE_PID=$!
else
  echo "Stripe CLI not found. Skipping webhook listener.."
fi

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait


