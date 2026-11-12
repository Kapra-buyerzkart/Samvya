#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PHASE_BASELINE_BYTES = 3098586; // Previous phase bundle size (3.09 MB)
const MAX_PHASE_GROWTH_BYTES = 150 * 1024; // +150 KB per phase budget limit
const MAX_ALLOWED_BYTES = PHASE_BASELINE_BYTES + MAX_PHASE_GROWTH_BYTES;
const OUT_DIR = path.join(__dirname, '..', '.build', 'bundle-check');

console.log('--- Size Budget Verification ---');
console.log(`Phase Baseline: ${PHASE_BASELINE_BYTES.toLocaleString()} bytes`);
console.log(`Phase Budget Limit: +${MAX_PHASE_GROWTH_BYTES.toLocaleString()} bytes (+150 KB)`);
console.log(`Maximum Allowed: ${MAX_ALLOWED_BYTES.toLocaleString()} bytes\n`);

try {
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  }

  console.log('Exporting release JS bundle...');
  execSync(`npx expo export --platform ios --output-dir "${OUT_DIR}"`, {
    stdio: 'pipe',
  });

  const jsDir = path.join(OUT_DIR, '_expo', 'static', 'js', 'ios');
  if (!fs.existsSync(jsDir)) {
    throw new Error(`Export bundle directory not found at ${jsDir}`);
  }

  const files = fs.readdirSync(jsDir).filter((f) => f.endsWith('.hbc') || f.endsWith('.js'));
  if (files.length === 0) {
    throw new Error('No bundle output found in export directory');
  }

  const bundleFile = path.join(jsDir, files[0]);
  const stats = fs.statSync(bundleFile);
  const currentBytes = stats.size;
  const deltaBytes = currentBytes - PHASE_BASELINE_BYTES;

  console.log(`Current Production Bundle: ${currentBytes.toLocaleString()} bytes (${(currentBytes / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`Size Delta from Phase Baseline: ${deltaBytes >= 0 ? '+' : ''}${deltaBytes.toLocaleString()} bytes (${(deltaBytes / 1024).toFixed(1)} KB)`);

  if (currentBytes > MAX_ALLOWED_BYTES) {
    const excess = currentBytes - MAX_ALLOWED_BYTES;
    console.error(`\n❌ ERROR: JS Bundle budget exceeded by ${excess.toLocaleString()} bytes!`);
    process.exit(1);
  }

  console.log('✅ Bundle size is within budget threshold.');
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  process.exit(0);
} catch (error) {
  console.error('\n❌ Bundle budget verification failed:', error.message);
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  }
  process.exit(1);
}
