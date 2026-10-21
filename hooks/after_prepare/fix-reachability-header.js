#!/usr/bin/env node
// hooks/after_prepare/fix-reachability-header.js

const fs = require('fs');
const path = require('path');

const TARGET_IMPORT = '#import <netinet6/in6.h>';
const SWIFT_HEADER_FROM = [
  '#import "Moodle-Swift.h"',
  '#import "Bodhi_MEDLEARN_UAT-Swift.h"',
];
const SWIFT_HEADER_TO = '#import "BodhiMEDLEARN-Swift.h"';
const EXTENSIONS = new Set(['.m', '.h']);

function findMatchingFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findMatchingFiles(fullPath));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

module.exports = function (context) {
  const iosPlatformRoot = path.join(context.opts.projectRoot, 'platforms', 'ios');
  const candidates = findMatchingFiles(iosPlatformRoot);

  let patchedCount = 0;

  candidates.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes(TARGET_IMPORT)) {
      content = content
        .split('\n')
        .filter((line) => !line.trim().startsWith(TARGET_IMPORT))
        .join('\n');
      changed = true;
    }

    SWIFT_HEADER_FROM.forEach((swiftHeaderFrom) => {
      if (content.includes(swiftHeaderFrom)) {
        content = content.split(swiftHeaderFrom).join(SWIFT_HEADER_TO);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('[fix-reachability-header] patched:', filePath);
      patchedCount++;
    }
  });

  if (patchedCount === 0) {
    console.log('[fix-reachability-header] no files needed patching under platforms/ios');
  } else {
    console.log(`[fix-reachability-header] done, patched ${patchedCount} file(s)`);
  }
};
