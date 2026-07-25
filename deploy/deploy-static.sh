#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target_dir="/home/maxlin/Websites/www/tools"

cd "$project_dir"
npm run typecheck
npm run build
mkdir -p "$target_dir"
rsync -a --delete "$project_dir/out/" "$target_dir/"
