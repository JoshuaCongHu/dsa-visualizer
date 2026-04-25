#!/usr/bin/env bash
set -euo pipefail

# Capture lockfile SHA before pulling so we can skip npm install when unchanged.
sha() { sha1sum "$1" 2>/dev/null || shasum "$1"; }
LOCK_BEFORE=$(sha package-lock.json | awk '{print $1}')

git pull

LOCK_AFTER=$(sha package-lock.json | awk '{print $1}')
if [ ! -d node_modules ] || [ "$LOCK_BEFORE" != "$LOCK_AFTER" ]; then
  npm install
fi

npm run build

cp -R build/. ./

echo "Deployed at $(date '+%Y-%m-%d %H:%M:%S %Z')"
