import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const difficulties = {
  '1': { name: '簡單', range: 50, maxAttempts: 10 },
  '2': { name: '普通', range: 100, maxAttempts: 7 },
  '3': { name: '困難', range: 200, maxAttempts: 7 },
};

let totalGames = 0;
let totalWins = 0;

function chooseDifficulty() {
  console.log('\n══════════════════════════════');
  console.log('  🎯 猜數字遊戲');
  console.log('══════════════════════════════');
  console.log('選擇難度：');
  console.log('  1. 簡單（1-50，10 次機會）');
  console.log('  2. 普通（1-100，7 次機會）');
  console.log('  3. 困難（1-200，7 次機會）');
  console.log('══════════════════════════════\n');

  rl.question('請輸入難度（1/2/3）：', (answer) => {
    const diff = difficulties[answer.trim()];
    if (!diff) {
      console.log('⚠️  請輸入 1、2 或 3！');
      chooseDifficulty();
      return;
    }
    playGame(diff);
  });
}

function playGame(difficulty) {
  const { name, range, maxAttempts } = difficulty;
  const secret = Math.floor(Math.random() * range) + 1;
  let attempts = 0;
  const history = [];

  console.log(`\n難度：${name} | 範圍：1-${range} | 機會：${maxAttempts} 次\n`);

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

      if (guess < 1 || guess > range) {
        console.log(`⚠️  請輸入 1 到 ${range} 之間的數字！`);
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
      chooseDifficulty();
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

chooseDifficulty();
