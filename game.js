const WIN_STATUS = 'win';
const LOSS_STATUS = 'loss';
const ON_GOING_STATUS = 'match going';

const LEFT_SIDE = 'l';
const RIGHT_SIDE = 'r';
const BACK_SIDE = 'b';
const STRAIGHT = 's';

const DOT = 0;
const SINGLE = 1;
const DOUBLE = 2;
const TRIPLE = 3;
const BOUNDARY = 4;
const MAXIMUM = 6;
const WICKET = 'W';

const FIELDER = '🏃🏻‍♂️';
const OUTER_BOUNDARY = '🟠';
const INNER_BOUNDARY = '⚪';
const GRASS = '🟢';
const PITCH = '⬜️';
const EMPTY_GROUND = '⬛';

// [distance, angle]
const FIELDERS = [
  [5, 90],
  [-3, 90],
  [4, 135],
  [-4, 225],
  [10, 315],
  [-10, 45],
  [4, 180],
  [-4, 180],
  [10, 45],
  [-10, 240],
  [-10, 300],
  [-10, 175]
];

const USER_SHOT_MENU = 'Choose Your Shot:\n' +
  'L: Left-side(Leg)\n' +
  'R: Right-side(Off)\n' +
  'B: Back Side (Backfoot)\n' +
  'S: Straight (Frontfoot)\n';

// [width, height, innerRadius, boundaryRadius]
const GROUND_DIMENSIONS = [25, 25, 6, 11];
const GROUND_RADIUS = 12;

// Helper functions
const delay = (ms = 150000000) => {
  for (let i = 1; i <= ms; i++) { }
}

const sqr = x => x * x;

const batsmenPosition = (centerX, centerY) => [centerX - 2, centerY];

const centerCoords = (width, height) => {
  const abscissa = Math.floor(width / 2);
  const ordinate = Math.floor(height / 2);

  return [abscissa, ordinate];
}

const distanceBetween = (p1, p2) => Math.sqrt(sqr(p1[0] - p2[0]) + sqr(p1[1] - p2[1]));

const randomInRange = range => {
  const min = range[0];
  const max = range[1];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const chance = probability => Math.random() < probability;

// UI functions (ground, animation, feedback messgaes)

const endGame = (target, currScore) => {
  const status = 'DEFEAT!';
  const emoji = '😭';
  const desc = `Target not reached. You were short by ${target - currScore} runs.`;
  console.log(`${emoji} ${status} ${desc}`);
}

const displayWinMessage = (maxBatsmen, wicketsLost) => {
  const status = 'VICTORY!';
  const desc = `You won by ${maxBatsmen - wicketsLost} wickets.`
  const emoji = '🎉'

  console.log(`${emoji} ${status} ${desc}`);
}

const displayFeedBack = (result, currScore, wicketsLoss, maxBatsmen) => {
  const isWicket = result === WICKET;

  const message = isWicket
    ? `🚨 WICKET!`
    : `Scored ${result} run${result > 1 ? 's' : ''}`;

  const scoreLine = `Score: ${currScore}/${wicketsLoss}`;
  const wicketsLine = `Wickets Left: ${maxBatsmen - wicketsLoss}`;
  console.log(`${message}  |  ${scoreLine}  | ${wicketsLine} `);
}

const animateBall = (distance, angle) => {
  const rad = angle * (Math.PI / 180);

  for (let step = 1; step <= distance; step++) {
    const result = buildGround();
    const grid = result[0];
    const centerX = result[1];
    const centerY = result[2];

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
}

const displayGameInfo = (mode, target, currScore, wicketsLoss, maxBatsmen) => {
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`Target: ${target}`);
  console.log(`Score: ${currScore}/${wicketsLoss}`);
  console.log(`Wickets Left: ${maxBatsmen - wicketsLoss}\n`);
}

const getGameStatus = (target, currScore, maxBatsmen, wicketsLoss) => {
  const win = currScore >= target;
  const loss = wicketsLoss >= maxBatsmen;

  if (win) return WIN_STATUS;
  if (loss) return LOSS_STATUS;

  return ON_GOING_STATUS;
}

const placeFielders = (grid, centerX, centerY) => {
  for (const fielder of FIELDERS) {
    const dist = fielder[0];
    const angle = fielder[1] * (Math.PI / 180);

    const filderX = Math.round(centerX + dist * Math.cos(angle));
    const filderY = Math.round(centerY + dist * Math.sin(angle));

    if (grid[filderY] && grid[filderY][filderX]) {
      grid[filderY][filderX] = FIELDER;
    }
  }
};

const addPitch = (grid, centerX, centerY) => {
  const pitchHalf = 2;
  for (let point = -pitchHalf; point <= pitchHalf; point++) {
    grid[centerY + point][centerX] = PITCH;
  }
}

const createGround = () => {
  const grid = [];
  const width = GROUND_DIMENSIONS[0];
  const height = GROUND_DIMENSIONS[1];
  const innerRadius = GROUND_DIMENSIONS[2];
  const boundaryRadius = GROUND_DIMENSIONS[3];
  const center = centerCoords(width, height);

  for (let heightUnit = 0; heightUnit < height; heightUnit++) {
    const row = [];
    for (let widthUnit = 0; widthUnit < width; widthUnit++) {
      const point = [widthUnit, heightUnit];
      const d = distanceBetween(point, center);

      if (Math.abs(d - boundaryRadius) < 0.5) row.push(OUTER_BOUNDARY);
      else if (Math.abs(d - innerRadius) < 0.5) row.push(INNER_BOUNDARY);
      else if (d < boundaryRadius) row.push(GRASS);
      else row.push(EMPTY_GROUND);
    }
    grid.push(row);
  }

  return [grid, center[0], center[1]];
}

const displayGroundLegend = () => {
  let legend = 'Legend: \n';
  legend += `${OUTER_BOUNDARY} Boundary | `;
  legend += `${INNER_BOUNDARY} Inner Ring | `;
  legend += `${FIELDER} Fielder | `;
  legend += `${PITCH} Pitch | `;
  legend += `${GRASS} Ground | `;
  legend += `${EMPTY_GROUND} Outside `;
  console.log(legend);
}

const renderGrid = grid => {
  grid.forEach(row => console.log(row.join("")));
};

const buildGround = () => {
  const result = createGround();
  const grid = result[0];
  const centerX = result[1];
  const centerY = result[2];

  addPitch(grid, centerX, centerY);
  placeFielders(grid, centerX, centerY);

  return [grid, centerX, centerY];
}

const displayGround = () => {
  const grid = buildGround()[0];

  renderGrid(grid);
  displayGroundLegend();
}

// Functions to get result for ball delivery

const getRun = runPool => runPool[randomInRange([0, runPool.length - 1])];

const isShortRun = (distance, innerRadius) => distance < innerRadius / 2;

const isInnerCircle = (distance, innerRadius) => distance < innerRadius;

const isDeepInside = (distance, boundaryRadius) => distance < boundaryRadius - 2;

const isNearBoundary = (distance, boundaryRadius) => distance < boundaryRadius;

const isValidShot = (shotChoice, validShots) =>
  shotChoice && validShots.includes(shotChoice.toLowerCase());

const isFielderInCatchRange = (fielder, distance, angle) =>
  Math.abs(distance - fielder[0]) < 2 &&
  Math.abs(angle - fielder[1]) < 15;

const isCaught = (distance, angle, fielders) =>
  fielders.some(fielder => isFielderInCatchRange(fielder, distance, angle));

// score updation

const updateScore = (score, wickets, result) =>
  result === WICKET ? [score, wickets + 1] : [score + result, wickets];

// functions to determine shot based on user input

const shotOutcome = (distance, angle) => {
  if (isCaught(distance, angle, FIELDERS)) return WICKET;

  const innerRadius = GROUND_DIMENSIONS[2];
  const boundaryRadius = GROUND_DIMENSIONS[3];

  if (isShortRun(distance, innerRadius)) return chance(0.20) ? WICKET : DOT;

  if (isInnerCircle(distance, innerRadius)) {
    const runPool = [SINGLE, SINGLE, SINGLE, DOUBLE, DOUBLE];
    return getRun(runPool);
  }

  if (isDeepInside(distance, boundaryRadius)) {
    const runPool = [SINGLE, DOUBLE, DOUBLE, TRIPLE];
    return getRun(runPool);
  }

  if (isNearBoundary(distance, boundaryRadius)) {
    return chance(0.70) ? BOUNDARY : DOUBLE;
  }

  return MAXIMUM;
}

const getAngleForShot = shot => {
  if (shot === LEFT_SIDE) {
    const part = chance(0.5);
    return part ? randomInRange([315, 360]) : randomInRange([0, 45]);
  }
  if (shot === RIGHT_SIDE) return randomInRange([135, 225]);
  if (shot === BACK_SIDE) return randomInRange([225, 315]);
  return randomInRange([45, 135]);
}

const getDistanceForShot = (shot) => {
  const max = GROUND_RADIUS + 5;

  switch (shot) {
    case STRAIGHT:
      return randomInRange([max - 5, max]);

    case LEFT_SIDE:
      return randomInRange([5, max - 3]);

    case RIGHT_SIDE:
      return randomInRange([3, max - 6]);

    case BACK_SIDE:
      return randomInRange([0, 6]);

    default:
      return randomInRange([0, max]);
  }
};

const getShotCoordinates = shot => [getDistanceForShot(shot), getAngleForShot(shot)];

const determineOutcome = shot => {
  const coords = getShotCoordinates(shot);
  animateBall(coords[0], coords[1]);
  return shotOutcome(coords[0], coords[1]);
}

const chooseShot = () => {
  const validShots = [LEFT_SIDE, RIGHT_SIDE, BACK_SIDE, STRAIGHT];

  while (true) {
    const shotChoice = prompt(USER_SHOT_MENU);

    if (isValidShot(shotChoice, validShots)) return shotChoice.toLowerCase();

    console.log("Invalid shot! Please try again.\n");
  }
}

// main functions

const playDelivery = () => {
  const shot = chooseShot();
  return determineOutcome(shot);
};

const game = (mode, target, maxBatsmen) => {
  let currScore = 0;
  let wicketsLoss = 0;
  let status = getGameStatus(target, currScore, maxBatsmen, wicketsLoss);

  while (status === ON_GOING_STATUS) {
    console.clear();

    displayGameInfo(mode, target, currScore, wicketsLoss, maxBatsmen);
    displayGround();

    const result = playDelivery();
    const updated = updateScore(currScore, wicketsLoss, result);
    currScore = updated[0];
    wicketsLoss = updated[1];
    displayFeedBack(result, currScore, wicketsLoss, maxBatsmen);

    status = getGameStatus(target, currScore, maxBatsmen, wicketsLoss);
    if (status === ON_GOING_STATUS) {
      prompt("\nPress Enter for next delivery...");
    }
  }

  return [status, currScore, wicketsLoss];
}

const getMaxBatsmen = mode => {
  if (mode === 'easy') return 6;
  if (mode === 'medium') return 5;
  return 4;
};

const getTarget = mode => {
  if (mode === 'easy') return randomInRange([15, 20]);
  if (mode === 'medium') return randomInRange([35, 50]);
  return randomInRange([75, 100]);
};

const initGame = (mode = 'easy') => {
  const target = getTarget(mode);
  const maxBatsmen = getMaxBatsmen(mode);
  displayGameInfo(mode, target, 0, 0, maxBatsmen);
  displayGround();

  const result = game(mode, target, maxBatsmen);
  const status = result[0];
  const runsScored = result[1];
  const wicketsLoss = result[2];

  if (status === WIN_STATUS) displayWinMessage(maxBatsmen, wicketsLoss);
  else endGame(target, runsScored);
};

initGame();