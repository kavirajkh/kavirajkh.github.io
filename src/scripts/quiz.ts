import { checkAnswer } from '../lib/quiz-normalize';

type Question = {
  id: string;
  section: string;
  prompt: string;
  context?: string;
  answers: string[];
  note?: string;
};

type Progress = Record<string, { right: number; wrong: number; last: number; missed: boolean }>;

const ROUND_SIZE = 10;

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

function shuffle<T>(items: T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function init() {
  const dataNode = document.getElementById('quiz-data');
  if (!dataNode?.textContent) return;
  const { slug, questions } = JSON.parse(dataNode.textContent) as {
    slug: string;
    questions: Question[];
  };
  const byId = new Map(questions.map((q) => [q.id, q]));
  const storageKey = `quizProgress:${slug}`;

  let progress: Progress = {};
  try {
    progress = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Progress;
  } catch {
    progress = {};
  }
  const save = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      /* storage unavailable: progress simply is not kept */
    }
  };

  const startScreen = el('quiz-start');
  const playScreen = el('quiz-play');
  const summaryScreen = el('quiz-summary');
  const statsLine = el('quiz-stats');
  const missedBtn = el<HTMLButtonElement>('quiz-mode-missed');
  const counter = el('quiz-counter');
  const bar = el<HTMLElement>('quiz-bar');
  const sectionTag = el('quiz-section');
  const promptEl = el('quiz-prompt');
  const contextEl = el('quiz-context');
  const answerBox = el<HTMLTextAreaElement>('quiz-answer');
  const checkBtn = el<HTMLButtonElement>('quiz-check');
  const showBtn = el<HTMLButtonElement>('quiz-show');
  const resultEl = el('quiz-result');
  const nextBtn = el<HTMLButtonElement>('quiz-next');
  const scoreEl = el('quiz-score');
  const missedList = el('quiz-missed-list');
  const retryBtn = el<HTMLButtonElement>('quiz-retry');

  let round: string[] = [];
  let index = 0;
  let outcomes = new Map<string, boolean>();
  let resolved = false;

  function show(screen: HTMLElement) {
    [startScreen, playScreen, summaryScreen].forEach((s) => {
      s.hidden = s !== screen;
    });
  }

  function missedIds(): string[] {
    return questions.filter((q) => progress[q.id]?.missed).map((q) => q.id);
  }

  function renderStart() {
    const seen = questions.filter((q) => progress[q.id]).length;
    const missed = missedIds().length;
    statsLine.textContent =
      seen === 0
        ? `${questions.length} questions. Nothing attempted yet.`
        : `${questions.length} questions. ${seen} attempted, ${missed} currently marked as missed.`;
    missedBtn.disabled = missed === 0;
    show(startScreen);
  }

  function pickRandom(): string[] {
    const missed = shuffle(missedIds());
    const unseen = shuffle(questions.filter((q) => !progress[q.id]).map((q) => q.id));
    const rest = questions
      .filter((q) => progress[q.id] && !progress[q.id].missed)
      .sort((a, b) => progress[a.id].last - progress[b.id].last)
      .map((q) => q.id);
    return [...missed, ...unseen, ...rest].slice(0, ROUND_SIZE);
  }

  function startRound(ids: string[]) {
    round = ids;
    index = 0;
    outcomes = new Map();
    show(playScreen);
    showQuestion();
  }

  function clearResult() {
    resultEl.replaceChildren();
    resultEl.className = 'quiz-result';
  }

  function showQuestion() {
    const q = byId.get(round[index]);
    if (!q) return;
    resolved = false;
    counter.textContent = `Question ${index + 1} of ${round.length}`;
    bar.style.width = `${(index / round.length) * 100}%`;
    sectionTag.textContent = q.section;
    promptEl.textContent = q.prompt;
    if (q.context) {
      contextEl.hidden = false;
      contextEl.querySelector('code')!.textContent = q.context;
    } else {
      contextEl.hidden = true;
    }
    answerBox.value = '';
    answerBox.disabled = false;
    checkBtn.hidden = false;
    showBtn.hidden = false;
    nextBtn.hidden = true;
    clearResult();
    answerBox.focus();
  }

  function record(id: string, correct: boolean) {
    const prev = progress[id] ?? { right: 0, wrong: 0, last: 0, missed: false };
    progress[id] = {
      right: prev.right + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
      last: Date.now(),
      missed: !correct,
    };
    outcomes.set(id, correct);
    save();
  }

  function addButton(label: string, onClick: () => void, secondary = true): HTMLButtonElement {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `btn ${secondary ? 'btn--secondary' : 'btn--primary'}`;
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function resultMessage(kind: 'correct' | 'close' | 'wrong' | 'revealed', text: string) {
    clearResult();
    resultEl.classList.add(`quiz-result--${kind}`);
    const p = document.createElement('p');
    p.className = 'quiz-result__title';
    p.textContent = text;
    resultEl.appendChild(p);
  }

  function revealAnswers(q: Question) {
    const label = document.createElement('p');
    label.className = 'quiz-result__label';
    label.textContent = q.answers.length > 1 ? 'Accepted answers' : 'Expected answer';
    resultEl.appendChild(label);
    q.answers.forEach((a) => {
      const pre = document.createElement('pre');
      pre.className = 'quiz-code';
      const code = document.createElement('code');
      code.textContent = a;
      pre.appendChild(code);
      resultEl.appendChild(pre);
    });
    addNote(q);
  }

  function addNote(q: Question) {
    if (!q.note) return;
    const n = document.createElement('p');
    n.className = 'quiz-result__note';
    n.textContent = q.note;
    resultEl.appendChild(n);
  }

  function finishQuestion(correct: boolean) {
    const q = byId.get(round[index])!;
    record(q.id, correct);
    resolved = true;
    answerBox.disabled = true;
    checkBtn.hidden = true;
    showBtn.hidden = true;
    nextBtn.hidden = false;
    nextBtn.textContent = index + 1 === round.length ? 'See results' : 'Next question';
    nextBtn.focus();
  }

  function onCheck() {
    if (resolved) return;
    const q = byId.get(round[index])!;
    const user = answerBox.value;
    if (!user.trim()) {
      resultMessage('close', 'Type your answer first, or use "Show answer".');
      return;
    }
    const verdict = checkAnswer(user, q.answers);
    if (verdict === 'correct') {
      resultMessage('correct', 'Correct');
      addNote(q);
      finishQuestion(true);
      return;
    }
    if (verdict === 'close') {
      resultMessage('close', 'Very close. Check punctuation, names and arguments.');
      resultEl.appendChild(
        addButton('Try again', () => {
          clearResult();
          answerBox.focus();
        }),
      );
      resultEl.appendChild(addButton('Show answer', () => onShow()));
      return;
    }
    resultMessage('wrong', 'Not a match');
    revealAnswers(q);
    resultEl.appendChild(
      addButton('My answer was also valid', () => {
        clearResult();
        resultMessage('correct', 'Counted as correct');
        revealAnswers(q);
        record(q.id, true);
        nextBtn.focus();
      }),
    );
    finishQuestion(false);
  }

  function onShow() {
    if (resolved) return;
    const q = byId.get(round[index])!;
    resultMessage('revealed', 'Answer revealed (counted as missed)');
    revealAnswers(q);
    finishQuestion(false);
  }

  function onNext() {
    index++;
    if (index >= round.length) {
      renderSummary();
    } else {
      showQuestion();
    }
  }

  function renderSummary() {
    bar.style.width = '100%';
    const total = round.length;
    const right = [...outcomes.values()].filter(Boolean).length;
    scoreEl.textContent = `${right} / ${total}`;
    const missed = round.filter((id) => outcomes.get(id) === false);
    missedList.replaceChildren();
    missed.forEach((id) => {
      const q = byId.get(id)!;
      const li = document.createElement('li');
      const p = document.createElement('p');
      p.textContent = q.prompt;
      const pre = document.createElement('pre');
      pre.className = 'quiz-code';
      const code = document.createElement('code');
      code.textContent = q.answers[0];
      pre.appendChild(code);
      li.append(p, pre);
      missedList.appendChild(li);
    });
    el('quiz-missed-wrap').hidden = missed.length === 0;
    retryBtn.hidden = missed.length === 0;
    retryBtn.onclick = () => startRound(missed);
    show(summaryScreen);
  }

  el('quiz-mode-random').addEventListener('click', () => startRound(pickRandom()));
  el('quiz-mode-full').addEventListener('click', () =>
    startRound(shuffle(questions.map((q) => q.id))),
  );
  missedBtn.addEventListener('click', () => startRound(shuffle(missedIds())));
  el('quiz-again').addEventListener('click', renderStart);
  el('quiz-quit').addEventListener('click', renderStart);
  checkBtn.addEventListener('click', onCheck);
  showBtn.addEventListener('click', onShow);
  nextBtn.addEventListener('click', onNext);
  answerBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (resolved) onNext();
      else onCheck();
    }
  });
  el('quiz-reset').addEventListener('click', () => {
    if (!window.confirm('Clear your saved quiz progress on this device?')) return;
    progress = {};
    save();
    renderStart();
  });

  renderStart();
}

init();
