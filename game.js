import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const secret = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

console.log('歡迎來到猜數字遊戲！');
console.log('我想了一個 1 到 100 之間的數字。');

function askGuess() {
  rl.question('請猜一個數字：', (answer) => {
    const guess = Number(answer);
    attempts++;

    if (guess === secret) {
      console.log(`🎉 恭喜！你用了 ${attempts} 次猜對了！`);
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
