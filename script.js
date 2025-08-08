// ====== Tea Game Script with OpenRouter AI integration ======

// PAGES / ELEMENTS
const pageQuestions = document.getElementById('page-questions');
const pageInput = document.getElementById('page-input');
const pageReview = document.getElementById('page-review');
const pageSip = document.getElementById('page-sip');
const pageRating = document.getElementById('page-rating');

const startSliders = document.getElementById('startSliders');

// Question inputs
const userNameEl = document.getElementById('userName');
const teaTypeEl = document.getElementById('teaType');
const milkChoiceEl = document.getElementById('milkChoice');
const spiceEl = document.getElementById('spice');
const brewTimeEl = document.getElementById('brewTime');

// Sliders
const sugarEl = document.getElementById('sugar');
const teaEl = document.getElementById('tea');
const waterEl = document.getElementById('water');
const milkEl = document.getElementById('milk');

const sugarVal = document.getElementById('sugarVal');
const teaVal = document.getElementById('teaVal');
const waterVal = document.getElementById('waterVal');
const milkVal = document.getElementById('milkVal');

const makeBtn = document.getElementById('makeBtn');
const randomizeBtn = document.getElementById('randomize');
const inputFeedback = document.getElementById('inputFeedback');

const reviewText = document.getElementById('reviewText');
const nextToSip = document.getElementById('nextToSip');
const backToInput = document.getElementById('backToInput');

const steam = document.getElementById('steam');
const sipFeedback = document.getElementById('sipFeedback');
const sipQuestion = document.getElementById('sipQuestion');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

const toRating = document.getElementById('toRating');
const restart = document.getElementById('restart');

const ratingButtons = Array.from(document.querySelectorAll('[data-rate]'));
const ratingResult = document.getElementById('ratingResult');
const finishBtn = document.getElementById('finish');

// STATE
let coolingSeconds = 5;
let sipDisplayedAt = null;
let cooled = false;
let autoCoolTimer = null;
let userAnswers = {};

// ---- Helpers ----
function showPage(pageEl){
  [pageQuestions, pageInput, pageReview, pageSip, pageRating].forEach(p => p.classList.remove('active'));
  pageEl.classList.add('active');
}

function updateSliderDisplays(){
  sugarVal.innerText = sugarEl.value;
  teaVal.innerText = teaEl.value;
  waterVal.innerText = waterEl.value;
  milkVal.innerText = milkEl.value;
}

function gatherInputs(){
  return {
    sugar: Number(sugarEl.value),
    tea: Number(teaEl.value),
    water: Number(waterEl.value),
    milk: Number(milkEl.value)
  };
}

function mapBrewTimeToCooling(brewTimeText){
  if (!brewTimeText) return 5;
  if (brewTimeText.toLowerCase().includes('short')) return 3;
  if (brewTimeText.toLowerCase().includes('medium')) return 6;
  if (brewTimeText.toLowerCase().includes('long')) return 9;
  return 5;
}

function makeReviewText(inputs){
  let comments = [];
  const name = userAnswers.name || 'Tea Lover';
  const teaType = userAnswers.teaType || 'tea';
  const spice = userAnswers.spice || 'no spice';
  const milkChoice = userAnswers.milkChoice || 'No';

  comments.push(`Hi ${name}, you're making ${teaType} with ${spice.toLowerCase()} (milk: ${milkChoice}).`);

  if (inputs.sugar >= 8) comments.push("That's a sugar tsunami — you're making syrup, not chai!");
  if (inputs.sugar >= 5 && inputs.sugar < 8) comments.push("Quite sweet — your sweet tooth is showing.");
  if (inputs.sugar === 0) comments.push("Zero sugar? Monk vibes.");
  if (inputs.tea === 0) comments.push("No tea leaves? This is just hot water/milk.");
  if (inputs.water < inputs.tea * 30) comments.push("Too little water for the amount of leaves — it'll be very strong.");
  if (inputs.water > inputs.tea * 120 && inputs.tea <= 1) comments.push("Very watery — might taste like flavored water.");
  if (inputs.tea >= 5) comments.push("That's kadak—strong and bold!");
  if (milkChoice.toLowerCase() === 'yes' && inputs.milk === 0) comments.push("You said you'd add milk but set milk to 0 ml — maybe increase it.");
  if (comments.length === 1) comments.push("Balanced! This looks drinkable (grandma might approve).");

  if (userAnswers.brewTime && userAnswers.brewTime.toLowerCase().includes('long')) {
    comments.push("Long brew — consider slightly less tea leaves if you want a milder cup.");
  }

  return comments.join(' ');
}

// ===== AI Integration via OpenRouter =====
const OPENROUTER_API_KEY = "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"; // Replace with your key
async function getAIComment(recipeSummary) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          { role: "system", content: "You are a humorous tea master giving playful feedback on tea recipes." },
          { role: "user", content: `Here’s the tea recipe: ${recipeSummary}. Give a short, witty remark.` }
        ]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.error("AI Error:", err);
    return "";
  }
}

// ---- Event bindings ----
sugarEl.addEventListener('input', updateSliderDisplays);
teaEl.addEventListener('input', updateSliderDisplays);
waterEl.addEventListener('input', updateSliderDisplays);
milkEl.addEventListener('input', updateSliderDisplays);

randomizeBtn.addEventListener('click', () => {
  sugarEl.value = Math.floor(Math.random() * 11);
  teaEl.value = Math.floor(Math.random() * 9);
  waterEl.value = 100 + Math.floor(Math.random() * 401);
  milkEl.value = Math.floor(Math.random() * 301);
  updateSliderDisplays();
  inputFeedback.style.display = 'none';
});

startSliders.addEventListener('click', () => {
  userAnswers.name = userNameEl.value.trim() || 'Tea Lover';
  userAnswers.teaType = teaTypeEl.value;
  userAnswers.milkChoice = milkChoiceEl.value;
  userAnswers.spice = spiceEl.value;
  userAnswers.brewTime = brewTimeEl.value;

  coolingSeconds = mapBrewTimeToCooling(userAnswers.brewTime);

  inputFeedback.style.display = 'block';
  inputFeedback.innerHTML = `<strong>Nice!</strong> ${userAnswers.name}, you're making <em>${userAnswers.teaType}</em> (+${userAnswers.spice}) — adjust the sliders below to fine-tune. (Demo cool time: ${coolingSeconds}s)`;

  showPage(pageInput);
  updateSliderDisplays();
  sipFeedback.style.display = 'none';
  toRating.style.display = 'none';
  restart.style.display = 'none';
});

makeBtn.addEventListener('click', () => {
  const inputs = gatherInputs();
  if (inputs.water <= 0) {
    inputFeedback.style.display = 'block';
    inputFeedback.innerText = 'Please add some water — tea needs water!';
    return;
  }
  const review = makeReviewText(inputs);
  reviewText.innerText = review;

  // Add AI-generated twist
  getAIComment(review).then(aiRemark => {
    if (aiRemark) {
      reviewText.innerText += "\n\nAI says: " + aiRemark;
    }
  });

  showPage(pageReview);
});

backToInput.addEventListener('click', () => {
  showPage(pageInput);
});

// ---- SIP STAGE ----
function startSipStage(){
  cooled = false;
  sipFeedback.style.display = 'none';
  toRating.style.display = 'none';
  restart.style.display = 'none';
  sipQuestion.style.display = 'block';
  steam.classList.remove('hidden', 'dim');

  sipDisplayedAt = Date.now();

  if (autoCoolTimer) clearTimeout(autoCoolTimer);
  autoCoolTimer = setTimeout(() => {
    cooled = true;
    steam.classList.add('dim');
    setTimeout(() => {
      steam.classList.add('hidden');
    }, 1500);
  }, coolingSeconds * 1000);
}

nextToSip.addEventListener('click', () => {
  showPage(pageSip);
  startSipStage();
});

yesBtn.addEventListener('click', () => {
  const elapsedSec = (Date.now() - sipDisplayedAt) / 1000;
  if (!cooled && elapsedSec < coolingSeconds) {
    sipFeedback.style.display = 'block';
    sipFeedback.innerHTML = '<strong style="color:#b71c1c">Too hot! 🔥 Wait a bit — the steam is strong.</strong>';
    steam.classList.remove('hidden', 'dim');
    if (autoCoolTimer) clearTimeout(autoCoolTimer);
    const remainingMs = Math.max(1200, (coolingSeconds - elapsedSec) * 1000);
    autoCoolTimer = setTimeout(() => {
      cooled = true;
      steam.classList.add('dim');
      setTimeout(() => steam.classList.add('hidden'), 1400);
    }, remainingMs);
    toRating.style.display = 'none';
    restart.style.display = 'inline-block';
  } else {
    sipFeedback.style.display = 'block';
    sipFeedback.innerHTML = '<strong style="color:var(--ok)">Perfect — sip it slowly. 😌☕</strong>';
    steam.classList.add('hidden');
    toRating.style.display = 'inline-block';
    restart.style.display = 'inline-block';
    if (autoCoolTimer) { clearTimeout(autoCoolTimer); autoCoolTimer = null; }
  }
});

noBtn.addEventListener('click', () => {
  sipFeedback.style.display = 'block';
  sipFeedback.innerHTML = "You chose to wait. Wise move. Tea is patient.";
  toRating.style.display = 'inline-block';
  restart.style.display = 'inline-block';
  if (autoCoolTimer) { clearTimeout(autoCoolTimer); autoCoolTimer = null; }
  steam.classList.add('hidden');
});

restart.addEventListener('click', () => {
  showPage(pageInput);
  sipFeedback.style.display = 'none';
  toRating.style.display = 'none';
  restart.style.display = 'none';
  steam.classList.remove('hidden');
  steam.classList.remove('dim');
  if (autoCoolTimer) { clearTimeout(autoCoolTimer); autoCoolTimer = null; }
});

toRating.addEventListener('click', () => {
  showPage(pageRating);
});

ratingButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const score = e.currentTarget.getAttribute('data-rate');
    if (score === 'bad') ratingResult.innerText = "Ouch — throw it away and try again!";
    else if (score === 'meh') ratingResult.innerText = "Not bad. Maybe more practice.";
    else ratingResult.innerText = "Chef's kiss! You have tea-making talent.";
    finishBtn.style.display = 'inline-block';
  });
});

finishBtn.addEventListener('click', () => {
  showPage(pageQuestions);
  sipFeedback.style.display = 'none';
  toRating.style.display = 'none';
  restart.style.display = 'none';
  ratingResult.innerText = '';
  finishBtn.style.display = 'none';
  inputFeedback.style.display = 'none';
  sugarEl.value = 2;
  teaEl.value = 2;
  waterEl.value = 250;
  milkEl.value = 100;
  updateSliderDisplays();
  userAnswers = {};
  if (autoCoolTimer) { clearTimeout(autoCoolTimer); autoCoolTimer = null; }
});

brewTimeEl.addEventListener('change', () => {
  coolingSeconds = mapBrewTimeToCooling(brewTimeEl.value);
});

updateSliderDisplays();
showPage(pageQuestions);
sipFeedback.style.display = 'none';
toRating.style.display = 'none';
restart.style.display = 'none';
finishBtn.style.display = 'none';
