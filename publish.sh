#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BUILD_TEMP_DIR=$(mktemp -d)
GIT_ORIGIN=$(git config --get remote.origin.url)

echo "BUILD_TEMP_DIR: ${BUILD_TEMP_DIR}"

git clone --branch gh-pages --depth 1 "${GIT_ORIGIN}" "${BUILD_TEMP_DIR}/git"
rm -rf "${BUILD_TEMP_DIR}/git/*"
cp -R ${DIR}/build/* "${BUILD_TEMP_DIR}/git"

cd "${BUILD_TEMP_DIR}/git"
git add .
git commit -m "publish $(date)"
git push

rm -rf "${BUILD_TEMP_DIR}"
