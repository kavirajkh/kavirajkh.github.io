import { Chart, registerables } from 'chart.js';
import {
  PEER_FEEDBACK_CSV_URL,
  fetchFeedbackRows,
  aggregateFeedback,
  type FeedbackAggregate,
  type Tally,
} from '../lib/peer-feedback';

Chart.register(...registerables);

const ACCENT = '#1d4ed8';
const ACCENT_WASH = 'rgba(29, 78, 216, 0.12)';
const TOOLTIP_BG = '#14181f';
const GRID = '#e2e5eb';
const TICK_MUTED = '#6b7280';
const TICK_SECONDARY = '#4b5563';

const MIN_SKILLS_FOR_RADAR = 3;
const MAX_BAR_ROWS = 10;

function byId<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

function setHidden(el: Element | null, hidden: boolean) {
  el?.classList.toggle('is-hidden', hidden);
}

interface ChartSectionRefs {
  section: HTMLElement;
  button: HTMLButtonElement;
  canvasWrap: Element;
  tableWrap: Element;
}

function getChartSectionRefs(sectionId: string): ChartSectionRefs | null {
  const section = byId<HTMLElement>(sectionId);
  const button = section?.querySelector<HTMLButtonElement>('[data-toggle-table]');
  const canvasWrap = section?.querySelector('.chart-card__canvas-wrap');
  const tableWrap = section?.querySelector('.chart-card__table-wrap');
  if (!section || !button || !canvasWrap || !tableWrap) return null;
  return { section, button, canvasWrap, tableWrap };
}

function wireTableToggle(refs: ChartSectionRefs) {
  const { button, canvasWrap, tableWrap } = refs;
  button.addEventListener('click', () => {
    const showingTable = !tableWrap.classList.contains('is-hidden');
    setHidden(tableWrap, showingTable);
    setHidden(canvasWrap, !showingTable);
    button.textContent = showingTable ? 'View as table' : 'View as chart';
    button.setAttribute('aria-pressed', String(!showingTable));
  });
}

function tooltipBase() {
  return {
    backgroundColor: TOOLTIP_BG,
    titleColor: '#ffffff',
    bodyColor: '#ffffff',
    displayColors: false,
    padding: 10,
    cornerRadius: 6,
  };
}

function renderBarChart(canvas: HTMLCanvasElement, tallies: Tally[]) {
  const labels = tallies.map((t) => t.label);
  const data = tallies.map((t) => t.count);

  canvas.parentElement!.style.height = `${Math.min(420, Math.max(160, tallies.length * 44 + 40))}px`;

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ACCENT,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 24,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipBase(),
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.x} response${ctx.parsed.x === 1 ? '' : 's'}`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { precision: 0, color: TICK_MUTED },
          grid: { color: GRID },
        },
        y: {
          ticks: { color: TICK_SECONDARY },
          grid: { display: false },
        },
      },
    },
  });
}

function renderRadarChart(canvas: HTMLCanvasElement, labels: string[], data: number[]) {
  return new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ACCENT_WASH,
          borderColor: ACCENT,
          borderWidth: 2,
          pointBackgroundColor: ACCENT,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipBase(),
          callbacks: {
            label: (ctx) => ` ${ctx.formattedValue} / 5`,
          },
        },
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 5,
          ticks: { stepSize: 1, showLabelBackdrop: false, color: '#898781' },
          grid: { color: GRID },
          angleLines: { color: GRID },
          pointLabels: { color: TICK_SECONDARY, font: { size: 11 } },
        },
      },
    },
  });
}

function fillTallyTable(tbodyId: string, tallies: Tally[], truncatedCount: number) {
  const tbody = byId<HTMLTableSectionElement>(tbodyId);
  if (!tbody) return;
  tbody.textContent = '';

  for (const t of tallies) {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.textContent = t.label;
    const tdCount = document.createElement('td');
    tdCount.textContent = String(t.count);
    tr.append(tdLabel, tdCount);
    tbody.append(tr);
  }

  if (truncatedCount > 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 2;
    td.className = 'chart-table__note';
    td.textContent = `+ ${truncatedCount} more not shown`;
    tr.append(td);
    tbody.append(tr);
  }
}

interface TallySectionConfig {
  sectionId: string;
  canvasId: string;
  tableBodyId: string;
  tallies: Tally[];
}

function renderTallySection({ sectionId, canvasId, tableBodyId, tallies }: TallySectionConfig) {
  const refs = getChartSectionRefs(sectionId);
  if (!refs) return;

  if (tallies.length === 0) {
    setHidden(refs.section, true);
    return;
  }
  setHidden(refs.section, false);

  const shown = tallies.slice(0, MAX_BAR_ROWS);
  const truncated = Math.max(0, tallies.length - shown.length);

  const canvas = byId<HTMLCanvasElement>(canvasId);
  if (canvas) renderBarChart(canvas, shown);
  fillTallyTable(tableBodyId, tallies, truncated);
  wireTableToggle(refs);
}

function renderSkillsSection(aggregate: FeedbackAggregate) {
  const refs = getChartSectionRefs('skills-section');
  if (!refs) return;

  const tbody = byId<HTMLTableSectionElement>('skills-table-body');
  if (tbody) {
    tbody.textContent = '';
    for (const skill of aggregate.skillAverages) {
      const tr = document.createElement('tr');
      const tdLabel = document.createElement('td');
      tdLabel.textContent = skill.label;
      const tdAverage = document.createElement('td');
      tdAverage.textContent =
        skill.average !== null ? `${skill.average.toFixed(1)} / 5` : 'No data yet';
      const tdCount = document.createElement('td');
      tdCount.textContent = String(skill.count);
      tr.append(tdLabel, tdAverage, tdCount);
      tbody.append(tr);
    }
  }

  const available = aggregate.skillAverages.filter((s) => s.average !== null);
  const note = byId<HTMLElement>('skills-fallback-note');

  if (available.length < MIN_SKILLS_FOR_RADAR) {
    setHidden(refs.canvasWrap, true);
    setHidden(refs.tableWrap, false);
    setHidden(note, false);
    refs.button.style.display = 'none';
    return;
  }

  setHidden(note, true);
  const canvas = byId<HTMLCanvasElement>('skills-radar-canvas');
  if (canvas) {
    renderRadarChart(
      canvas,
      available.map((s) => s.label),
      available.map((s) => s.average as number),
    );
  }
  wireTableToggle(refs);
}

interface CommentsSectionConfig {
  sectionId: string;
  listId: string;
  comments: string[];
}

function renderCommentsSection({ sectionId, listId, comments }: CommentsSectionConfig) {
  const section = byId<HTMLElement>(sectionId);
  const list = byId<HTMLUListElement>(listId);
  if (!section || !list) return;

  if (comments.length === 0) {
    setHidden(section, true);
    return;
  }

  setHidden(section, false);
  list.textContent = '';
  for (const comment of comments) {
    const li = document.createElement('li');
    li.textContent = comment;
    list.append(li);
  }
}

function renderStats(aggregate: FeedbackAggregate) {
  const totalEl = byId<HTMLElement>('stat-total-responses');
  if (totalEl) totalEl.textContent = String(aggregate.totalResponses);

  const ratingEl = byId<HTMLElement>('stat-overall-rating');
  if (ratingEl) {
    ratingEl.textContent =
      aggregate.overallRatingAverage !== null
        ? `${aggregate.overallRatingAverage.toFixed(1)} / 5`
        : '—';
  }

  const recommendationEl = byId<HTMLElement>('stat-top-recommendation');
  if (recommendationEl) {
    const top = aggregate.recommendationCounts[0];
    recommendationEl.textContent = top
      ? `${top.label} (${top.count}/${aggregate.totalResponses})`
      : '—';
  }
}

async function init() {
  const statusEl = byId<HTMLElement>('feedback-status');
  const contentEl = byId<HTMLElement>('feedback-content');
  const emptyEl = byId<HTMLElement>('feedback-empty');

  try {
    const rows = await fetchFeedbackRows(PEER_FEEDBACK_CSV_URL);
    const aggregate = aggregateFeedback(rows);

    setHidden(statusEl, true);

    if (aggregate.totalResponses === 0) {
      setHidden(emptyEl, false);
      setHidden(contentEl, true);
      return;
    }

    setHidden(contentEl, false);
    setHidden(emptyEl, true);

    renderStats(aggregate);
    renderSkillsSection(aggregate);

    const tallySections: TallySectionConfig[] = [
      {
        sectionId: 'interview-type-section',
        canvasId: 'interview-type-canvas',
        tableBodyId: 'interview-type-table-body',
        tallies: aggregate.interviewTypeCounts,
      },
      {
        sectionId: 'recommendation-section',
        canvasId: 'recommendation-canvas',
        tableBodyId: 'recommendation-table-body',
        tallies: aggregate.recommendationCounts,
      },
      {
        sectionId: 'confidence-section',
        canvasId: 'confidence-canvas',
        tableBodyId: 'confidence-table-body',
        tallies: aggregate.confidenceCounts,
      },
      {
        sectionId: 'readiness-section',
        canvasId: 'readiness-canvas',
        tableBodyId: 'readiness-table-body',
        tallies: aggregate.readinessCounts,
      },
      {
        sectionId: 'improvement-areas-section',
        canvasId: 'improvement-areas-canvas',
        tableBodyId: 'improvement-areas-table-body',
        tallies: aggregate.improvementAreaCounts,
      },
    ];
    tallySections.forEach(renderTallySection);

    const commentsSections: CommentsSectionConfig[] = [
      {
        sectionId: 'highlights-section',
        listId: 'highlights-list',
        comments: aggregate.highlights,
      },
      {
        sectionId: 'growth-areas-section',
        listId: 'growth-areas-list',
        comments: aggregate.growthAreas,
      },
      {
        sectionId: 'additional-notes-section',
        listId: 'additional-notes-list',
        comments: aggregate.additionalNotes,
      },
    ];
    commentsSections.forEach(renderCommentsSection);
  } catch (error) {
    console.error('Failed to load peer feedback data', error);
    if (statusEl)
      statusEl.textContent = "Couldn't load feedback data right now — please check back later.";
    setHidden(contentEl, true);
  }
}

init();
