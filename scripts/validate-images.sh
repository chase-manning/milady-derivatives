#!/bin/bash

echo "🔍 Checking image file sizes..."

# Initialize variables
total_size=0
file_count=0
has_errors=false

# Find all image files and check their sizes
while IFS= read -r -d '' file; do
  # Get file size in bytes
  size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
  
  # Convert to KB for comparison
  size_kb=$((size / 1024))
  total_size=$((total_size + size))
  file_count=$((file_count + 1))
  
  # Check if file is over 500KB
  if [ $size_kb -gt 500 ]; then
    echo "❌ ERROR: $file is ${size_kb}KB (over 500KB limit)"
    has_errors=true
  else
    echo "✅ $file: ${size_kb}KB"
  fi
done < <(find public/api/images -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.avif" -o -name "*.gif" -o -name "*.svg" \) -print0)

if [ "$has_errors" = true ]; then
  echo "❌ Image validation failed! Some files are over 500KB limit."
  exit 1
else
  echo "🎉 All images are under 500KB limit!"
  echo "📊 Total images checked: $file_count"
  echo "📊 Total size: $((total_size / 1024))KB"
fi
