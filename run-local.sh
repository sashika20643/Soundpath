#!/bin/bash

# Sonic Paths - Local Development Runner
# This script starts the development environment

echo "🎵 Starting Sonic Paths Local Development Environment"
echo "=================================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please run: node setup-local.js"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🚀 Starting development server..."
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

npm run dev