let scoreRight = 0;
let scoreWrong = 0;
let questionCounter = 0;
const answers = [];
const label = "time";
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getRandom(min = 3, max = 10) {
  return Math.round(Math.random() * (max - min) + min);
}

async function getQuestion(min, max, maxQuestions = 20) {
  questionCounter++;
  if (questionCounter > maxQuestions) {
    return rl.close();
  } else {
    let a1 = getRandom(min, max);
    let a2 = getRandom(min, max);
    console.log(`
  Вопрос ${questionCounter}`);
    await rl.question(`${a1} x ${a2} = `, (answer) => {
      let answerStat = {
        "Вопрос №": `${questionCounter}`,
        "Вопрос": `${a1} x ${a2}`,
        "Ответ": answer,
        "Верный": `${a1 * a2}`
      };
      let str;
      if (+answer === a1 * a2) {
        str = ["\x1b[32m%s\x1b[0m", "Верно"];
        scoreRight++;
      } else {
        str = ["\x1b[31m%s\x1b[0m", "Не верно"];
        scoreWrong++;
      }
      console.log(...str);
      answerStat["Результат"] = str[1];
      answers.push(answerStat);
      getQuestion(...arguments);
    });
  }
}

function init() {
  let minimum, maximum, timeQuestion, maxQuestions, timer;
  rl.question("Минимальное число (3): ", (min) => {
    minimum = min || 3;
    rl.question("Максимальное число (10): ", (max) => {
      maximum = max || 10;
      rl.question("Время на один вопрос (20c): ", (tq = 20) => {
        timeQuestion = tq || 10;
        rl.question("Количество вопросов (20): ", (mq = 20) => {
          console.time(label);
          maxQuestions = mq || 20;
          timer = maxQuestions * timeQuestion * 1000;
          getQuestion(+minimum, +maximum, +maxQuestions).then(() => {
            setTimeout(() => {
              rl.close();
            }, timer);
          });
        });
      });
    });
  });
}

init();

rl.on("close", function () {

  console.log("");
  if (questionCounter - 1 !== 20) console.log("\x1b[41m%s\x1b[0m", `ВРЕМЯ ВЫШЛО`);
  console.log("\x1b[33m%s\x1b[0m", `Всего вопросов: ${questionCounter - 1}`);
  console.log("\x1b[32m%s\x1b[0m", `Верных ответов: ${scoreRight}`);
  console.log("\x1b[31m%s\x1b[0m", `Неверных: ${scoreWrong}`);
  console.log("");
  console.log("Времени затрачено: ",);
  console.timeEnd(label);
  console.log("");
  console.log("Статистика:");
  console.log("");
  console.table(answers, ["Вопрос №", "Вопрос", "Ответ", "Верный", "Результат"]);
  console.log("");
  rl.question("", (a) => {
    if (a === "close") process.exit(0);
  });
});
