#!/bin/bash
set -euo pipefail

echo "==> perch. website build"

# Minify CSS (basic — remove comments and extra whitespace)
if command -v npx &> /dev/null && npx --yes csso-cli 2>/dev/null; then
  echo "==> Minifying style.css..."
  npx csso public/style.css --output public/style.min.css
  mv public/style.min.css public/style.css
  echo "     done ($(wc -c < public/style.css) bytes)"
else
  echo "==> Skipping CSS minification (csso-cli not available)"
fi

# Copy favicon/apple-touch if missing
[ -f public/favicon.svg ] || cp public/favicon.svg public/apple-touch-icon.png 2>/dev/null || true

echo "==> Build complete"
