#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BUILD_TEMP_DIR=$(mktemp -d)
GIT_ORIGIN=$(git config --get remote.origin.url)

echo "BUILD_TEMP_DIR: ${BUILD_TEMP_DIR}"

cp -R "${DIR}/build/" "${BUILD_TEMP_DIR}/build"

git clone --branch gh-pages --depth 1 "${GIT_ORIGIN}" git
cd "${BUILD_TEMP_DIR}"

ls -la

rm -rf "${BUILD_TEMP_DIR}"
