import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide,
} from 'd3-force';

interface GraphNode {
  id: number;
  radius: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphLink {
  source: number | GraphNode;
  target: number | GraphNode;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function buildGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const HUB_COUNT = 6;
  const LEAVES_PER_HUB = 3;

  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  for (let i = 0; i < HUB_COUNT; i++) {
    nodes.push({ id: i, radius: 6 });
  }

  // Ring-connect the hubs so the core reads as a small backbone network.
  for (let i = 0; i < HUB_COUNT; i++) {
    links.push({ source: i, target: (i + 1) % HUB_COUNT });
  }

  let nextId = HUB_COUNT;
  for (let hub = 0; hub < HUB_COUNT; hub++) {
    for (let leaf = 0; leaf < LEAVES_PER_HUB; leaf++) {
      const id = nextId++;
      nodes.push({ id, radius: 3 });
      links.push({ source: hub, target: id });
    }
  }

  // A handful of cross-links between leaves so it reads as a graph, not a tree.
  const extraLinks = Math.floor((nodes.length - HUB_COUNT) * 0.4);
  for (let i = 0; i < extraLinks; i++) {
    const a = HUB_COUNT + Math.floor(Math.random() * (nodes.length - HUB_COUNT));
    const b = HUB_COUNT + Math.floor(Math.random() * (nodes.length - HUB_COUNT));
    if (a !== b) links.push({ source: a, target: b });
  }

  return { nodes, links };
}

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function init() {
  const container = document.getElementById('hero-graph-bg');
  if (!container) return;
  if (window.innerWidth < 640) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 440;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  container.appendChild(svg);

  const { nodes, links } = buildGraph();

  const linkEls = links.map(() => {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
    return line;
  });

  const nodeEls = nodes.map((node) => {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('r', String(node.radius));
    svg.appendChild(circle);
    return circle;
  });

  function applyColors() {
    const linkColor = cssVar('--color-border-strong', '#cbd2dc');
    const nodeColor = cssVar('--color-accent', '#1d4ed8');
    linkEls.forEach((line) => line.setAttribute('stroke', linkColor));
    nodeEls.forEach((circle) => circle.setAttribute('fill', nodeColor));
  }

  applyColors();

  function paint() {
    for (let i = 0; i < links.length; i++) {
      const link = links[i] as { source: GraphNode; target: GraphNode };
      const line = linkEls[i];
      line.setAttribute('x1', String(link.source.x ?? 0));
      line.setAttribute('y1', String(link.source.y ?? 0));
      line.setAttribute('x2', String(link.target.x ?? 0));
      line.setAttribute('y2', String(link.target.y ?? 0));
    }
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const circle = nodeEls[i];
      circle.setAttribute('cx', String(node.x ?? 0));
      circle.setAttribute('cy', String(node.y ?? 0));
    }
  }

  const xForce = forceX<GraphNode>(width / 2).strength(0.012);
  const yForce = forceY<GraphNode>(height / 2).strength(0.012);

  const linkDistance = Math.max(110, Math.min(width, height) / 4);

  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink<GraphNode, GraphLink>(links)
        .id((node) => node.id)
        .distance(linkDistance)
        .strength(0.12),
    )
    .force('charge', forceManyBody().strength(-170).distanceMax(Math.max(width, height)))
    .force('center', forceCenter(width / 2, height / 2))
    .force('x', xForce)
    .force('y', yForce)
    .force(
      'collide',
      forceCollide<GraphNode>((node) => node.radius + 10),
    )
    .velocityDecay(0.55)
    .on('tick', paint);

  if (prefersReducedMotion) {
    // Settle into a stable layout and render it once, with no ongoing motion.
    simulation.stop();
    simulation.alpha(1);
    for (let i = 0; i < 300; i++) simulation.tick();
    paint();
  } else {
    // Keep a low alpha target so the graph drifts gently forever instead of
    // settling into a static layout.
    simulation.alphaDecay(0.02).alphaTarget(0.04);
  }

  window.addEventListener('themechange', applyColors);

  let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || height;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      xForce.x(w / 2);
      yForce.y(h / 2);
      simulation.force('center', forceCenter(w / 2, h / 2));
      if (!prefersReducedMotion) simulation.alpha(0.3).restart();
    }, 200);
  });
}

init();
