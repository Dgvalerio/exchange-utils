#!/bin/bash

cd ..

superMigrate() {
  echo "==> $1"

  docker exec "$1" yarn typeorm migration:run

  cd ..
  echo ''
}

superMigrate 'exc-ms-audit-container'

superMigrate 'exc-ms-user-container'

superMigrate 'exc-ms-admin-container'

superMigrate 'exc-ms-eur-container'

superMigrate 'exc-ms-transactions-container'

superMigrate 'exc-ms-crypto-container'

