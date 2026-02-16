import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let totalGames = 0;
let totalWins = 0;

function playGame() {
  const secret = Math.floor(Math.random() * 100) + 1;
  const maxAttempts = 7;
  let attempts = 0;
  const history = [];

  console.log('\n══════════════════════════════');
  console.log('  🎯 猜數字遊戲');
  console.log('══════════════════════════════');
  console.log('規則：');
  console.log('  - 我想了一個 1 到 100 之間的數字');
  console.log(`  - 你有 ${maxAttempts} 次機會`);
  console.log('  - 每次猜完我會告訴你太高還是太低');
  console.log('══════════════════════════════\n');

  function askGuess() {
    const remaining = maxAttempts - attempts;

    if (history.length > 0) {
      console.log(`已猜過：${history.join(', ')}`);
    }

    rl.question(`剩餘次數：${remaining} | 請猜一個數字：`, (answer) => {
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
      history.push(guess);

      if (guess === secret) {
        console.log(`\n🎉 恭喜！你用了 ${attempts} 次猜對了！答案就是 ${secret}！`);
        totalGames++;
        totalWins++;
        askPlayAgain();
      } else if (attempts >= maxAttempts) {
        console.log(guess > secret ? '太高了！' : '太低了！');
        console.log(`\n💀 遊戲結束！你已經用完 ${maxAttempts} 次機會。答案是 ${secret}。`);
        totalGames++;
        askPlayAgain();
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
}

function askPlayAgain() {
  rl.question('\n再玩一局？(y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      playGame();
    } else {
      console.log('\n══════════════════════════════');
      console.log('  📊 遊戲統計');
      console.log('══════════════════════════════');
      console.log(`  總共玩了 ${totalGames} 局`);
      console.log(`  贏了 ${totalWins} 局`);
      console.log(`  勝率：${totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0}%`);
      console.log('══════════════════════════════');
      console.log('感謝遊玩！👋\n');
      rl.close();
    }
  });
}

playGame();
