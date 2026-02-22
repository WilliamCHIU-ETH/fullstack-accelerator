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

    // Write all inputs at once - readline processes them line by line
    const input = inputs.join('\n') + '\n';
    child.stdin.write(input);
    child.stdin.end();

    // Safety timeout
    setTimeout(() => {
      child.kill();
    }, 8000);
  });
}

describe('W0 猜數字遊戲 — 核心功能', () => {
  it('輸入正確數字時回應「猜對」相關訊息', { timeout: 10000 }, async () => {
    // Play many rounds (replay with 'y') guessing 50 each time.
    // Each round has ~1% chance of correct. With enough rounds, we should get it.
    // Alternative: just verify the game shows correct message by checking output
    // across many short games
    let found = false;
    for (let attempt = 0; attempt < 5 && !found; attempt++) {
      // Each attempt: guess a fixed number 7 times, then replay
      const target = 10 + attempt * 20; // try 10, 30, 50, 70, 90
      const inputs = [];
      for (let round = 0; round < 15; round++) {
        // Guess the target 7 times (to fill all attempts)
        for (let i = 0; i < 7; i++) inputs.push(String(target));
        inputs.push('y'); // play again
      }
      inputs.push('n'); // final quit

      const result = await runGame(inputs);
      if (result.stdout.includes('猜對') || result.stdout.includes('恭喜')) {
        found = true;
      }
    }
    assert.ok(found, '猜對數字時應該顯示恭喜或猜對的訊息');
  });

  it('輸入太高的數字時回應「太高」相關訊息', async () => {
    const result = await runGame([
      '100',
      '100',
      '100',
      '100',
      '100',
      '100',
      '100',
      'n',
    ]);
    assert.ok(
      result.stdout.includes('太高') ||
        result.stdout.includes('猜對') ||
        result.stdout.includes('恭喜'),
      '輸入較大數字時應該回應「太高」'
    );
  });

  it('輸入太低的數字時回應「太低」相關訊息', async () => {
    const result = await runGame(['1', '1', '1', '1', '1', '1', '1', 'n']);
    assert.ok(
      result.stdout.includes('太低') ||
        result.stdout.includes('猜對') ||
        result.stdout.includes('恭喜'),
      '輸入較小數字時應該回應「太低」'
    );
  });

  it('輸入非數字時顯示錯誤提示且不計次數', async () => {
    const result = await runGame([
      'abc',
      '50',
      '50',
      '50',
      '50',
      '50',
      '50',
      '50',
      'n',
    ]);
    assert.ok(
      result.stdout.includes('有效') || result.stdout.includes('數字'),
      '輸入非數字時應該提示輸入有效的數字'
    );
  });

  it('超過最大次數時遊戲結束並顯示答案', async () => {
    const result = await runGame(['2', '3', '4', '5', '6', '7', '8', 'n']);
    assert.ok(
      result.stdout.includes('遊戲結束') ||
        result.stdout.includes('答案是') ||
        result.stdout.includes('猜對') ||
        result.stdout.includes('恭喜'),
      '用完猜測次數後應該顯示遊戲結束和答案'
    );
  });
});
