#!/bin/bash

echo "🎮 Starting RPG Multiplayer Game..."
echo "📁 Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the newgame directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🚀 Starting development server..."
echo "🌐 Game will be available at: http://localhost:3000 (or next available port)"
echo "🔥 Hot reload enabled - changes will update automatically"
echo ""
echo "Controls:"
echo "  WASD or Arrow Keys - Move player"
echo "  Multiple browser tabs - Test multiplayer"
echo ""

npm run dev