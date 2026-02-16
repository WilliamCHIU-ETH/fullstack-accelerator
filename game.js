import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const secret = Math.floor(Math.random() * 100) + 1;
const maxAttempts = 7;
let attempts = 0;

console.log('歡迎來到猜數字遊戲！');
console.log('我想了一個 1 到 100 之間的數字。');
console.log(`你有 ${maxAttempts} 次機會，祝你好運！`);

function askGuess() {
  const remaining = maxAttempts - attempts;
  rl.question(`\n剩餘次數：${remaining} | 請猜一個數字：`, (answer) => {
    const guess = Number(answer);

    if (isNaN(guess) || answer.trim() === '') {
      console.log('⚠️  請輸入有效的數字！');
      askGuess();
      return;
    }

    if (guess < 1 || guess > 100) {
      console.log('⚠️  請輸入 1 到 100 之間的數字！');
      askGuess();
      return;
    }

    attempts++;

    if (guess === secret) {
      console.log(`\n🎉 恭喜！你用了 ${attempts} 次猜對了！答案就是 ${secret}！`);
      rl.close();
    } else if (attempts >= maxAttempts) {
      console.log(guess > secret ? '太高了！' : '太低了！');
      console.log(`\n💀 遊戲結束！你已經用完 ${maxAttempts} 次機會。答案是 ${secret}。`);
      rl.close();
    } else if (guess > secret) {
      console.log('太高了！');
      askGuess();
    } else {
      console.log('太低了！');
      askGuess();
    }
  });
}

askGuess();
