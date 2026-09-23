import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

const [baseData, russian] = await Promise.all([
  fetch('./data.json?v=38', { cache: 'no-cache' }).then((response) => {
    if (!response.ok) throw new Error(`Cannot load process data (${response.status})`);
    return response.json();
  }),
  fetch('./translations.ru.json?v=26', { cache: 'no-cache' }).then((response) => {
    if (!response.ok) throw new Error(`Cannot load Russian translations (${response.status})`);
    return response.json();
  }),
]);

const englishUi = {
  dependencies: 'Dependencies',
  errorPrevention: 'Error prevention',
  roleAssignment: 'Role and required skill',
  openRoleContract: 'Open delegation and handoff instructions',
  statusMeanings: 'Reading technical statuses',
  statusMeaningsText: 'pending (the named check or decision is outstanding); approved (only the stated scope/version is approved). A status is not evidence by itself.',
  openStatusMeanings: 'Open status meanings and boundaries',
  openReadingContract: 'Artifact summary, contents and evidence',
  requiredEvidence: 'Required evidence', finalCompletion: 'Final completion only',
  introSubtitle: 'Bootstrap and 19 governed stages, from legacy evidence to independent acceptance and owner sign-off.',
  checkpoints: 'checkpoints', phases: 'phases', independentControls: 'independent control stages', ownerGates: 'owner gates', conditional: 'conditional',
  phaseColors: 'Phase colors', objectShapes: 'Object shapes', stage: 'Stage', artifact: 'Artifact', gate: 'Gate',
  selectedReturn: 'Selected return', deliveryCycle: 'Build · deploy · QA cycle', selectedArtifactRole: 'Selected Stage · artifact role',
  input: 'Input', output: 'Output', updated: 'Input + updated output', whoActs: 'Who acts', agentWork: 'Agent work',
  independentAgentCheck: 'Independent agent check', humanReview: 'Human review / decision', artifacts: 'Artifacts',
  agentVerification: 'Agent verification', verificationResponsibility: 'Verification responsibility',
  independentFrameHint: 'Solid frame: an independent reviewer is required. This is a responsibility, not a passed result.',
  primaryFrameHint: 'Dashed frame: the responsible agent verifies behavior or closure; this is not a separate independent review.',
  independentCheckDuty: 'A fresh eligible independent agent checks the exact scope and records a separate verdict. The author cannot approve their own work.',
  peerCheckDuty: 'The author implements and checks the slice. A separate independent reviewer then reviews the candidate before the owner authorizes merge. This is a peer review inside Stage 17, not another standalone control stage.',
  primaryCheckDuty: 'The responsible agent verifies behavior or closure and records evidence. This is not a fresh independent review; required independent controls and owner decisions remain separate.',
  showCompleteProcess: 'Show the complete process', toggleArtifacts: 'Show or hide artifacts', backToStage: 'Back to selected stage',
  closeDetails: 'Close details', footerHelp: 'Click: details · wheel: zoom · left drag: rotate · right drag: pan',
  canvasLabel: 'Interactive 3D map of the Legacy Modernization Starter process', processSummary: 'Process summary',
  canvasLegend: 'Canvas legend', processPhases: 'Process phases', artifactColors: 'Artifact colors for the selected stage',
  processParticipants: 'Process participants', mapControls: 'Map controls', automatedDecisionGate: 'Automated / decision gate',
  startingPoint: 'Starting point', whatHappens: 'What happens', exit: 'Exit', returnPath: 'Return path',
  returnPathsFromSelectedStage: 'Return paths from selected stage',
  whereEvidenceLives: 'Where evidence lives', exampleUse: 'Example use', realXPlannerTrail: 'Real XPlanner evidence trail',
  gates: 'Gates', roleInStage: 'Role in selected stage', lifecycle: 'Lifecycle', whenAndHowUsed: 'When and how used',
  starterReference: 'Starter reference', newProjectOutput: 'How it appears in a project', realXPlannerExample: 'Real XPlanner example',
  initialCreator: 'Created by', maintainedBy: 'Maintained / decided by', artifactResponsibility: 'Who creates and maintains it', governingInstructions: 'Governing instructions',
  creationStageRules: 'The active-stage procedure defines when this artifact is required and which approved inputs may populate it. The starter reference above defines its structure.',
  openStageInstructions: 'Open governing instructions ↗',
  selectedStageInstructions: 'Open instructions for this use ↗',
  delayedInputs: 'Phase B: open after the blind inspection',
  frameMeaning: 'Frames show responsibility, not a passed result.',
  example: 'Example', usedAt: 'Used at', implementationReference: 'Implementation or evidence reference',
  inputArtifacts: 'Input artifacts', updatedArtifacts: 'Updated artifacts', outputArtifacts: 'Output artifacts', none: 'None',
  shipsWithStarter: 'Ships with the starter', copiedByInitializer: 'Copied by initializer', generatedByInitializer: 'Generated by initializer',
  createdDuringMigration: 'Created during migration', projectSpecificOutput: 'Project-specific output',
  openSourceTemplate: 'Open source or template ↗', openRealFile: 'Open real XPlanner file ↗',
  openRealReference: 'Open real XPlanner reference ↗', openStarterReference: 'Open starter reference ↗',
  historicFilename: 'Existing project evidence. Its recorded filename may differ from the new-project convention; do not use it to rename the template output.',
};

let locale = readLocale();
let data = localizeData(baseData, locale === 'ru' ? russian : null);

function readLocale() {
  const requestedLocale = new URLSearchParams(window.location.search).get('lang');
  if (['en', 'ru'].includes(requestedLocale)) return requestedLocale;
  try {
    return localStorage.getItem('process-canvas-locale') === 'ru' ? 'ru' : 'en';
  } catch {
    return 'en';
  }
}

function tr(key) {
  return locale === 'ru' ? russian.ui[key] || englishUi[key] : englishUi[key];
}

function localizeData(source, translation) {
  if (!translation) return structuredClone(source);
  const mergeItems = (items, translated) => items.map((item) => {
    const patch = translated[item.id] || {};
    const merged = { ...item, ...patch };
    if (item.xplannerExample) merged.xplannerExample = { ...item.xplannerExample, ...(patch.xplannerExample || {}) };
    if (item.relationship) merged.relationship = { ...item.relationship, ...(patch.relationship || {}) };
    if (item.xplannerExamples) {
      merged.xplannerExamples = item.xplannerExamples.map((example, index) => ({
        ...example,
        ...(patch.xplannerExamples?.[index] || {}),
      }));
    }
    return merged;
  });
  return {
    ...source,
    phases: mergeItems(source.phases, translation.phases),
    stages: mergeItems(source.stages, translation.stages),
    artifacts: mergeItems(source.artifacts, translation.artifacts).map((item) => ({
      ...item,
      projectOutput: translation.projectOutputs?.[item.id] || item.projectOutput,
    })),
    gates: mergeItems(source.gates, translation.gates).map(item => ({
      ...item, headline: item.reviewContract?.headline.ru || item.headline,
    })),
  };
}

const canvas = document.getElementById('scene');
const details = document.getElementById('details');
const tooltip = document.getElementById('tooltip');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x07111f, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07111f);
const baseFogNear = 220;
const baseFogFar = 520;
scene.fog = new THREE.Fog(0x07111f, baseFogNear, baseFogFar);

const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 900);
camera.position.set(15, 94, 270);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.minDistance = 24;
controls.maxDistance = 720;
controls.maxPolarAngle = Math.PI * 0.77;
controls.target.set(15, 5, 0);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

scene.add(new THREE.HemisphereLight(0xb9ddff, 0x07111f, 1.35));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
keyLight.position.set(-50, 95, 80);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x6db8ff, 1.1);
rimLight.position.set(110, 28, -90);
scene.add(rimLight);

const grid = new THREE.GridHelper(380, 38, 0x25445f, 0x14283c);
grid.position.y = -6;
grid.material.transparent = true;
grid.material.opacity = 0.42;
scene.add(grid);

const phaseById = new Map(data.phases.map((phase, index) => [phase.id, { ...phase, index }]));
const stageById = new Map(data.stages.map((stage) => [stage.id, stage]));
const artifactById = new Map(data.artifacts.map((artifact) => [artifact.id, artifact]));
const gateById = new Map(data.gates.map((gate) => [gate.id, gate]));
const artifactFlow = {
  input: { short: 'I', label: '', color: '#65bdf7', top: '#a8dcff', bottom: '#2f79bd' },
  output: { short: 'O', label: '', color: '#61d59b', top: '#a4e8c6', bottom: '#287e58' },
  updated: { short: 'U', label: '', color: '#c9a7ff', top: '#dac8ff', bottom: '#7653b8' },
};
updateFlowLabels();
applyStaticTranslations();
const defaultArtifactSurface = { top: '#edf7ff', bottom: '#7897b1' };
const objectByKey = new Map();
const artifactLabelById = new Map();
const stageLabelById = new Map();
const stageVisualsById = new Map();
const phaseVisualsById = new Map();
const artifactFlowById = new Map();
const pickable = [];
const artifactGroup = new THREE.Group();
const artifactFlowArrowGroup = new THREE.Group();
const returnFlowGroup = new THREE.Group();
const deliveryCycleGroup = new THREE.Group();
const gateGroup = new THREE.Group();
scene.add(artifactGroup, artifactFlowArrowGroup, returnFlowGroup, deliveryCycleGroup, gateGroup);

const phaseX = (index) => (index - (data.phases.length - 1) / 2) * 46;
const processForwardAxis = new THREE.Vector3(1, 0, 0);
const stageGap = 22;
const phaseLabelHeight = 48;
const phaseLabelGroundGap = 14;
const phaseLabelStyle = {
  size: 38, subSize: 17, color: '#eef7ff', width: 520, scale: 0.092,
  depthTest: false, fog: false,
};
const stagePositions = new Map();
const phaseBounds = new Map();
const phaseLayouts = new Map();

let stagePathZ = 0;
let stagePathDirection = 1;
let stagePathMinZ = Infinity;
let stagePathMaxZ = -Infinity;

for (const phase of data.phases) {
  const phaseStages = data.stages.filter((stage) => stage.phase === phase.id);
  const rawStageZ = phaseStages.map((stage, index) => ({
    id: stage.id,
    z: stagePathZ + stagePathDirection * index * stageGap,
  }));
  const zValues = rawStageZ.map((item) => item.z);
  const minZ = Math.min(...zValues);
  const maxZ = Math.max(...zValues);
  stagePathMinZ = Math.min(stagePathMinZ, minZ);
  stagePathMaxZ = Math.max(stagePathMaxZ, maxZ);
  phaseLayouts.set(phase.id, {
    rawStageZ,
    centerZ: (minZ + maxZ) / 2,
    depth: Math.max(30, maxZ - minZ + 30),
  });
  stagePathZ = rawStageZ.at(-1).z;
  if (phaseStages.length > 1) stagePathDirection *= -1;
}

const stagePathCenterZ = (stagePathMinZ + stagePathMaxZ) / 2;

for (const phase of data.phases) {
  const phaseStages = data.stages.filter((stage) => stage.phase === phase.id);
  const layout = phaseLayouts.get(phase.id);
  const depth = layout.depth;
  const centerZ = layout.centerZ - stagePathCenterZ;
  const x = phaseX(phaseById.get(phase.id).index);
  const platformGeometry = new THREE.BoxGeometry(39, 0.7, depth);
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: phase.color,
    transparent: true,
    opacity: 0.13,
    roughness: 0.8,
    metalness: 0.05,
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.set(x, -5.2, centerZ);
  scene.add(platform);

  const border = new THREE.LineSegments(
    new THREE.EdgesGeometry(platformGeometry),
    new THREE.LineBasicMaterial({ color: phase.color, transparent: true, opacity: 0.42 }),
  );
  platform.add(border);

  const phaseLabel = makeTextSprite([phase.label, phase.range], {
    ...phaseLabelStyle,
    subColor: phase.color,
  });
  phaseLabel.renderOrder = 23;
  scene.add(phaseLabel);
  phaseVisualsById.set(phase.id, { platform, border, label: phaseLabel });
  phaseBounds.set(phase.id, { x, depth, z: centerZ });

  phaseStages.forEach((stage, index) => {
    const rawZ = layout.rawStageZ[index].z;
    const z = rawZ - stagePathCenterZ;
    const y = 5 + (Math.abs(Math.round(rawZ / stageGap)) % 2) * 2.2;
    stagePositions.set(stage.id, new THREE.Vector3(x, y, z));
  });
}

createDeliveryCycle();
drawSequence();
createStages();
createArtifacts();
createGates();
createPhaseNavigation();

let selected = null;
let hovered = null;
let cameraTween = null;
let pendingStageClick = null;
let canvasGesture = null;
const activeCanvasPointers = new Set();
const clickMovementTolerance = 5;
let activeStageId = null;
let detailsBackStageId = null;
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

canvas.addEventListener('pointerdown', beginCanvasGesture);
canvas.addEventListener('pointermove', onPointerMove);
document.addEventListener('pointerup', endCanvasGesture);
document.addEventListener('pointercancel', endCanvasGesture);
canvas.addEventListener('lostpointercapture', endCanvasGesture);
canvas.addEventListener('pointerleave', clearHover);
canvas.addEventListener('click', onClick);
canvas.addEventListener('dblclick', onDoubleClick);
controls.addEventListener('start', () => {
  cameraTween = null;
});
document.getElementById('closeDetails').addEventListener('click', clearSelection);
document.getElementById('detailsBack').addEventListener('click', returnToDetailsStage);
document.getElementById('resetView').addEventListener('click', resetView);
document.getElementById('toggleArtifacts').addEventListener('click', toggleArtifacts);
document.querySelectorAll('#languageSwitch [data-locale]').forEach((button) => {
  button.addEventListener('click', () => applyLocale(button.dataset.locale));
});
window.addEventListener('resize', resize);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') clearSelection();
});

resize();
resetView(false);
animate();

function createStages() {
  for (const stage of data.stages) {
    const phase = phaseById.get(stage.phase);
    const position = stagePositions.get(stage.id);
    const geometry = new THREE.BoxGeometry(8, 8, 8, 2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: phase.color,
      emissive: phase.color,
      emissiveIntensity: 0.16,
      roughness: 0.34,
      metalness: 0.16,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.userData = { type: 'stage', id: stage.id, baseScale: 1, baseEmissive: 0.16 };
    scene.add(mesh);
    registerObject('stage', stage.id, mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42 }),
    );
    mesh.add(edges);

    const roleBadges = [];
    const roleBadgeSprites = [];
    const agentRole = stage.checkRole === 'independent'
      ? { label: 'AI REVIEW', color: '#7ed6e6', width: 126 }
      : stage.checkRole === 'primary'
        ? { label: 'AI CHECK', color: '#7ed6e6', width: 112 }
        : stage.number !== 'B' && stage.number !== 8
          ? { label: 'AI', color: '#65bdf7', width: 52 }
          : null;
    if (agentRole) roleBadges.push(agentRole);
    if (stage.checkRole === 'peer') {
      roleBadges.push({ label: 'AI REVIEW', color: '#7ed6e6', width: 126 });
    }

    if (stage.ownerGate) {
      roleBadges.push({ label: 'HUMAN', color: '#f0a83a', width: 90 });
    }

    if (stage.conditionalOwner) {
      roleBadges.push({ label: 'HUMAN?', color: '#d6a85c', width: 104 });
    }

    roleBadges.forEach((role, index) => {
      const badge = makeStatusBadge(role.label, role.color, role.width);
      const offset = (index - (roleBadges.length - 1) / 2) * 4.4;
      badge.position.set(position.x + offset, position.y + 1.7, position.z + 4.6);
      badge.userData.decorative = true;
      badge.userData.stageId = stage.id;
      scene.add(badge);
      roleBadgeSprites.push(badge);
    });

    let checkShell = null;
    if (stage.checkRole !== 'none') {
      const primaryCheck = stage.checkRole === 'primary';
      const shellMaterial = primaryCheck
        ? new THREE.LineDashedMaterial({ color: 0x7ed6e6, transparent: true, opacity: 0.9, dashSize: 0.9, gapSize: 0.55 })
        : new THREE.LineBasicMaterial({ color: 0x7ed6e6, transparent: true, opacity: 0.9 });
      checkShell = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(9.6, 9.6, 9.6)),
        shellMaterial,
      );
      if (primaryCheck) checkShell.computeLineDistances();
      checkShell.userData.decorative = true;
      mesh.add(checkShell);
    }

    const prefix = stage.number === 'B' ? 'B' : String(stage.number).padStart(2, '0');
    const label = makeTextSprite([`${prefix} · ${stage.title}`], {
      size: 20,
      weight: 600,
      color: '#f3f8fd',
      width: 420,
      scale: 0.064,
    });
    label.position.set(position.x, position.y + 8.2, position.z);
    label.userData.basePosition = label.position.clone();
    label.userData.baseScale = label.scale.clone();
    scene.add(label);
    stageLabelById.set(stage.id, label);
    stageVisualsById.set(stage.id, {
      mesh,
      edges,
      label,
      roleBadgeSprites,
      checkShell,
    });
  }
}

function createArtifacts() {
  const references = new Map();
  for (const stage of data.stages) {
    for (const artifactId of stage.artifacts) {
      if (!references.has(artifactId)) references.set(artifactId, []);
      references.get(artifactId).push(stage.id);
    }
  }

  const ownedCounts = new Map();
  for (const [artifactId, stageIds] of references) {
    const ownerStageId = data.stages.find((stage) => stage.outputs.includes(artifactId))?.id || stageIds[0];
    ownedCounts.set(ownerStageId, (ownedCounts.get(ownerStageId) || 0) + 1);
  }
  const ownedIndex = new Map();

  for (const artifact of data.artifacts) {
    const stageIds = references.get(artifact.id) || [];
    if (!stageIds.length) continue;
    const ownerStageId = data.stages.find((stage) => stage.outputs.includes(artifact.id))?.id || stageIds[0];
    const ownerStage = stageById.get(ownerStageId);
    const origin = stagePositions.get(ownerStageId);
    const count = ownedCounts.get(ownerStageId);
    const index = ownedIndex.get(ownerStageId) || 0;
    ownedIndex.set(ownerStageId, index + 1);
    const artifactsPerRow = 4;
    const artifactRow = Math.floor(index / artifactsPerRow);
    const artifactsInRow = Math.min(artifactsPerRow, count - artifactRow * artifactsPerRow);
    const artifactColumn = index % artifactsPerRow;
    const position = new THREE.Vector3(
      origin.x + (artifactColumn - (artifactsInRow - 1) / 2) * 5.2,
      origin.y + 11 + artifactRow * 4.5,
      origin.z,
    );
    const geometry = new THREE.IcosahedronGeometry(1.72, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
      fog: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    applyArtifactSurface(mesh, defaultArtifactSurface);
    mesh.position.copy(position);
    mesh.userData = {
      type: 'artifact',
      id: artifact.id,
      baseScale: 1,
      baseSurface: defaultArtifactSurface,
      basePosition: position.clone(),
    };
    artifactGroup.add(mesh);
    registerObject('artifact', artifact.id, mesh);

    const label = makeArtifactBadge(artifact.label, '#9bb4c9');
    label.position.set(position.x, position.y + 2.8, position.z);
    label.userData.type = 'artifact';
    label.userData.id = artifact.id;
    label.userData.basePosition = label.position.clone();
    label.visible = false;
    artifactGroup.add(label);
    pickable.push(label);
    artifactLabelById.set(artifact.id, label);
  }
}

function createGates() {
  const references = new Map();
  for (const stage of data.stages) {
    for (const gateId of stage.gates) {
      if (!references.has(gateId)) references.set(gateId, []);
      references.get(gateId).push(stage.id);
    }
  }

  for (const gate of data.gates) {
    const stageIds = references.get(gate.id) || [];
    if (!stageIds.length) continue;
    const positions = stageIds.map((id) => stagePositions.get(id));
    const center = positions.reduce((sum, position) => sum.add(position), new THREE.Vector3()).divideScalar(positions.length);
    center.y = -0.3;
    center.x += 11.5;
    // A flat checkpoint token is deliberately unlike both stage cubes and artifact polyhedra.
    const geometry = new THREE.CylinderGeometry(2.8, 2.8, 0.9, 8, 1, false);
    const material = new THREE.MeshStandardMaterial({
      color: 0xf2c46f,
      emissive: 0xb56f12,
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.35,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(center);
    mesh.rotation.x = Math.PI / 2;
    mesh.userData = { type: 'gate', id: gate.id, baseScale: 1, baseEmissive: 0.3 };
    gateGroup.add(mesh);
    registerObject('gate', gate.id, mesh);

    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0xfff0c9, transparent: true, opacity: 0.92 }),
    );
    edge.userData.decorative = true;
    mesh.add(edge);

    const glyph = makeGateGlyph();
    glyph.position.set(center.x, center.y + 0.1, center.z + 0.6);
    glyph.userData.decorative = true;
    gateGroup.add(glyph);
    for (const position of positions) gateGroup.add(makeLine(position, center, '#f2c46f', 0.34));
  }
}

function drawSequence() {
  const sequenceColor = '#9dc4e2';
  for (let index = 0; index < data.stages.length - 1; index += 1) {
    const from = stagePositions.get(data.stages[index].id);
    const to = stagePositions.get(data.stages[index + 1].id);
    scene.add(makeSequenceLine(from, to, sequenceColor));
    const direction = new THREE.Vector3().subVectors(to, from).normalize();
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.85, 2.4, 12),
      new THREE.MeshBasicMaterial({ color: sequenceColor, transparent: true, opacity: 0.78 }),
    );
    cone.position.copy(to).addScaledVector(direction, -5.6);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    scene.add(cone);
  }
}

function createDeliveryCycle() {
  const coding = phaseBounds.get('coding');
  const delivery = phaseBounds.get('delivery');
  if (!coding || !delivery) return;

  const padding = 6.5;
  const platformHalfWidth = 19.5;
  const codingPhaseIndex = phaseById.get('coding').index;
  const previousPhase = data.phases[codingPhaseIndex - 1];
  const previous = previousPhase ? phaseBounds.get(previousPhase.id) : null;
  const codingLeftEdge = coding.x - platformHalfWidth;
  const previousRightEdge = previous ? previous.x + platformHalfWidth : codingLeftEdge - padding * 2;
  const minX = (previousRightEdge + codingLeftEdge) / 2;
  const maxX = Math.max(coding.x, delivery.x) + 19.5 + padding;
  const minZ = Math.min(coding.z - coding.depth / 2, delivery.z - delivery.depth / 2) - padding;
  const maxZ = Math.max(coding.z + coding.depth / 2, delivery.z + delivery.depth / 2) + padding;
  const y = -4.35;
  const points = roundedFloorLoop(minX, maxX, minZ, maxZ, 8, y);
  const closedPoints = [...points, points[0].clone()];
  const color = 0x62d2b0;
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(closedPoints),
    new THREE.LineDashedMaterial({
      color,
      dashSize: 2.2,
      gapSize: 1.35,
      transparent: true,
      opacity: 0.78,
      depthTest: true,
    }),
  );
  line.computeLineDistances();
  line.renderOrder = 4;
  deliveryCycleGroup.add(line);

  [0.18, 0.68].forEach((progress) => {
    const pointIndex = Math.floor(progress * points.length) % points.length;
    const previous = points[(pointIndex - 1 + points.length) % points.length];
    const current = points[pointIndex];
    const next = points[(pointIndex + 1) % points.length];
    const tangent = next.clone().sub(previous).normalize();
    const arrowHead = new THREE.Mesh(
      new THREE.ConeGeometry(0.72, 2.2, 10),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthTest: true }),
    );
    arrowHead.position.copy(current).addScaledVector(tangent, -0.3);
    arrowHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    arrowHead.renderOrder = 5;
    deliveryCycleGroup.add(arrowHead);
  });
}

function roundedFloorLoop(minX, maxX, minZ, maxZ, radius, y) {
  const points = [];
  const corners = [
    { x: maxX - radius, z: minZ + radius, start: -Math.PI / 2 },
    { x: maxX - radius, z: maxZ - radius, start: 0 },
    { x: minX + radius, z: maxZ - radius, start: Math.PI / 2 },
    { x: minX + radius, z: minZ + radius, start: Math.PI },
  ];
  for (const corner of corners) {
    for (let step = 0; step <= 12; step += 1) {
      const angle = corner.start + (step / 12) * (Math.PI / 2);
      points.push(new THREE.Vector3(
        corner.x + Math.cos(angle) * radius,
        y,
        corner.z + Math.sin(angle) * radius,
      ));
    }
  }
  return points;
}

function makeSequenceLine(from, to, color) {
  const direction = new THREE.Vector3().subVectors(to, from);
  const length = direction.length();
  const line = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, length, 8),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.78 }),
  );
  line.position.copy(from).add(to).multiplyScalar(0.5);
  line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return line;
}

function makeLine(from, to, color, opacity) {
  const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

function makeTextSprite(lines, options = {}) {
  const width = options.width || 360;
  const size = options.size || 22;
  const subSize = options.subSize || Math.max(12, size - 7);
  const height = lines.length > 1 ? 74 : 48;
  const textCanvas = document.createElement('canvas');
  textCanvas.width = width;
  textCanvas.height = height;
  const context = textCanvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = 'rgba(0,0,0,.9)';
  context.shadowBlur = 8;
  const weight = options.weight || 700;
  context.font = fitCanvasFont(context, lines[0], weight, size, width - 20);
  context.fillStyle = options.color || '#eef6ff';
  context.fillText(lines[0], width / 2, lines.length > 1 ? 25 : height / 2);
  if (lines[1]) {
    context.font = fitCanvasFont(context, lines[1], 600, subSize, width - 20);
    context.fillStyle = options.subColor || '#9bb8d0';
    context.fillText(lines[1], width / 2, 52);
  }
  const texture = new THREE.CanvasTexture(textCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: options.depthTest ?? true,
    depthWrite: false,
    fog: options.fog ?? true,
  });
  const sprite = new THREE.Sprite(material);
  const scale = options.scale || 0.055;
  sprite.scale.set(width * scale, height * scale, 1);
  return sprite;
}

function fitCanvasFont(context, text, weight, requestedSize, maxWidth) {
  let size = requestedSize;
  context.font = `${weight} ${size}px "Segoe UI", sans-serif`;
  while (size > 12 && context.measureText(text).width > maxWidth) {
    size -= 1;
    context.font = `${weight} ${size}px "Segoe UI", sans-serif`;
  }
  return context.font;
}

function makeArtifactBadge(value, color) {
  const { width, height } = artifactBadgeDimensions(value);
  const texture = makeArtifactBadgeTexture(value, color, width, height, 15, 600);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.userData.baseLabelScale = new THREE.Vector2(width * 0.047, height * 0.047);
  sprite.scale.set(sprite.userData.baseLabelScale.x, sprite.userData.baseLabelScale.y, 1);
  sprite.renderOrder = 20;
  return sprite;
}

function makeStatusBadge(value, color, width) {
  const height = 42;
  const texture = makeArtifactBadgeTexture(value, color, width, height, 21, 600);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(width * 0.035, height * 0.035, 1);
  sprite.renderOrder = 22;
  return sprite;
}

function makeGateGlyph() {
  const width = 64;
  const height = 64;
  const textCanvas = document.createElement('canvas');
  textCanvas.width = width;
  textCanvas.height = height;
  const context = textCanvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#201405';
  context.font = '800 34px "Segoe UI", sans-serif';
  context.fillText('G', width / 2, height / 2 + 1);
  const texture = new THREE.CanvasTexture(textCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3.2, 3.2, 1);
  sprite.renderOrder = 21;
  return sprite;
}

function artifactBadgeDimensions(value) {
  return {
    width: THREE.MathUtils.clamp(Math.ceil(String(value).length * 7.8 + 34), 112, 286),
    height: 42,
  };
}

function makeArtifactBadgeTexture(value, color, width, height, fontSize, fontWeight = 700) {
  const textCanvas = document.createElement('canvas');
  textCanvas.width = width;
  textCanvas.height = height;
  const context = textCanvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.fillStyle = 'rgba(5, 14, 25, .9)';
  context.strokeStyle = color;
  context.lineWidth = 2;
  roundedRect(context, 2, 2, width - 4, height - 4, 10);
  context.fill();
  context.stroke();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#edf7ff';
  context.font = `${fontWeight} ${fontSize}px "Segoe UI", sans-serif`;
  context.fillText(value, width / 2, height / 2);
  const texture = new THREE.CanvasTexture(textCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function updateArtifactBadge(label, value, color, role) {
  if (label.userData.flowRole === role) return;
  const previous = label.material.map;
  const { width, height } = artifactBadgeDimensions(value);
  label.material.map = makeArtifactBadgeTexture(value, color, width, height, 15, 600);
  label.material.needsUpdate = true;
  label.userData.flowRole = role;
  label.userData.baseLabelScale.set(width * 0.047, height * 0.047);
  label.scale.set(label.userData.baseLabelScale.x, label.userData.baseLabelScale.y, 1);
  previous.dispose();
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function registerObject(type, id, mesh) {
  objectByKey.set(`${type}:${id}`, mesh);
  pickable.push(mesh);
}

function createPhaseNavigation() {
  const nav = document.getElementById('phaseNav');
  nav.replaceChildren();
  for (const phase of data.phases) {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.setProperty('--phase-color', phase.color);
    button.innerHTML = `<i></i><span>${escapeHtml(phase.label)}</span><small>${escapeHtml(phase.range)}</small>`;
    button.addEventListener('click', () => focusPhase(phase.id));
    button.dataset.phase = phase.id;
    nav.appendChild(button);
  }
}

function applyLocale(nextLocale) {
  if (!['en', 'ru'].includes(nextLocale) || nextLocale === locale) return;
  locale = nextLocale;
  try {
    localStorage.setItem('process-canvas-locale', locale);
  } catch {
    // The language still changes for this session when storage is unavailable.
  }
  data = localizeData(baseData, locale === 'ru' ? russian : null);
  refreshDataIndexes();
  updateFlowLabels();
  applyStaticTranslations();
  createPhaseNavigation();
  refreshSceneLabels();
  if (selected) renderDetails(selected.userData.type, selected.userData.id);
}

function refreshDataIndexes() {
  phaseById.clear();
  data.phases.forEach((phase, index) => phaseById.set(phase.id, { ...phase, index }));
  stageById.clear();
  data.stages.forEach((stage) => stageById.set(stage.id, stage));
  artifactById.clear();
  data.artifacts.forEach((artifact) => artifactById.set(artifact.id, artifact));
  gateById.clear();
  data.gates.forEach((gate) => gateById.set(gate.id, gate));
}

function updateFlowLabels() {
  artifactFlow.input.label = tr('input');
  artifactFlow.output.label = tr('output');
  artifactFlow.updated.label = tr('updated');
}

function applyStaticTranslations() {
  const setText = (id, key) => { document.getElementById(id).textContent = tr(key); };
  document.documentElement.lang = locale;
  document.title = locale === 'ru'
    ? 'Legacy Modernization Starter · Карта процесса'
    : 'Legacy Modernization Starter · Process Canvas';
  setText('introSubtitle', 'introSubtitle');
  setText('summaryCheckpoints', 'checkpoints');
  setText('summaryPhases', 'phases');
  setText('summaryControls', 'independentControls');
  setText('summaryOwnerGates', 'ownerGates');
  setText('summaryConditional', 'conditional');
  setText('phaseColorsLabel', 'phaseColors');
  setText('objectShapesLabel', 'objectShapes');
  setText('shapeStage', 'stage');
  setText('shapeArtifact', 'artifact');
  setText('shapeGate', 'gate');
  setText('shapeReturn', 'selectedReturn');
  setText('shapeCycle', 'deliveryCycle');
  setText('artifactRoleLabel', 'selectedArtifactRole');
  setText('flowInput', 'input');
  setText('flowOutput', 'output');
  setText('flowUpdated', 'updated');
  setText('whoActsLabel', 'whoActs');
  setText('actorAgent', 'agentWork');
  setText('actorReview', 'independentAgentCheck');
  setText('actorCheck', 'agentVerification');
  document.getElementById('reviewLegend').title = tr('independentFrameHint');
  document.getElementById('checkLegend').title = tr('primaryFrameHint');
  document.getElementById('frameMeaning').textContent = tr('frameMeaning');
  setText('actorHuman', 'humanReview');
  setText('footerHelp', 'footerHelp');

  canvas.setAttribute('aria-label', tr('canvasLabel'));
  document.querySelector('.summary').setAttribute('aria-label', tr('processSummary'));
  document.querySelector('.legend-panel').setAttribute('aria-label', tr('canvasLegend'));
  document.getElementById('phaseNav').setAttribute('aria-label', tr('processPhases'));
  document.querySelector('.scene-key').setAttribute('aria-label', tr('objectShapes'));
  document.querySelector('.artifact-flow-legend').setAttribute('aria-label', tr('artifactColors'));
  document.querySelector('.role-key').setAttribute('aria-label', tr('processParticipants'));
  document.querySelector('.view-tools').setAttribute('aria-label', tr('mapControls'));
  document.getElementById('languageSwitch').setAttribute('aria-label', locale === 'ru' ? 'Язык' : 'Language');

  const reset = document.getElementById('resetView');
  reset.title = tr('showCompleteProcess');
  reset.setAttribute('aria-label', tr('showCompleteProcess'));
  const dependencyView = document.getElementById('dependencyView');
  dependencyView.textContent = tr('dependencies');
  dependencyView.href = '../feature-canvas/?lang=' + locale;
  const artifactToggle = document.getElementById('toggleArtifacts');
  artifactToggle.textContent = tr('artifacts');
  artifactToggle.title = tr('toggleArtifacts');
  document.getElementById('detailsBack').setAttribute('aria-label', tr('backToStage'));
  document.getElementById('closeDetails').setAttribute('aria-label', tr('closeDetails'));
  document.querySelectorAll('#languageSwitch [data-locale]').forEach((button) => {
    const active = button.dataset.locale === locale;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function refreshSceneLabels() {
  for (const phase of data.phases) {
    const label = phaseVisualsById.get(phase.id)?.label;
    if (!label) continue;
    updateTextSprite(label, [phase.label, phase.range], {
      ...phaseLabelStyle, subColor: phase.color,
    });
  }
  for (const stage of data.stages) {
    const label = stageLabelById.get(stage.id);
    if (!label) continue;
    const prefix = stage.number === 'B' ? 'B' : String(stage.number).padStart(2, '0');
    updateTextSprite(label, [`${prefix} · ${stage.title}`], {
      size: 20, weight: 600, color: '#f3f8fd', width: 420, scale: 0.064,
    });
    label.userData.baseScale = label.scale.clone();
  }
}

function updateTextSprite(sprite, lines, options) {
  const replacement = makeTextSprite(lines, options);
  const previousMap = sprite.material.map;
  sprite.material.map = replacement.material.map;
  sprite.material.needsUpdate = true;
  sprite.scale.copy(replacement.scale);
  replacement.material.dispose();
  previousMap.dispose();
}

function beginCanvasGesture(event) {
  if (activeCanvasPointers.size === 0) {
    canvasGesture = { x: event.clientX, y: event.clientY, dragged: false };
  } else {
    canvasGesture.dragged = true;
  }
  activeCanvasPointers.add(event.pointerId);
}

function endCanvasGesture(event) {
  if (!activeCanvasPointers.delete(event.pointerId)) return;
  if (event.type !== 'pointerup') canvasGesture.dragged = true;
}

function onPointerMove(event) {
  if (activeCanvasPointers.has(event.pointerId)
      && Math.hypot(event.clientX - canvasGesture.x, event.clientY - canvasGesture.y) > clickMovementTolerance) {
    canvasGesture.dragged = true;
  }
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = firstVisibleHit();
  const hoverTarget = hit
    ? objectByKey.get(`${hit.object.userData.type}:${hit.object.userData.id}`)
    : null;
  setHover(hoverTarget);
  if (!hit) return;
  const item = resolveItem(hit.object.userData.type, hit.object.userData.id);
  if (hit.object.userData.type === 'artifact') {
    const flow = artifactFlow[artifactFlowById.get(item.id)];
    tooltip.textContent = flow ? `${flow.label} · ${item.label}` : item.label;
  } else {
    tooltip.textContent = item.label || `${item.number} · ${item.title}`;
  }
  tooltip.style.left = `${Math.min(event.clientX + 12, window.innerWidth - 290)}px`;
  tooltip.style.top = `${Math.min(event.clientY + 12, window.innerHeight - 52)}px`;
  tooltip.classList.add('visible');
}

function onClick(event) {
  // Browsers also emit click/dblclick after a drag. Camera gestures must not
  // replace a selection or cancel its pending description.
  if (canvasGesture?.dragged || event.detail > 1) return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = firstVisibleHit();
  if (!hit) return;
  const { type, id } = hit.object.userData;
  // Let a double-click reach the cube before a description panel can cover it.
  if (type === 'stage') {
    selectItem(type, id, { openDetails: false });
    pendingStageClick = setTimeout(() => {
      pendingStageClick = null;
      if (selected?.userData.type === type && selected.userData.id === id) renderDetails(type, id);
    }, 320);
  }
  else selectItem(type, id);
}

function onDoubleClick(event) {
  if (canvasGesture?.dragged) return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  // Selection can place an artifact rail under the pointer between clicks.
  // Keep focusing the cube hit by the first click, provided it is still under it.
  const selectedCubeHit = selected?.userData.type === 'stage'
    ? raycaster.intersectObject(selected, false)[0]
    : null;
  const hit = selectedCubeHit || firstVisibleHit();
  if (hit?.object.userData.type !== 'stage') return;
  event.preventDefault();
  const id = hit.object.userData.id;
  selectItem('stage', id, { openDetails: false });
  clearHover();
  focusStage(id);
}

function firstVisibleHit() {
  return raycaster.intersectObjects(pickable, false).find((hit) => {
    let object = hit.object;
    while (object) {
      if (!object.visible) return false;
      object = object.parent;
    }
    return true;
  });
}

function setHover(mesh) {
  if (hovered === mesh) return;
  if (hovered && hovered !== selected) restoreObject(hovered);
  hovered = mesh;
  if (!mesh) {
    tooltip.classList.remove('visible');
    canvas.style.cursor = 'grab';
    return;
  }
  canvas.style.cursor = 'pointer';
  if (mesh !== selected) emphasizeObject(mesh, 1.16);
}

function clearHover() {
  setHover(null);
  tooltip.classList.remove('visible');
}

function selectItem(type, id, { backStageId = null, openDetails = true } = {}) {
  clearTimeout(pendingStageClick);
  const mesh = objectByKey.get(`${type}:${id}`);
  if (!mesh) return;
  const backStage = backStageId ? stageById.get(backStageId) : null;
  detailsBackStageId = type === 'artifact' && (backStage?.artifacts.includes(id) || (backStage && id === 'error-prevention'))
    ? backStage.id
    : null;
  if (selected && selected !== mesh) restoreObject(selected);
  selected = mesh;
  selected.userData.selectionStartedAt = performance.now();
  emphasizeObject(mesh, prefersReducedMotion.matches ? 1.22 : 1.18);
  const item = resolveItem(type, id);
  const contextStage = type === 'stage' ? item : type === 'artifact' ? activeArtifactContextStage(id) : null;
  const phase = contextStage ? phaseById.get(contextStage.phase) : findPhaseForItem(type, id);
  if (phase) setActivePhase(phase.id);
  if (contextStage) {
    activeStageId = contextStage.id;
    showArtifactFlow(contextStage);
  } else {
    activeStageId = null;
    showArtifactFlow(null);
  }
  setStageFocus(contextStage?.id || null);
  if (openDetails) renderDetails(type, id);
  else details.classList.remove('open');
}

function clearSelection() {
  clearTimeout(pendingStageClick);
  if (selected) restoreObject(selected);
  selected = null;
  activeStageId = null;
  detailsBackStageId = null;
  showArtifactFlow(null);
  setStageFocus(null);
  details.classList.remove('open');
  details.classList.remove('has-back');
  document.getElementById('detailsBack').hidden = true;
}

function returnToDetailsStage() {
  if (!detailsBackStageId) return;
  const stageId = detailsBackStageId;
  selectItem('stage', stageId);
}

function setStageFocus(stageId) {
  const selectedPhaseId = stageId ? stageById.get(stageId)?.phase : null;

  for (const [candidateId, visuals] of stageVisualsById) {
    const isFocused = !stageId || candidateId === stageId;
    const opacity = isFocused ? 1 : 0.18;
    const labelOpacity = isFocused ? 1 : 0.42;
    setVisualOpacity(visuals.mesh, opacity);
    setVisualOpacity(visuals.edges, opacity);
    setVisualOpacity(visuals.label, labelOpacity);
    setVisualOpacity(visuals.checkShell, opacity);
    visuals.roleBadgeSprites.forEach((badge) => setVisualOpacity(badge, opacity));
  }

  for (const [phaseId, visuals] of phaseVisualsById) {
    const opacity = !selectedPhaseId || phaseId === selectedPhaseId ? 1 : 0.42;
    setVisualOpacity(visuals.platform, opacity);
    setVisualOpacity(visuals.border, opacity);
    setVisualOpacity(visuals.label, opacity);
  }

  const cycleOpacity = !selectedPhaseId || selectedPhaseId === 'coding' || selectedPhaseId === 'delivery' ? 1 : 0.28;
  deliveryCycleGroup.traverse((object) => setVisualOpacity(object, cycleOpacity));
}

function setVisualOpacity(object, factor) {
  if (!object?.material) return;
  const materials = Array.isArray(object.material) ? object.material : [object.material];
  materials.forEach((material) => {
    if (material.userData.baseOpacity === undefined) material.userData.baseOpacity = material.opacity;
    if (material.userData.baseTransparent === undefined) material.userData.baseTransparent = material.transparent;
    if (material.userData.baseDepthWrite === undefined) material.userData.baseDepthWrite = material.depthWrite;
    material.opacity = material.userData.baseOpacity * factor;
    material.transparent = factor < 1 || material.userData.baseTransparent;
    material.depthWrite = factor < 1 ? false : material.userData.baseDepthWrite;
    material.needsUpdate = true;
  });
}

function emphasizeObject(mesh, scale) {
  mesh.scale.setScalar(scale);
  if (mesh.material && 'emissiveIntensity' in mesh.material) mesh.material.emissiveIntensity = 0.72;
}

function restoreObject(mesh) {
  mesh.scale.setScalar(mesh.userData.baseScale || 1);
  delete mesh.userData.selectionStartedAt;
  if (mesh.material && 'emissiveIntensity' in mesh.material) {
    mesh.material.emissiveIntensity = mesh.userData.baseEmissive || 0.16;
  }
}

function updateSelectedPulse(time) {
  if (!selected || prefersReducedMotion.matches) return;
  const elapsed = Math.max(0, time - (selected.userData.selectionStartedAt || time));
  const cycle = (elapsed % 2000) / 2000;
  const firstBeat = Math.exp(-Math.pow((cycle - 0.11) / 0.055, 2));
  const secondBeat = 0.58 * Math.exp(-Math.pow((cycle - 0.28) / 0.07, 2));
  const beat = firstBeat + secondBeat;
  selected.scale.setScalar(1.18 + beat * 0.13);
  if (selected.material && 'emissiveIntensity' in selected.material) {
    selected.material.emissiveIntensity = 0.54 + beat * 0.22;
  }
}

function resolveItem(type, id) {
  if (type === 'stage') return stageById.get(id);
  if (type === 'artifact') return artifactById.get(id);
  return gateById.get(id);
}

function renderDetails(type, id) {
  const item = resolveItem(type, id);
  const contextStage = type === 'stage' ? item : type === 'artifact' ? artifactContextStage(id) : null;
  const phase = contextStage ? phaseById.get(contextStage.phase) : findPhaseForItem(type, id);
  const currentFlow = type === 'artifact' ? artifactFlow[artifactFlowById.get(id)] : null;
  const backButton = document.getElementById('detailsBack');
  backButton.hidden = !detailsBackStageId;
  details.classList.toggle('has-back', Boolean(detailsBackStageId));
  details.style.setProperty('--selected-color', phase ? phase.color : '#7fc5ff');
  document.getElementById('detailsKind').textContent = type === 'stage'
    ? phase.label
    : type === 'artifact' ? `${currentFlow ? `${currentFlow.label}: ${tr('artifact')}` : tr('artifact')}` : tr('automatedDecisionGate');
  document.getElementById('detailsTitle').textContent = type === 'stage'
    ? `${item.number} · ${item.title}`
    : item.label;
  document.getElementById('detailsMeta').textContent = type === 'stage' ? item.actor : item.role;
  const detailsSummary = document.getElementById('detailsSummary');
  if (item.headline) {
    const supportingText = type === 'stage' ? item.summary : item.desc;
    detailsSummary.innerHTML = `<strong class="artifact-headline">${escapeHtml(item.headline)}</strong><span>${escapeHtml(supportingText)}</span>`;
  } else {
    detailsSummary.textContent = type === 'stage' ? item.summary : item.desc;
  }
  const body = document.getElementById('detailsBody');

  if (type === 'stage') {
    body.innerHTML = [
      item.assignment ? fact(tr('roleAssignment'), `<p>${escapeHtml(item.assignment[locale])}</p><a class="source-link" href="${data.repository}/blob/main/analysis/agent-roles.md" target="_blank" rel="noopener noreferrer">${escapeHtml(tr('openRoleContract'))}</a>`) : '',
      item.checkRole !== 'none' ? fact(tr('verificationResponsibility'), `<p>${escapeHtml(tr({ independent: 'independentCheckDuty', peer: 'peerCheckDuty', primary: 'primaryCheckDuty' }[item.checkRole]))}</p>`) : '',
      item.prevention ? fact(tr('errorPrevention'), `<p>${escapeHtml(item.prevention[locale])}</p>` + buttonList(['error-prevention'], 'artifact')) : '',
      fact(tr('startingPoint'), `<p>${escapeHtml(item.input)}</p>`),
      fact(tr('whatHappens'), `<ol>${item.actions.map((action) => `<li>${escapeHtml(action)}</li>`).join('')}</ol>`),
      fact(tr('exit'), `<p>${escapeHtml(item.exit)}</p>`),
      fact(tr('returnPath'), `<p>${escapeHtml(item.returns)}</p>`),
      reentryDetails(item),
      item.evidence ? fact(tr('whereEvidenceLives'), `<p>${escapeHtml(item.evidence)}</p>`) : '',
      item.example ? fact(tr('exampleUse'), `<p>${escapeHtml(item.example)}</p>`) : '',
      stageExampleReference(item),
      ...artifactFlowFacts(item),
      fact(tr('gates'), buttonList(item.gates, 'gate')),
      item.gateContract ? fact(tr('requiredEvidence'), `<p>${item.gateContract.checks.map(escapeHtml).join('; ')}</p><p>${escapeHtml(item.gateContract.requirements[locale])}</p>`) : '',
      item.completionContract ? fact(tr('finalCompletion'), `<p>${item.completionContract.checks.map(escapeHtml).join('; ')}</p><p>${escapeHtml(item.completionContract.requirements[locale])}</p>`) : '',
    ].join('');
    body.querySelectorAll('[data-select]').forEach((button) => {
      button.addEventListener('click', () => {
        const targetType = button.dataset.type;
        const navigation = targetType === 'artifact' ? { backStageId: item.id } : undefined;
        selectItem(targetType, button.dataset.select, navigation);
      });
    });
  } else if (type === 'artifact') {
    const lifecycleNames = { starter: tr('shipsWithStarter'), copied: tr('copiedByInitializer'), generated: tr('generatedByInitializer'), migration: tr('createdDuringMigration'), project: tr('projectSpecificOutput') };
    const sourceUrl = `${data.repository}/blob/main/${item.sourcePath.split('/').map(encodeURIComponent).join('/')}`;
    const example = item.xplannerExample;
    const responsibility = item.responsibility?.[locale] || item.responsibility?.en;
    const methodologyUrl = `${data.repository}/blob/main/analysis/migration_methodology.md`;
    const responsibilityUrl = id === 'error-prevention' ? `${data.repository}/blob/main/analysis/error-prevention.md` : item.creationStageId ? `${methodologyUrl}#${item.creationStageId}` : `${data.repository}/blob/main/MIGRATION.md`;
    const exampleUrl = example?.path && data.exampleLocalBase && location.hostname === '127.0.0.1'
      ? exampleFileUrl(example.path, example.fragment)
      : example?.url || (example?.path
      ? exampleFileUrl(example.path, example.fragment)
      : null);
    const exampleReference = example
      ? fact(tr('realXPlannerExample'), [
        example.path || example.label ? `<code class="path">${escapeHtml(example.path || example.label)}</code>` : '',
        example.note ? `<p class="reference-note">${escapeHtml(example.note)}</p>` : '',
        item.outputPath && example.path && example.path !== item.outputPath
          ? `<p class="reference-note">${escapeHtml(tr('historicFilename'))}</p>` : '',
        exampleUrl ? `<a class="source-link example-link" href="${exampleUrl}" target="_blank" rel="noopener">${escapeHtml(tr('openRealFile'))}</a>` : '',
      ].join(''))
      : '';
    body.innerHTML = [
      contextStage && id === 'error-prevention'
        ? fact(tr('roleInStage'), `<p>${escapeHtml(tr('stage'))} ${escapeHtml(contextStage.number)} · ${escapeHtml(contextStage.title)}</p><p>${escapeHtml(contextStage.prevention[locale])}</p>`)
        : contextStage && currentFlow
        ? fact(tr('roleInStage'), `<p><span class="flow-chip ${artifactFlowById.get(id)}">${escapeHtml(currentFlow.label)}</span> ${escapeHtml(tr('stage'))} ${escapeHtml(contextStage.number)} · ${escapeHtml(contextStage.title)}</p>`)
        : '',
      contextStage
        ? fact(tr('returnPathsFromSelectedStage'), `<p>${escapeHtml(contextStage.returns)}</p>`)
        : '',
      fact(tr('lifecycle'), `<p>${escapeHtml(lifecycleNames[item.lifecycle] || item.lifecycle)}</p>`),
      responsibility ? fact(tr('artifactResponsibility'), [
        `<p><strong>${escapeHtml(tr('initialCreator'))}:</strong> ${escapeHtml(responsibility.creator)}</p>`,
        `<p><strong>${escapeHtml(tr('maintainedBy'))}:</strong> ${escapeHtml(responsibility.maintainer)}</p>`,
        `<p><strong>${escapeHtml(tr('governingInstructions'))}:</strong> ${escapeHtml(responsibility.instructions)}</p>`,
        `<a class="source-link" href="${responsibilityUrl}" target="_blank" rel="noopener">${escapeHtml(tr('openStageInstructions'))}</a>`,
        contextStage && contextStage.id !== item.creationStageId
          ? `<a class="source-link" href="${methodologyUrl}#${contextStage.id}" target="_blank" rel="noopener">${escapeHtml(tr('selectedStageInstructions'))}</a>` : '',
      ].join('')) : '',
      item.relationship ? fact(item.relationship.title, `<p>${escapeHtml(item.relationship.text)}</p>`
        + (item.relationship.path ? `<a class="source-link" href="${escapeHtml(new URL(item.relationship.path, `${data.repository}/blob/main/`).href)}" target="_blank" rel="noopener">${escapeHtml(item.relationship.linkLabel)}</a>` : '')) : '',
      item.recordContract ? fact(item.recordContract[locale].title, `<ul>${item.recordContract[locale].fields.map(field => `<li>${escapeHtml(field)}</li>`).join('')}</ul><p>${escapeHtml(item.recordContract[locale].note)}</p>`) : '',
      fact(tr('whenAndHowUsed'), `<p>${escapeHtml(item.usage)}</p>`),
      fact(tr('exampleUse'), `<p>${escapeHtml(item.example)}</p>`),
      fact(tr('statusMeanings'), `<p>${escapeHtml(tr('statusMeaningsText'))}</p><a class="source-link" href="${data.repository}/blob/main/analysis/artifact-status-meanings.md" target="_blank" rel="noopener">${escapeHtml(tr('openStatusMeanings'))}</a><a class="source-link" href="${data.repository}/blob/main/analysis/artifact-reading-contract.md" target="_blank" rel="noopener">${escapeHtml(tr('openReadingContract'))}</a>`),
      fact(tr('starterReference'), [
        `<code class="path">${escapeHtml(item.sourcePath)}</code>`,
        `<a class="source-link" href="${sourceUrl}" target="_blank" rel="noopener">${escapeHtml(tr('openSourceTemplate'))}</a>`,
      ].join('')),
      item.outputPath ? fact(tr('newProjectOutput'), [
        `<code class="path">${escapeHtml(item.outputPath)}</code>`,
        `<p>${escapeHtml(item.projectOutput)}</p>`,
      ].join('')) : '',
      exampleReference,
    ].join('');
  } else {
    const stages = data.stages.filter((stage) => stage.gates.includes(id));
    const sourceUrl = `${data.repository}/blob/main/${item.sourcePath.split('/').map(encodeURIComponent).join('/')}`;
    const exampleUrl = item.xplannerPath
      ? exampleFileUrl(item.xplannerPath)
      : null;
    body.innerHTML = [
      gateCheckDetails(item),
      fact(tr('whenAndHowUsed'), `<p>${escapeHtml(item.usage)}</p>`),
      fact(tr('example'), `<p>${escapeHtml(item.example)}</p>`),
      fact(tr('usedAt'), buttonList(stages.map((stage) => stage.id), 'stage')),
      fact(tr('implementationReference'), [
        `<code class="path">${escapeHtml(item.sourcePath)}</code>`,
        `<a class="source-link" href="${sourceUrl}" target="_blank" rel="noopener">${escapeHtml(tr('openStarterReference'))}</a>`,
        exampleUrl ? `<a class="source-link example-link" href="${exampleUrl}" target="_blank" rel="noopener">${escapeHtml(tr('openRealReference'))}</a>` : '',
      ].join('')),
    ].join('');
    body.querySelectorAll('[data-select]').forEach((button) => {
      button.addEventListener('click', () => selectItem(button.dataset.type, button.dataset.select));
    });
  }
  details.scrollTop = 0;
  details.classList.add('open');
}

function fact(title, content) {
  return `<section class="fact"><h3>${escapeHtml(title)}</h3>${content}</section>`;
}

function gateCheckDetails(item) {
  const contract = item.reviewContract;
  if (!contract) return '';
  const labels = locale === 'ru'
    ? { automatic: 'Проверяет скрипт', review: 'Проверяет агент', decision: 'Решает владелец', record: 'Запись результата', delegated: 'Настроенная команда', related: 'Отдельная проверка' }
    : { automatic: 'Automatic check', review: 'Agent review', decision: 'Owner decision', record: 'Result record', delegated: 'Configured command', related: 'Separate check' };
  const inputs = contract.inputs.map(input => {
    const artifact = input.artifact ? artifactById.get(input.artifact) : null;
    const ref = input.reference || artifact?.sourcePath;
    const link = artifact
      ? buttonList([artifact.id], 'artifact')
      : `<a class="source-link" href="${data.repository}/blob/main/${ref.split('/').map(encodeURIComponent).join('/')}" target="_blank" rel="noopener">${escapeHtml(locale === 'ru' ? russian.referenceLabels?.[input.path] || input.path : input.path)}</a>`;
    return `<li class="gate-check"><strong>${escapeHtml(labels[input.mode])}</strong>${link}<p>${escapeHtml(input.description[locale])}</p></li>`;
  }).join('');
  return fact(locale === 'ru' ? 'Границы проверки' : 'Check boundary', `<p>${escapeHtml(contract.boundary[locale])}</p>`)
    + fact(locale === 'ru' ? 'Какие файлы и кто проверяет' : 'Files and who checks them', `<ul class="gate-checks">${inputs}</ul>`);
}

function exampleFileUrl(file, fragment = '') {
  const suffix = file.split('/').map(encodeURIComponent).join('/');
  const base = data.exampleLocalBase && location.hostname === '127.0.0.1'
    ? data.exampleLocalBase.replace(/\/$/, '') + '/' + suffix
    : data.exampleRepository + '/blob/' + (data.exampleRevisions?.[file] || data.exampleRevision) + '/' + suffix;
  return base + (fragment ? '#' + encodeURIComponent(fragment) : '');
}

function reentryDetails(stage) {
  if (!stage.reentry) return '';
  const entry = stage.reentry[locale] || stage.reentry.en;
  const instructionUrl = `${data.repository}/blob/main/${stage.reentry.instructionPath}`;
  const exampleUrl = exampleFileUrl(stage.reentry.examplePath);
  const sources = stage.reentry.sources.map(source => {
    const artifact = artifactById.get(source.artifactId);
    const url = `${data.repository}/blob/main/${artifact.sourcePath}`;
    const label = artifact.outputPath.replace(/^analysis\//, '');
    return `<li><a href="${url}" target="_blank" rel="noopener">${escapeHtml(label)}</a>: ${escapeHtml(source[locale] || source.en)}</li>`;
  }).join('');
  return `<details class="fact reentry-details"><summary>${escapeHtml(entry.title)}</summary>
    <p>${escapeHtml(entry.input)}</p>
    <ul class="reentry-sources">${sources}</ul>
    <ol>${entry.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
    <a class="source-link" href="${instructionUrl}" target="_blank" rel="noopener">${escapeHtml(tr('openStageInstructions'))}</a>
    <a class="source-link example-link" href="${exampleUrl}" target="_blank" rel="noopener">${escapeHtml(tr('openRealFile'))}</a>
  </details>`;
}

function stageExampleReference(stage) {
  if (!stage.xplannerExamples?.length) return '';
  const links = stage.xplannerExamples.map((example) => {
    const url = exampleFileUrl(example.path);
    return [
      `<code class="path">${escapeHtml(example.label)}: ${escapeHtml(example.path)}</code>`,
      `<a class="source-link example-link" href="${url}" target="_blank" rel="noopener">${escapeHtml(tr('openRealFile'))}</a>`,
    ].join('');
  }).join('');
  return fact(tr('realXPlannerTrail'), links);
}

function artifactFlowFacts(stage) {
  const inputs = new Set(stage.inputs);
  const outputs = new Set(stage.outputs);
  const delayed = stage.delayedInputs || [];
  const updated = stage.inputs.filter((id) => outputs.has(id) && !delayed.includes(id));
  const inputOnly = stage.inputs.filter((id) => !outputs.has(id) && !delayed.includes(id));
  const outputOnly = stage.outputs.filter((id) => !inputs.has(id));
  return [
    inputOnly.length ? fact(tr('inputArtifacts'), buttonList(inputOnly, 'artifact', stage)) : '',
    delayed.length ? fact(tr('delayedInputs'), buttonList(delayed, 'artifact', stage)) : '',
    updated.length ? fact(tr('updatedArtifacts'), buttonList(updated, 'artifact', stage)) : '',
    outputOnly.length ? fact(tr('outputArtifacts'), buttonList(outputOnly, 'artifact', stage)) : '',
  ].filter(Boolean);
}

function buttonList(ids, type, stageContext = null) {
  if (!ids.length) return `<p>${escapeHtml(tr('none'))}</p>`;
  return `<div class="link-list">${ids.map((id) => {
    const item = resolveItem(type, id);
    const label = type === 'stage' ? `${item.number} · ${item.title}` : item.label;
    const role = type === 'artifact' && stageContext ? artifactRole(stageContext, id) : null;
    const flow = artifactFlow[role];
    const prefix = type === 'artifact' && flow ? `<strong class="artifact-code ${role || ''}">${flow.short}</strong>` : '';
    return `<button type="button" data-select="${escapeHtml(id)}" data-type="${type}">${prefix}<span>${escapeHtml(label)}</span></button>`;
  }).join('')}</div>`;
}

function findPhaseForItem(type, id) {
  const stage = data.stages.find((candidate) => (type === 'artifact' ? candidate.artifacts : candidate.gates).includes(id));
  return stage ? phaseById.get(stage.phase) : null;
}

function focusPhase(phaseId) {
  const bounds = phaseBounds.get(phaseId);
  const target = new THREE.Vector3(bounds.x, 5, bounds.z);
  const distance = Math.max(65, bounds.depth * 1.55);
  startCameraTween(new THREE.Vector3(bounds.x, 48, distance), target, 650);
  setActivePhase(phaseId);
  const firstStage = data.stages.find((stage) => stage.phase === phaseId);
  if (firstStage) selectItem('stage', firstStage.id);
}

function focusStage(stageId) {
  const target = stagePositions.get(stageId)?.clone();
  if (!target) return;
  // Preserve world Y-up and a repeatable oblique view, independent of the previous orbit.
  const portraitScale = Math.max(1, camera.aspect ? 1 / camera.aspect : 1);
  const position = target.clone().add(new THREE.Vector3(-55, 75, 90).multiplyScalar(portraitScale));
  startCameraTween(position, target, 750);
}

function resetView(animateView = true) {
  setActivePhase(null);
  clearSelection();
  const overview = topDownOverview();
  const overviewDistance = overview.position.distanceTo(overview.target);
  controls.maxDistance = Math.max(720, overviewDistance * 1.1);
  camera.far = Math.max(900, controls.maxDistance * 2);
  camera.updateProjectionMatrix();
  if (animateView) startCameraTween(overview.position, overview.target, 850);
  else {
    camera.position.copy(overview.position);
    controls.target.copy(overview.target);
  }
}

function topDownOverview() {
  const platformHalfWidth = 19.5;
  const bounds = [...phaseBounds.values()].reduce((result, phase) => ({
    minX: Math.min(result.minX, phase.x - platformHalfWidth),
    maxX: Math.max(result.maxX, phase.x + platformHalfWidth),
    minZ: Math.min(result.minZ, phase.z - phase.depth / 2),
    maxZ: Math.max(result.maxZ, phase.z + phase.depth / 2),
  }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });

  // The delivery loop extends slightly beyond its two phase platforms.
  const delivery = phaseBounds.get('delivery');
  if (delivery) {
    bounds.maxX = Math.max(bounds.maxX, delivery.x + platformHalfWidth + 6.5);
    bounds.maxZ = Math.max(bounds.maxZ, delivery.z + delivery.depth / 2 + 6.5);
  }

  const viewportWidth = Math.max(window.innerWidth, 1);
  const viewportHeight = Math.max(window.innerHeight, 1);
  const topHud = Math.max(
    ...[document.querySelector('.intro'), document.querySelector('.legend-panel')]
      .filter(Boolean)
      .map((element) => element.getBoundingClientRect().bottom),
    0,
  );
  const footerTop = document.querySelector('.footer')?.getBoundingClientRect().top || viewportHeight;
  const usableTop = Math.min(topHud + 18, viewportHeight * 0.46);
  const usableBottom = Math.max(usableTop + 120, footerTop - 18);
  const usableWidth = Math.max(240, viewportWidth - 48);
  const usableHeight = Math.max(180, usableBottom - usableTop);
  const fitPadding = 1.18;
  const width = (bounds.maxX - bounds.minX) * fitPadding;
  const depth = (bounds.maxZ - bounds.minZ) * fitPadding;
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
  const distanceForWidth = width * viewportWidth / (2 * Math.tan(horizontalFov / 2) * usableWidth);
  const distanceForDepth = depth * viewportHeight / (2 * Math.tan(verticalFov / 2) * usableHeight);
  const distance = Math.max(150, distanceForWidth, distanceForDepth);
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerZ = (bounds.minZ + bounds.maxZ) / 2;
  const usableCenterOffset = ((usableTop + usableBottom) / 2 - viewportHeight / 2) / viewportHeight;
  const visibleWorldHeight = 2 * distance * Math.tan(verticalFov / 2);
  const target = new THREE.Vector3(
    centerX,
    8,
    centerZ - usableCenterOffset * visibleWorldHeight,
  );
  return {
    target,
    // A sub-pixel forward offset fixes screen-up at the top-down pole without changing world Y-up.
    position: new THREE.Vector3(target.x, target.y + distance, target.z + distance * 0.0001),
  };
}

function updatePhaseLabelPositions() {
  const cameraUp = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
  const left = new THREE.Vector3();
  const right = new THREE.Vector3();
  for (const { platform, label } of phaseVisualsById.values()) {
    const { width, height, depth } = platform.geometry.parameters;
    const platformTop = platform.position.y + height / 2;
    const leadingEdge = platform.position.z - depth / 2;
    left.set(platform.position.x - width / 2, platformTop, leadingEdge).applyMatrix4(camera.matrixWorldInverse);
    right.set(platform.position.x + width / 2, platformTop, leadingEdge).applyMatrix4(camera.matrixWorldInverse);
    label.visible = left.z < -camera.near && right.z < -camera.near;
    if (!label.visible) continue;

    // Center the heading over the projected edge, not a raised world point:
    // elevation otherwise introduces lateral parallax after orbit, pan or zoom.
    const labelDepth = (left.z + right.z) / 2;
    const lift = (phaseLabelHeight - platformTop) * Math.abs(cameraUp.y)
      + phaseLabelGroundGap * Math.hypot(cameraUp.x, cameraUp.z);
    label.position.set(
      (left.x / left.z + right.x / right.z) * labelDepth / 2,
      (left.y / left.z + right.y / right.z) * labelDepth / 2 + lift,
      labelDepth,
    ).applyMatrix4(camera.matrixWorld);
  }
}

function setActivePhase(phaseId) {
  document.querySelectorAll('#phaseNav button').forEach((button) => {
    button.classList.toggle('active', button.dataset.phase === phaseId);
  });
}

function showArtifactFlow(stage) {
  clearArtifactFlowArrows();
  showReturnFlow(stage);
  artifactFlowById.clear();
  for (const [artifactId, label] of artifactLabelById) {
    const role = stage ? artifactRole(stage, artifactId) : null;
    const flow = artifactFlow[role];
    const mesh = objectByKey.get(`artifact:${artifactId}`);
    mesh.position.copy(mesh.userData.basePosition);
    label.position.copy(label.userData.basePosition);
    mesh.visible = Boolean(flow);
    label.visible = Boolean(flow);
    if (flow) {
      artifactFlowById.set(artifactId, role);
      updateArtifactBadge(label, `${flow.short} ${artifactById.get(artifactId).label}`, flow.color, role);
      applyArtifactSurface(mesh, flow);
    } else {
      applyArtifactSurface(mesh, mesh.userData.baseSurface);
    }
  }
  for (const [stageId, label] of stageLabelById) {
    const isSelected = stageId === stage?.id;
    label.position.copy(label.userData.basePosition);
    label.scale.copy(label.userData.baseScale);
    label.visible = true;
    label.material.depthTest = !isSelected;
    label.renderOrder = isSelected ? 24 : 0;
  }
  if (stage) layoutSelectedArtifactFlow(stage);
}

function layoutSelectedArtifactFlow(stage) {
  const outputIds = new Set(stage.outputs);
  const inputOnly = stage.inputs.filter((id) => !outputIds.has(id));
  const updated = stage.inputs.filter((id) => outputIds.has(id));
  const inputIds = new Set(stage.inputs);
  const outputOnly = stage.outputs.filter((id) => !inputIds.has(id));
  const flowAxis = processForwardAxis;
  const railAxis = new THREE.Vector3(-flowAxis.z, 0, flowAxis.x).normalize();
  const origin = stagePositions.get(stage.id);
  const inputCenter = artifactRailCenter(origin, flowAxis, -14, 26);
  const outputCenter = artifactRailCenter(origin, flowAxis, 14, 26);
  const updatedCenter = artifactRailCenter(origin, flowAxis, 0, 35);
  const topFaceCenter = origin.clone().add(new THREE.Vector3(0, 5.2, 0));

  positionArtifactRail(inputOnly, inputCenter, railAxis, artifactFlow.input.color);
  positionArtifactRail(outputOnly, outputCenter, railAxis, artifactFlow.output.color);
  positionArtifactRail(updated, updatedCenter, railAxis, artifactFlow.updated.color);

  if (inputOnly.length) addArtifactFlowArrow(
    inputCenter,
    topFaceCenter,
    artifactFlow.input.color,
  );
  if (outputOnly.length) addArtifactFlowArrow(
    topFaceCenter,
    outputCenter,
    artifactFlow.output.color,
  );
}

function artifactRailCenter(origin, flowAxis, flowOffset, verticalOffset) {
  const focusOffset = window.innerWidth < 760
    ? new THREE.Vector3(0, 0, 58)
    : new THREE.Vector3(26, 0, 58);
  const towardCamera = focusOffset.clone().normalize();
  const position = origin.clone()
    .addScaledVector(flowAxis, flowOffset)
    .addScaledVector(towardCamera, 4);
  position.y = origin.y + verticalOffset;
  return position;
}

function positionArtifactRail(artifactIds, center, railAxis, color) {
  if (!artifactIds.length) return;
  const spacing = artifactRowSpacing(artifactIds.length);
  artifactIds.forEach((artifactId, index) => {
    const railOffset = (index - (artifactIds.length - 1) / 2) * spacing;
    setArtifactFlowPosition(
      artifactId,
      center.clone().addScaledVector(railAxis, railOffset),
    );
  });
  addArtifactRail(center, railAxis, artifactIds.length, spacing, color);
}

function artifactRowSpacing(count) {
  if (count >= 7) return 14;
  if (count >= 5) return 15;
  return 16;
}

function setArtifactFlowPosition(artifactId, position) {
  const mesh = objectByKey.get(`artifact:${artifactId}`);
  const label = artifactLabelById.get(artifactId);
  mesh.position.copy(position);
  label.position.set(position.x, position.y + 2.8, position.z);
  const baseScale = label.userData.baseLabelScale;
  label.scale.set(baseScale.x * 0.68, baseScale.y * 0.68, 1);
}

function applyArtifactSurface(mesh, surface) {
  const position = mesh.geometry.getAttribute('position');
  let colors = mesh.geometry.getAttribute('color');
  if (!colors) {
    colors = new THREE.BufferAttribute(new Float32Array(position.count * 3), 3);
    mesh.geometry.setAttribute('color', colors);
  }
  mesh.geometry.computeBoundingBox();
  const { min, max } = mesh.geometry.boundingBox;
  const range = Math.max(0.001, max.y - min.y);
  const bottom = new THREE.Color(surface.bottom);
  const top = new THREE.Color(surface.top);
  const color = new THREE.Color();
  for (let index = 0; index < position.count; index += 1) {
    const amount = THREE.MathUtils.smoothstep((position.getY(index) - min.y) / range, 0, 1);
    color.lerpColors(bottom, top, amount);
    colors.setXYZ(index, color.r, color.g, color.b);
  }
  colors.needsUpdate = true;
}

function addArtifactFlowArrow(from, to, color) {
  const direction = new THREE.Vector3().subVectors(to, from).normalize();
  const arrow = new THREE.ArrowHelper(direction, from, from.distanceTo(to), color, 1.7, 0.9);
  arrow.line.material.transparent = true;
  arrow.line.material.opacity = 0.9;
  arrow.cone.material.transparent = true;
  arrow.cone.material.opacity = 0.96;
  artifactFlowArrowGroup.add(arrow);
}

function addArtifactRail(center, railAxis, count, spacing, color) {
  if (count < 2) return;
  const halfLength = ((count - 1) * spacing) / 2;
  const rail = makeLine(
    center.clone().addScaledVector(railAxis, -halfLength),
    center.clone().addScaledVector(railAxis, halfLength),
    color,
    0.62,
  );
  artifactFlowArrowGroup.add(rail);
}

function clearArtifactFlowArrows() {
  while (artifactFlowArrowGroup.children.length) {
    const item = artifactFlowArrowGroup.children[0];
    artifactFlowArrowGroup.remove(item);
    item.line?.geometry.dispose();
    item.line?.material.dispose();
    item.cone?.geometry.dispose();
    item.cone?.material.dispose();
    if (item.isLine) {
      item.geometry.dispose();
      item.material.dispose();
    }
    if (item.isSprite) {
      item.material.map?.dispose();
      item.material.dispose();
    }
  }
}

function showReturnFlow(stage) {
  clearReturnFlow();
  const targets = stage?.returnTo || [];
  targets.forEach((targetId, index) => {
    const target = stageById.get(targetId);
    if (target) addReturnArc(stage, target, index, targets.length);
  });
}

function addReturnArc(fromStage, toStage, index, total) {
  const start = stagePositions.get(fromStage.id).clone();
  const end = stagePositions.get(toStage.id).clone();
  start.y += 6;
  end.y += 6;

  const travel = end.clone().sub(start);
  const horizontal = travel.clone().setY(0);
  const side = horizontal.lengthSq()
    ? new THREE.Vector3(-horizontal.z, 0, horizontal.x).normalize()
    : new THREE.Vector3(0, 0, 1);
  const control = start.clone().add(end).multiplyScalar(0.5);
  control.y = Math.max(start.y, end.y) + 8 + horizontal.length() * 0.035 + index * 0.9;
  control.addScaledVector(side, (index - (total - 1) / 2) * 6);

  const curve = new THREE.QuadraticBezierCurve3(start, control, end);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),
    new THREE.LineDashedMaterial({
      color: 0xff5f78,
      dashSize: 1.4,
      gapSize: 0.9,
      transparent: true,
      opacity: 0.92,
      depthTest: true,
    }),
  );
  line.computeLineDistances();
  line.renderOrder = 28;
  returnFlowGroup.add(line);

  const tangent = curve.getTangent(1).normalize();
  const arrowHead = new THREE.Mesh(
    new THREE.ConeGeometry(0.72, 2.1, 10),
    new THREE.MeshBasicMaterial({ color: 0xff5f78, depthTest: true }),
  );
  arrowHead.position.copy(end).addScaledVector(tangent, -0.9);
  arrowHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  arrowHead.renderOrder = 29;
  returnFlowGroup.add(arrowHead);
}

function clearReturnFlow() {
  while (returnFlowGroup.children.length) {
    const item = returnFlowGroup.children[0];
    returnFlowGroup.remove(item);
    item.geometry?.dispose();
    item.material?.dispose();
  }
}

function artifactRole(stage, artifactId) {
  const isInput = stage.inputs.includes(artifactId);
  const isOutput = stage.outputs.includes(artifactId);
  if (isInput && isOutput) return 'updated';
  if (isInput) return 'input';
  if (isOutput) return 'output';
  return null;
}

function artifactContextStage(artifactId) {
  return activeArtifactContextStage(artifactId);
}

function activeArtifactContextStage(artifactId) {
  const active = activeStageId ? stageById.get(activeStageId) : null;
  return active && (active.artifacts.includes(artifactId) || artifactId === 'error-prevention') ? active : null;
}

function startCameraTween(position, target, duration) {
  // Drain pending orbit damping before an automated flight takes ownership of the camera.
  const damping = controls.enableDamping;
  controls.enableDamping = false;
  controls.update();
  controls.enableDamping = damping;
  if (prefersReducedMotion.matches) {
    cameraTween = null;
    camera.position.copy(position);
    controls.target.copy(target);
    controls.update();
    return;
  }
  cameraTween = {
    startedAt: performance.now(), duration,
    fromPosition: camera.position.clone(), toPosition: position.clone(),
    fromTarget: controls.target.clone(), toTarget: target.clone(),
  };
}

function toggleArtifacts() {
  artifactGroup.visible = !artifactGroup.visible;
  artifactFlowArrowGroup.visible = artifactGroup.visible;
  const button = document.getElementById('toggleArtifacts');
  button.classList.toggle('active', artifactGroup.visible);
  button.setAttribute('aria-pressed', String(artifactGroup.visible));
  if (!artifactGroup.visible && selected?.userData.type === 'artifact') clearSelection();
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate(time = 0) {
  requestAnimationFrame(animate);
  if (cameraTween) {
    const raw = Math.min(1, (time - cameraTween.startedAt) / cameraTween.duration);
    const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
    camera.position.lerpVectors(cameraTween.fromPosition, cameraTween.toPosition, eased);
    controls.target.lerpVectors(cameraTween.fromTarget, cameraTween.toTarget, eased);
    if (raw >= 1) cameraTween = null;
  }
  const cameraDistance = camera.position.distanceTo(controls.target);
  scene.fog.near = Math.max(baseFogNear, cameraDistance * 0.42);
  scene.fog.far = Math.max(baseFogFar, cameraDistance * 2.1);
  for (const label of artifactLabelById.values()) {
    if (!label.visible) continue;
    const distanceScale = THREE.MathUtils.clamp(camera.position.distanceTo(label.position) / 105, 1, 1.55);
    const base = label.userData.baseLabelScale;
    label.scale.set(base.x * distanceScale, base.y * distanceScale, 1);
  }
  updateSelectedPulse(time);
  controls.update();
  camera.updateMatrixWorld();
  updatePhaseLabelPositions();
  renderer.render(scene, camera);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
