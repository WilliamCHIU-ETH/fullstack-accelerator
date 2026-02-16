import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gamePath = resolve(__dirname, '..', 'my-work', 'game.js');

function runGame(inputs) {
  return new Promise((resolve) => {
    const child = spawn('node', [gamePath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', () => {
      resolve({ stdout, stderr });
    });

    const input = inputs.join('\n') + '\n';
    child.stdin.write(input);
    child.stdin.end();

    setTimeout(() => child.kill(), 8000);
  });
}

describe('W0 猜數字遊戲 — 延伸挑戰', () => {
  it('支援至少兩種難度等級', async () => {
    const result = await runGame(['1', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', 'n']);
    assert.ok(
      result.stdout.includes('簡單') || result.stdout.includes('普通') || result.stdout.includes('困難') || result.stdout.includes('難度'),
      '應該顯示難度選擇選項'
    );
  });

  it('不同難度有不同的數字範圍或猜測次數', async () => {
    const easyResult = await runGame(['1', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', 'n']);
    const hardResult = await runGame(['3', '50', '50', '50', '50', '50', '50', '50', 'n']);

    const hasEasyConfig = easyResult.stdout.includes('1-50') || easyResult.stdout.includes('10 次');
    const hasHardConfig = hardResult.stdout.includes('1-200') || hardResult.stdout.includes('困難');

    assert.ok(
      hasEasyConfig || hasHardConfig,
      '不同難度應該有不同的設定'
    );
  });

  it('遊戲結束後可以選擇再玩一局', async () => {
    const inputs = ['2'];
    for (let i = 0; i < 7; i++) inputs.push('50');
    inputs.push('y');
    inputs.push('2');
    for (let i = 0; i < 7; i++) inputs.push('50');
    inputs.push('n');

    const result = await runGame(inputs);
    assert.ok(
      result.stdout.includes('再玩') || result.stdout.includes('統計') || result.stdout.includes('勝率'),
      '遊戲結束後應該能選擇再玩一局'
    );
  });
});
