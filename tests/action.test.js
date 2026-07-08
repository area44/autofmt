import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';

const CONFIG_FILE = '.oxfmtrc.json';

describe('autofmt action logic', () => {
  beforeEach(() => {
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
  });

  afterEach(() => {
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
  });

  it('generates config with rules only', () => {
    const rules = JSON.stringify({ semi: true, singleQuote: true });
    execSync(`
      RULES='${rules}'
      CONFIG="{}"
      if [ -n "$RULES" ]; then
        CONFIG="$RULES"
      fi
      if [ "$CONFIG" != "{}" ]; then
        echo "$CONFIG" > ${CONFIG_FILE}
      fi
    `, { shell: 'bash' });

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    expect(config).toEqual({ semi: true, singleQuote: true });
  });

  it('generates config with ignore patterns only', () => {
    const ignore = "dist/**\nbuild/**";
    execSync(`
      IGNORE='${ignore}'
      CONFIG="{}"
      if [ -n "$IGNORE" ]; then
        IGNORE_JSON=$(echo "$IGNORE" | grep -v '^$' | jq -R . | jq -s .)
        CONFIG=$(echo "$CONFIG" | jq --argjson ignores "$IGNORE_JSON" '.ignorePatterns = $ignores')
      fi
      if [ "$CONFIG" != "{}" ]; then
        echo "$CONFIG" > ${CONFIG_FILE}
      fi
    `, { shell: 'bash' });

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    expect(config.ignorePatterns).toEqual(['dist/**', 'build/**']);
  });

  it('generates config with both rules and ignore patterns', () => {
    const rules = JSON.stringify({ semi: true });
    const ignore = "dist/**";
    execSync(`
      RULES='${rules}'
      IGNORE='${ignore}'
      CONFIG="{}"
      if [ -n "$RULES" ]; then
        CONFIG="$RULES"
      fi
      if [ -n "$IGNORE" ]; then
        IGNORE_JSON=$(echo "$IGNORE" | grep -v '^$' | jq -R . | jq -s .)
        CONFIG=$(echo "$CONFIG" | jq --argjson ignores "$IGNORE_JSON" '.ignorePatterns = $ignores')
      fi
      if [ "$CONFIG" != "{}" ]; then
        echo "$CONFIG" > ${CONFIG_FILE}
      fi
    `, { shell: 'bash' });

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    expect(config).toEqual({ semi: true, ignorePatterns: ['dist/**'] });
  });

  it('formats a file using oxfmt', () => {
    const testFile = 'tests/temp_test.js';
    const unformatted = 'function test(){console.log("hello")}';
    fs.writeFileSync(testFile, unformatted);

    try {
      // Use the local oxfmt installed in node_modules
      execSync('npx oxfmt --write ' + testFile);
      const formatted = fs.readFileSync(testFile, 'utf8');
      expect(formatted).not.toBe(unformatted);
      expect(formatted).toContain('function test() {');
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });
});
