#!/bin/bash

cd ..

superUpdate() {
  echo "==> $1"
  cd "$1" || exit
  git checkout develop
  git pull
  yarn
  yarn upgrade @lubysoftware/exchange.lib

  if [ "$2" == 'up' ]; then
    docker compose up --build -d
  fi

  cd ..
  echo ''
}

superUpdate 'Exchange.Dev'

superUpdate 'Exchange.MS.User' 'up'

superUpdate 'Exchange.MS.Mail' 'up'

superUpdate 'Exchange.MS.Admin' 'up'

superUpdate 'Exchange.MS.Fiat' 'up'

superUpdate 'Exchange.MS.Crypto' 'up'

superUpdate 'Exchange.MS.Audit' 'up'

superUpdate 'Exchange.MS.Transactions' 'up'

superUpdate 'Exchange.Lib'

superUpdate 'Exchange.Websocket'

superUpdate 'Exchange.App'

superUpdate 'Exchange.Web'

#superUpdate 'Exchange.Admin'
