#!/bin/bash

cd ..

superReset() {
  echo "==> $1"

  docker exec "$1" yarn typeorm schema:drop
  docker exec "$1" yarn typeorm migration:run

  cd ..
  echo ''
}

superReset 'exc-ms-audit-container'

superReset 'exc-ms-user-container'

superReset 'exc-ms-admin-container'

superReset 'exc-ms-eur-container'

superReset 'exc-ms-transactions-container'

superReset 'exc-ms-crypto-container'
