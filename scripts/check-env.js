#!/usr/bin/env node

// Environment check script
const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL',
  'OPENAI_API_KEY'
];

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET'
];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: Missing`);
    hasErrors = true;
  } else {
    const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
      ? '***' + value.slice(-4) 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  }
});

console.log('\n🔧 Optional variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  } else {
    const displayValue = varName.includes('SECRET') 
      ? '***' + value.slice(-4) 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  }
});

console.log('\n🌍 Environment:');
console.log(`✅ NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

if (hasErrors) {
  console.log('\n❌ Some required environment variables are missing!');
  console.log('Please check your .env.local file or environment configuration.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
  console.log('🚀 Ready to deploy!');
}