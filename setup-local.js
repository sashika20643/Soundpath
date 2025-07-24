#!/usr/bin/env node

/**
 * Sonic Paths - Local Development Setup Script
 * Run this script to set up your local development environment
 * 
 * Usage: node setup-local.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎵 Sonic Paths - Local Development Setup\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const requiredVersion = 18;
const currentVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (currentVersion < requiredVersion) {
  console.error(`❌ Node.js version ${requiredVersion}+ required. Current: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if .env file exists
const envPath = '.env';
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating .env file...');
  
  const envTemplate = `# Database Configuration
DATABASE_URL=postgresql://sonic_user:your_password@localhost:5432/sonic_paths
PGHOST=localhost
PGPORT=5432
PGUSER=sonic_user
PGPASSWORD=your_password
PGDATABASE=sonic_paths

# Google Maps API (Optional - for map functionality)
# Get your API key from: https://console.cloud.google.com/
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file with template');
  console.log('⚠️  Please update the database credentials and API keys in .env');
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    console.error('Please run: npm install');
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Instructions
console.log('\n📋 Next Steps:');
console.log('1. Set up PostgreSQL database:');
console.log('   - Install PostgreSQL if not already installed');
console.log('   - Create database: CREATE DATABASE sonic_paths;');
console.log('   - Create user: CREATE USER sonic_user WITH PASSWORD \'your_password\';');
console.log('   - Grant privileges: GRANT ALL PRIVILEGES ON DATABASE sonic_paths TO sonic_user;');
console.log('');
console.log('2. Update .env file with your database credentials');
console.log('');
console.log('3. Run database migration:');
console.log('   npm run db:push');
console.log('');
console.log('4. (Optional) Seed sample data:');
console.log('   npm run db:seed');
console.log('');
console.log('5. Start development server:');
console.log('   npm run dev');
console.log('');
console.log('🌐 Your app will be available at: http://localhost:5173');
console.log('🔗 API will be available at: http://localhost:5000');

console.log('\n✨ Setup complete! Check LOCAL_DEVELOPMENT.md for detailed instructions.');