const questions = [
  "Ты считаешь себя добрым человеком?",
  "Легко ли тебе доверять людям?",
  "Ты часто злишься без причины?",
  "Любишь ли быть в центре внимания?",
  "Ты способен на ложь ради друга?",
  "Боишься ли одиночества?",
  "Можешь ли прощать предательство?",
  "Ты считаешь себя дисциплинированным?",
  "Скрываешь ли эмоции?",
  "Ты бы помог врагу, если бы он попросил?"
];

const container = document.getElementById("test-container");

questions.forEach((q, index) => {
  const block = document.createElement("div");
  block.classList.add("question");
  block.innerHTML = `
    <p><b>${index + 1}.</b> ${q}</p>
    <div class="options">
      <label><input type="radio" name="q${index}" value="Да"> Да</label>
      <label><input type="radio" name="q${index}" value="Нет"> Нет</label>
      <label>Свой ответ: <input type="text" name="q${index}" placeholder="Введите..."></label>
    </div>
  `;
  container.appendChild(block);
});

document.getElementById("submit-btn").addEventListener("click", async () => {
  const answers = [];

  questions.forEach((_, index) => {
    const radios = document.getElementsByName(`q${index}`);
    let answer = "—";
    radios.forEach(el => {
      if (el.type === "radio" && el.checked) answer = el.value;
      if (el.type === "text" && el.value.trim() !== "") answer = el.value.trim();
    });
    answers.push(answer);
  });

  // Показываем ответы на странице
  const resultText = answers.map((a, i) => `${i + 1}. ${a}`).join("\n");
  document.getElementById("results").textContent = resultText;

  // Сохраняем в файл
  const blob = new Blob([resultText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "answers.txt";
  link.click();

  // Отправляем ответы на API для анализа
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });

    const data = await response.json();

    // Показываем анализ
    const analysisBlock = document.getElementById("analysis");
    if (analysisBlock) {
      analysisBlock.textContent = data.result || "Ошибка анализа";
    }
  } catch (error) {
    console.error("Ошибка связи с сервером:", error);
  }
});
