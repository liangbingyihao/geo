#!/usr/bin/env bash
# Rebuild the self-contained map data in public/geo/.
#
# Source: Natural Earth 1:50m vector data (public domain)
#   https://www.naturalearthdata.com/
#   https://github.com/nvkelso/natural-earth-vector
#
# Requires: curl, npx (mapshaper is downloaded on demand)
set -euo pipefail

cd "$(dirname "$0")/.."

BASE="https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p public/geo

echo "Downloading Natural Earth 1:50m data..."
curl -fsSL "$BASE/ne_50m_land.geojson" -o "$TMP/land.geojson"
curl -fsSL "$BASE/ne_50m_lakes.geojson" -o "$TMP/lakes.geojson"
curl -fsSL "$BASE/ne_50m_rivers_lake_centerlines.geojson" -o "$TMP/rivers.geojson"

# Clip to the biblical world (lon -12..52, lat 8..58) and simplify.
echo "Clipping and simplifying..."
npx --yes mapshaper "$TMP/land.geojson" \
  -clip bbox=-12,8,52,58 -simplify 50% keep-shapes \
  -o format=geojson precision=0.01 public/geo/land.json

npx --yes mapshaper "$TMP/lakes.geojson" \
  -clip bbox=-12,8,52,58 -simplify 50% keep-shapes \
  -o format=geojson precision=0.01 public/geo/lakes.json

npx --yes mapshaper "$TMP/rivers.geojson" \
  -clip bbox=-12,8,52,58 -simplify 50% \
  -o format=geojson precision=0.01 public/geo/rivers.json

echo "Done:"
ls -lh public/geo/
