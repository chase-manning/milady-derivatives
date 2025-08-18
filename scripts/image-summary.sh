#!/bin/bash

echo "📊 Top 10 Largest Images:"
echo "========================"

find public/api/images -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.avif" -o -name "*.gif" -o -name "*.svg" \) -exec ls -lh {} \; | sort -k5 -hr | head -10

echo ""
echo "📊 Image Statistics:"
echo "==================="
echo "Total images: $(find public/api/images -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.avif" -o -name "*.gif" -o -name "*.svg" \) | wc -l)"

# Calculate total size
total_bytes=$(find public/api/images -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.avif" -o -name "*.gif" -o -name "*.svg" \) -exec stat -f%z {} \; 2>/dev/null | awk '{sum += $1} END {print sum}')
total_kb=$((total_bytes / 1024))
echo "Total size: ${total_kb}KB"
