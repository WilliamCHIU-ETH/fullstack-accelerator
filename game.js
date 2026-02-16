import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const secret = Math.floor(Math.random() * 100) + 1;

console.log('歡迎來到猜數字遊戲！');
console.log('我想了一個 1 到 100 之間的數字。');

rl.question('請猜一個數字：', (answer) => {
  const guess = Number(answer);

  if (guess === secret) {
    console.log('🎉 恭喜你猜對了！');
  } else if (guess > secret) {
    console.log('太高了！');
  } else {
    console.log('太低了！');
  }

  console.log(`答案是 ${secret}。`);
  rl.close();
});
