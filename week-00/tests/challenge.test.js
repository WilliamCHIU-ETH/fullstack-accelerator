import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gamePath = resolve(__dirname, '..', 'my-work', 'game.js');

function runGame(inputs, opts = {}) {
  const { timeout = 5000 } = opts;
  return new Promise((resolve) => {
    const child = spawn('node', [gamePath], {
      timeout,
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

    let inputIndex = 0;

    function sendNextInput() {
      if (inputIndex < inputs.length) {
        const input = inputs[inputIndex];
        inputIndex++;
        setTimeout(() => {
          child.stdin.write(input + '\n');
          sendNextInput();
        }, 300);
      } else {
        setTimeout(() => {
          child.kill();
          resolve({ stdout, stderr });
        }, 500);
      }
    }

    setTimeout(sendNextInput, 500);
  });
}

describe('W0 猜數字遊戲 — 延伸挑戰', () => {
  it('支援至少兩種難度等級', async () => {
    const result = await runGame(['1', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', 'n'], { timeout: 10000 });
    assert.ok(
      result.stdout.includes('簡單') || result.stdout.includes('普通') || result.stdout.includes('困難') || result.stdout.includes('難度'),
      '應該顯示難度選擇選項'
    );
  });

  it('不同難度有不同的數字範圍或猜測次數', async () => {
    // Choose easy mode (1)
    const easyResult = await runGame(['1', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', 'n'], { timeout: 10000 });
    // Choose hard mode (3)
    const hardResult = await runGame(['3', '50', '50', '50', '50', '50', '50', '50', 'n'], { timeout: 10000 });

    const hasEasyConfig = easyResult.stdout.includes('50') || easyResult.stdout.includes('10');
    const hasHardConfig = hardResult.stdout.includes('200') || hardResult.stdout.includes('困難');

    assert.ok(
      hasEasyConfig || hasHardConfig,
      '不同難度應該有不同的設定'
    );
  });

  it('遊戲結束後可以選擇再玩一局', async () => {
    // Play one game then say yes to play again, then no
    const inputs = ['2']; // choose normal difficulty
    // Guess enough times to end the game
    for (let i = 0; i < 8; i++) inputs.push('50');
    inputs.push('y'); // play again
    inputs.push('2'); // choose difficulty again
    for (let i = 0; i < 8; i++) inputs.push('50');
    inputs.push('n'); // quit

    const result = await runGame(inputs, { timeout: 15000 });
    assert.ok(
      result.stdout.includes('再玩') || result.stdout.includes('統計') || result.stdout.includes('勝率'),
      '遊戲結束後應該能選擇再玩一局'
    );
  });
});
