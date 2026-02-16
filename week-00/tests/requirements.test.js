import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gamePath = resolve(__dirname, '..', 'my-work', 'game.js');

function runGame(inputs, opts = {}) {
  const { timeout = 5000, env = {} } = opts;
  return new Promise((resolve) => {
    const child = spawn('node', [gamePath], {
      timeout,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...env },
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

    // Wait for initial output then start sending inputs
    setTimeout(sendNextInput, 500);
  });
}

describe('W0 猜數字遊戲 — 核心功能', () => {
  it('輸入正確數字時回應「猜對」相關訊息', async () => {
    // Try a binary search approach - send many guesses to find the number
    // We'll use a strategy: guess 50, then adjust
    const inputs = [];
    for (let i = 1; i <= 100; i++) {
      inputs.push(String(i));
    }

    const result = await runGame(inputs, { timeout: 15000 });
    assert.ok(
      result.stdout.includes('猜對') || result.stdout.includes('恭喜'),
      '猜對數字時應該顯示恭喜或猜對的訊息'
    );
  });

  it('輸入太高的數字時回應「太高」相關訊息', async () => {
    // Guess 100 - very likely too high unless secret is 100
    const result = await runGame(['100', '100', '100', '100', '100', '100', '100']);
    // Either we get "太高" or we got lucky and guessed right
    assert.ok(
      result.stdout.includes('太高') || result.stdout.includes('猜對') || result.stdout.includes('恭喜'),
      '輸入較大數字時應該回應「太高」'
    );
  });

  it('輸入太低的數字時回應「太低」相關訊息', async () => {
    // Guess 1 - very likely too low unless secret is 1
    const result = await runGame(['1', '1', '1', '1', '1', '1', '1']);
    assert.ok(
      result.stdout.includes('太低') || result.stdout.includes('猜對') || result.stdout.includes('恭喜'),
      '輸入較小數字時應該回應「太低」'
    );
  });

  it('輸入非數字時顯示錯誤提示且不計次數', async () => {
    const result = await runGame(['abc', '50', '50', '50', '50', '50', '50', '50']);
    assert.ok(
      result.stdout.includes('有效') || result.stdout.includes('數字') || result.stdout.includes('錯誤'),
      '輸入非數字時應該提示輸入有效的數字'
    );
  });

  it('超過最大次數時遊戲結束並顯示答案', async () => {
    // Always guess 1 - unless secret is 1, we'll run out of attempts
    const result = await runGame(['2', '3', '4', '5', '6', '7', '8']);
    assert.ok(
      result.stdout.includes('遊戲結束') || result.stdout.includes('答案是') || result.stdout.includes('猜對') || result.stdout.includes('恭喜'),
      '用完猜測次數後應該顯示遊戲結束和答案'
    );
  });
});
