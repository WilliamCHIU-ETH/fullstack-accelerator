import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('歡迎來到猜數字遊戲！');

rl.question('請輸入你的名字：', (name) => {
  console.log(`哈囉，${name}！遊戲即將開始...`);
  rl.close();
});
