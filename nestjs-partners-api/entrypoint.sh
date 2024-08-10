#!/bin/sh

set -e

echo "Running migrations..."

# Run migration and fixture commands for partner1 and partner2
pnpm migrate:partner1
pnpm migrate:partner2

echo "Running fixture commands..."

# Run fixture command for both partner1 and partner2
pnpm start partner1-fixture
pnpm start partner2-fixture

echo "Starting applications..."

# Start partner1 and partner2 applications sequentially
pnpm start partner1 &
PARTNER1_PID=$!
pnpm start partner2 &
PARTNER2_PID=$!

# Wait for both applications to finish
wait $PARTNER1_PID $PARTNER2_PID

# Keep the container running if needed
exec "$@"
