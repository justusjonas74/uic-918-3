#!/usr/bin/env node

const args = process.argv.slice(2);
if (args[0] === 'greet') {
  const name = args[1] || 'World';
  console.log(`Hello, ${name}!`);
}
