import { describe, it } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gamePath = resolve(__dirname, '..', 'my-work', 'game.js');

describe('W0 猜數字遊戲 — Smoke Tests', () => {
  it('game.js 檔案存在', () => {
    assert.ok(existsSync(gamePath), 'my-work/game.js 不存在。請先建立你的遊戲檔案。');
  });

  it('可以用 node game.js 啟動不報錯', async () => {
    const result = await new Promise((resolve, reject) => {
      const child = spawn('node', [gamePath], {
        timeout: 5000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stderr = '';
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Send some input then close to let it exit
      setTimeout(() => {
        child.stdin.write('test\n');
        setTimeout(() => {
          child.kill();
          resolve({ stderr });
        }, 1000);
      }, 500);
    });

    assert.strictEqual(
      result.stderr,
      '',
      `game.js 啟動時有錯誤：${result.stderr}`
    );
  });
});
