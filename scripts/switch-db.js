#!/usr/bin/env node

// Script to switch between database schemas
const fs = require('fs');
const path = require('path');

const dbType = process.argv[2] || 'postgresql';

const schemas = {
  sqlite: 'prisma/schema.sqlite.prisma',
  postgresql: 'prisma/schema.prisma',
  mysql: 'prisma/schema.mysql.prisma'
};

if (!schemas[dbType]) {
  console.error(`❌ Unknown database type: ${dbType}`);
  console.log('Available types: sqlite, postgresql, mysql');
  process.exit(1);
}

const sourceSchema = schemas[dbType];
const targetSchema = 'prisma/schema.prisma';

if (!fs.existsSync(sourceSchema)) {
  console.error(`❌ Schema file not found: ${sourceSchema}`);
  process.exit(1);
}

try {
  // Copy the schema file
  fs.copyFileSync(sourceSchema, targetSchema);
  console.log(`✅ Switched to ${dbType} schema`);
  
  // Update package.json scripts if needed
  if (dbType === 'sqlite') {
    console.log('📝 Using SQLite for development');
    console.log('Run: npm run db:generate && npm run db:push');
  } else {
    console.log(`📝 Using ${dbType} for production`);
    console.log('Run: npm run db:generate && npm run db:push');
  }
  
} catch (error) {
  console.error('❌ Error switching schema:', error.message);
  process.exit(1);
}