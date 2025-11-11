const GAME_STATUS = { WIN: 'win', LOSS: 'loss', ON_GOING: 'on-going' };
const SHOTS = { LEFT: 'l', RIGHT: 'r', BACK: 'b', STRAIGHT: 's' };
const RUNS = {
  DOT: 0,
  SINGLE: 1,
  DOUBLE: 2,
  TRIPLE: 3,
  BOUNDARY: 4,
  MAXIMUM: 6,
  WICKET: 'W'
};

const EMOJIS = {
  FIELDER: '🏃🏻‍♂️',
  OUTER_BOUNDARY: '🟠',
  INNER_BOUNDARY: '⚪',
  GRASS: '🟢',
  PITCH: '⬜️',
  EMPTY_GROUND: '⬛'
};

const MODE_CONFIG = {
  easy: { maxBatsmen: 6, targetRange: [15, 20] },
  medium: { maxBatsmen: 5, targetRange: [35, 50] },
  hard: { maxBatsmen: 4, targetRange: [75, 100] }
};

const FIELDERS = [
  { distance: 5, angle: 90 },
  { distance: -3, angle: 90 },
  { distance: 4, angle: 135 },
  { distance: -4, angle: 225 },
  { distance: 10, angle: 315 },
  { distance: -10, angle: 45 },
  { distance: 4, angle: 180 },
  { distance: -4, angle: 180 },
  { distance: 10, angle: 45 },
  { distance: -10, angle: 240 },
  { distance: -10, angle: 300 },
  { distance: -10, angle: 175 }
];

const GROUND = {
  DIMENSIONS: {
    width: 25,
    height: 25,
    innerRadius: 6,
    boundaryRadius: 11
  },
  RADIUS: 12
};

const USER_SHOT_MENU = 'Choose Your Shot:\n' +
  'L: Left-side(Leg)\n' +
  'R: Right-side(Off)\n' +
  'B: Back Side (Backfoot)\n' +
  'S: Straight (Frontfoot)\n';

// Helper functions
const delay = (ms = 150000000) => {
  for (let i = 1; i <= ms; i++) { }
};

const sqr = x => x * x;

const batsmenPosition = (centerX, centerY) => [centerX - 2, centerY];

const centerCoords = (width, height) => {
  const abscissa = Math.floor(width / 2);
  const ordinate = Math.floor(height / 2);

  return [abscissa, ordinate];
};

const distanceBetween =
  (point1, point2) => Math.sqrt(
    sqr(point1[0] - point2[0]) +
    sqr(point1[1] - point2[1])
  );

const randomInRange = range => {
  const min = range[0];
  const max = range[1];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const chance = probability => Math.random() < probability;

// UI functions (ground, animation, feedback messgaes)

const endGame = (target, currScore) => {
  const status = 'DEFEAT!';
  const emoji = '😭';
  const desc = `Target not reached. You were short by ${target - currScore} runs.`;
  console.log(`${emoji} ${status} ${desc}`);
};

const displayWinMessage = (maxBatsmen, wicketsLost) => {
  const status = 'VICTORY!';
  const desc = `You won by ${maxBatsmen - wicketsLost} wickets.`;
  const emoji = '🎉';

  console.log(`${emoji} ${status} ${desc}`);
};

const displayFeedBack = (result, currScore, wicketsLoss, maxBatsmen) => {
  const isWicket = result === RUNS.WICKET;

  const message = isWicket
    ? `🚨 WICKET!`
    : `Scored ${result} run${result > 1 ? 's' : ''}`;

  const scoreLine = `Score: ${currScore}/${wicketsLoss}`;
  const wicketsLine = `Wickets Left: ${maxBatsmen - wicketsLoss}`;
  console.log(`${message}  |  ${scoreLine}  | ${wicketsLine} `);
};

const animateBall = (distance, angle) => {
  const rad = angle * (Math.PI / 180);

  for (let step = 1; step <= distance; step++) {
    const { grid, centerX, centerY } = buildGround();

    const x = Math.round(centerX + step * Math.cos(rad));
    const y = Math.round(centerY + step * Math.sin(rad));

    if (grid[y] && grid[y][x]) {
      grid[y][x] = "🎾";
    }

    console.clear();
    renderGrid(grid);
    console.log("\n🎾 Ball in the air...\n");

    delay();
  }
};

const displayGameInfo = (mode, target, currScore, wicketsLoss, maxBatsmen) => {
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`Target: ${target}`);
  console.log(`Score: ${currScore}/${wicketsLoss}`);
  console.log(`Wickets Left: ${maxBatsmen - wicketsLoss}\n`);
};

const getGameStatus = (target, currScore, maxBatsmen, wicketsLoss) => {
  const win = currScore >= target;
  const loss = wicketsLoss >= maxBatsmen;

  if (win) return GAME_STATUS.WIN;
  if (loss) return GAME_STATUS.LOSS;

  return GAME_STATUS.ON_GOING;
};

const placeFielders = (grid, centerX, centerY) => {
  for (const fielder of FIELDERS) {
    const dist = fielder.distance;
    const angle = fielder.angle * (Math.PI / 180);

    const filderX = Math.round(centerX + dist * Math.cos(angle));
    const filderY = Math.round(centerY + dist * Math.sin(angle));

    if (grid[filderY] && grid[filderY][filderX]) {
      grid[filderY][filderX] = EMOJIS.FIELDER;
    }
  }
};

const addPitch = (grid, centerX, centerY) => {
  const pitchHalf = 2;
  for (let point = -pitchHalf; point <= pitchHalf; point++) {
    grid[centerY + point][centerX] = EMOJIS.PITCH;
  }
};

const createGround = () => {
  const grid = [];
  const { width, height, innerRadius, boundaryRadius } = GROUND.DIMENSIONS;
  const center = centerCoords(width, height);

  for (let heightUnit = 0; heightUnit < height; heightUnit++) {
    const row = [];
    for (let widthUnit = 0; widthUnit < width; widthUnit++) {
      const point = [widthUnit, heightUnit];
      const d = distanceBetween(point, center);

      if (Math.abs(d - boundaryRadius) < 0.5) row.push(EMOJIS.OUTER_BOUNDARY);
      else if (Math.abs(d - innerRadius) < 0.5) row.push(EMOJIS.INNER_BOUNDARY);
      else if (d < boundaryRadius) row.push(EMOJIS.GRASS);
      else row.push(EMOJIS.EMPTY_GROUND);
    }
    grid.push(row);
  }

  return { grid, centerX: center[0], centerY: center[1] };
};

const displayGroundLegend = () => {
  let legend = 'Legend: \n';
  legend += `${EMOJIS.OUTER_BOUNDARY} Boundary | `;
  legend += `${EMOJIS.INNER_BOUNDARY} Inner Ring | `;
  legend += `${EMOJIS.FIELDER} Fielder | `;
  legend += `${EMOJIS.PITCH} Pitch | `;
  legend += `${EMOJIS.GRASS} Ground | `;
  legend += `${EMOJIS.EMPTY_GROUND} Outside `;
  console.log(legend);
};

const renderGrid = grid => {
  grid.forEach(row => console.log(row.join("")));
};

const buildGround = () => {
  const { grid, centerX, centerY } = createGround();

  addPitch(grid, centerX, centerY);
  placeFielders(grid, centerX, centerY);

  return { grid, centerX, centerY };
};

const displayGround = () => {
  const { grid } = buildGround();

  renderGrid(grid);
  displayGroundLegend();
};

// Functions to get result for ball delivery

const getRun = runPool => runPool[randomInRange([0, runPool.length - 1])];

const isShortRun = (distance, innerRadius) => distance < innerRadius / 2;

const isInnerCircle = (distance, innerRadius) => distance < innerRadius;

const isDeepInside = (distance, boundaryRadius) => distance < boundaryRadius - 2;

const isNearBoundary = (distance, boundaryRadius) => distance < boundaryRadius;

const isValidShot = (shotChoice, validShots) =>
  shotChoice && validShots.includes(shotChoice.toLowerCase());

const isFielderInCatchRange = (fielder, distance, angle) =>
  Math.abs(distance - fielder.distance) < 2 &&
  Math.abs(angle - fielder.angle) < 15;

const isCaught = (distance, angle, fielders = FIELDERS) =>
  fielders.some(f => isFielderInCatchRange(f, distance, angle));

// score updation

const updateScore = (currScore, wicketsLoss, result) =>
  result === RUNS.WICKET
    ? { currScore, wicketsLoss: wicketsLoss + 1 }
    : { currScore: currScore + result, wicketsLoss };

// functions to determine shot based on user input

const shotOutcome = (distance, angle) => {
  if (isCaught(distance, angle, FIELDERS)) return RUNS.WICKET;

  const innerRadius = GROUND.DIMENSIONS.INNER_RADIUS;
  const boundaryRadius = GROUND.DIMENSIONS.OUTER_RADIUS;

  if (isShortRun(distance, innerRadius)) return chance(0.20) ? RUNS.WICKET : RUNS.DOT;

  if (isInnerCircle(distance, innerRadius)) {
    const runPool = [RUNS.SINGLE, RUNS.SINGLE, RUNS.SINGLE, RUNS.DOUBLE, RUNS.DOUBLE];
    return getRun(runPool);
  }

  if (isDeepInside(distance, boundaryRadius)) {
    const runPool = [RUNS.SINGLE, RUNS.DOUBLE, RUNS.DOUBLE, RUNS.TRIPLE];
    return getRun(runPool);
  }

  if (isNearBoundary(distance, boundaryRadius)) {
    return chance(0.70) ? RUNS.BOUNDARY : RUNS.DOUBLE;
  }

  return RUNS.MAXIMUM;
};

const getAngleForShot = shot => {
  if (shot === SHOTS.LEFT) {
    const part = chance(0.5);
    return part ? randomInRange([315, 360]) : randomInRange([0, 45]);
  }
  if (shot === SHOTS.RIGHT) return randomInRange([135, 225]);
  if (shot === SHOTS.BACK) return randomInRange([225, 315]);
  return randomInRange([45, 135]);
};

const getDistanceForShot = (shot) => {
  const max = GROUND.RADIUS + 5;

  switch (shot) {
    case SHOTS.STRAIGHT: return randomInRange([max - 5, max]);
    case SHOTS.LEFT: return randomInRange([5, max - 3]);
    case SHOTS.RIGHT: return randomInRange([3, max - 6]);
    case SHOTS.BACK: return randomInRange([0, 6]);
  }
};

const getShotCoordinates = shot => [getDistanceForShot(shot), getAngleForShot(shot)];

const determineOutcome = shot => {
  const coords = getShotCoordinates(shot);
  animateBall(coords[0], coords[1]);
  return shotOutcome(coords[0], coords[1]);
};

const chooseShot = () => {
  const validShots = [SHOTS.LEFT, SHOTS.RIGHT, SHOTS.BACK, SHOTS.STRAIGHT];

  while (true) {
    const shotChoice = prompt(USER_SHOT_MENU);

    if (isValidShot(shotChoice, validShots)) return shotChoice.toLowerCase();

    console.log("Invalid shot! Please try again.\n");
  }
};

// main functions

const playDelivery = () => {
  const shot = chooseShot();
  return determineOutcome(shot);
};

const game = (mode, target, maxBatsmen) => {
  let currScore = 0;
  let wicketsLoss = 0;
  let status = getGameStatus(target, currScore, maxBatsmen, wicketsLoss);

  while (status === GAME_STATUS.ON_GOING) {
    console.clear();

    displayGameInfo(mode, target, currScore, wicketsLoss, maxBatsmen);
    displayGround();

    const result = playDelivery();

    const updated = updateScore(currScore, wicketsLoss, result);
    currScore = updated.currScore;
    wicketsLoss = updated.wicketsLoss;

    displayFeedBack(result, currScore, wicketsLoss, maxBatsmen);

    status = getGameStatus(target, currScore, maxBatsmen, wicketsLoss);
    if (status === GAME_STATUS.ON_GOING) {
      prompt("\nPress Enter for next delivery...");
    }
  }

  return { status, currScore, wicketsLoss };
};

const getMaxBatsmen = mode => MODE_CONFIG[mode].maxBatsmen;
const getTarget = mode => randomInRange(MODE_CONFIG[mode].targetRange);

const initGame = (mode = 'easy') => {
  const target = getTarget(mode);
  const maxBatsmen = getMaxBatsmen(mode);
  displayGameInfo(mode, target, 0, 0, maxBatsmen);
  displayGround();

  const result = game(mode, target, maxBatsmen);
  if (result.status === GAME_STATUS.WIN) {
    return displayWinMessage(maxBatsmen, result.wicketsLoss);
  }
  return endGame(target, result.currScore);
};

initGame();