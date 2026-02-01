#!/bin/bash

# Build script for rusty-deno native libraries
# Usage: ./build.sh [-v] [-c] [-h]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
TARGET="x86_64-unknown-linux-gnu"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LIB_DIR="$PROJECT_ROOT/lib"

# Default options
VERBOSE=false
CLEAN=false

# Parse arguments
while getopts "vch" opt; do
  case $opt in
    v)
      VERBOSE=true
      ;;
    c)
      CLEAN=true
      ;;
    h)
      echo "Usage: $0 [-v] [-c] [-h]"
      echo "  -v  Verbose output"
      echo "  -c  Clean build artifacts"
      echo "  -h  Show this help message"
      exit 0
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# Function to print messages
log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Clean build artifacts
if [ "$CLEAN" = true ]; then
  log_info "Cleaning build artifacts..."
  cd "$SCRIPT_DIR"
  cargo clean
  rm -rf "$LIB_DIR"
  log_info "Clean complete."
  exit 0
fi

# Check for Rust toolchain
if ! command -v cargo &> /dev/null; then
  log_error "Cargo not found. Please install Rust: https://rustup.rs/"
  exit 1
fi

if [ "$VERBOSE" = true ]; then
  log_info "Rust version: $(rustc --version)"
  log_info "Cargo version: $(cargo --version)"
fi

# Ensure target is installed
if ! rustup target list --installed | grep -q "$TARGET"; then
  log_warn "Target $TARGET not installed. Installing..."
  rustup target add "$TARGET"
fi

# Build the library
log_info "Building native libraries for $TARGET..."
cd "$SCRIPT_DIR"

if [ "$VERBOSE" = true ]; then
  cargo build --release --target "$TARGET"
else
  cargo build --release --target "$TARGET" --quiet
fi

# Create lib directory
mkdir -p "$LIB_DIR"

# Copy the built library
BUILT_LIB="$SCRIPT_DIR/target/$TARGET/release/libsourcya_rusty_deno_hello.so"

if [ ! -f "$BUILT_LIB" ]; then
  log_error "Built library not found at $BUILT_LIB"
  exit 1
fi

cp "$BUILT_LIB" "$LIB_DIR/"

log_info "Build complete!"
log_info "Library copied to: $LIB_DIR/libsourcya_rusty_deno_hello.so"

if [ "$VERBOSE" = true ]; then
  log_info "Library size: $(du -h "$LIB_DIR/libsourcya_rusty_deno_hello.so" | cut -f1)"
fi
