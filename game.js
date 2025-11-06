const WIN_STATUS = 'win';
const LOSS_STATUS = 'loss';
const ON_GOING_STATUS = 'match going';

const WICKET = 'W';
const GROUND_RADIUS = 12;

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

const FIELDER = '🏃🏻‍♂️';
const OUTER_BOUNDARY = '🔴';
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

// Helper functions
function delay(loopCount = 150000000) {
  for (let i = 0; i < loopCount; i++) {}
}

const sqr = function (x) {
  return x * x;
}

const centerCoords = function (width, height) {
  const abscissa = Math.floor(width / 2);
  const ordinate = Math.floor(height / 2);

  return [abscissa, ordinate];
}

const distanceBetween = function (point1, point2) {
  return Math.sqrt(sqr(point1[0] - point2[0]) + sqr(point1[1] - point2[1]));
}

const randomInRange = function (range) {
  const min = range[0];
  const max = range[1];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(probability) {
  return Math.random() < probability;
}

// UI functions (ground, animation, feedback messgaes)

const getGroundDimensions = function (width = 25, height = 25) {
  const boundaryRadius = Math.floor(width * 0.45);
  const innerRadius = Math.floor(width * 0.25);

  return [width, height, innerRadius, boundaryRadius];
}

const endGame = function (target, currScore) {
  const status = 'DEFEAT!';
  const emoji = '😭';
  const desc = `Target not reached. You were short by ${target - currScore} runs.`;
  console.log(`${emoji} ${status} ${desc}`);
}

const displayWinMessage = function (maxBatsmen, wicketsLost) {
  const status = 'VICTORY!';
  const desc = `You won by ${maxBatsmen - wicketsLost} wickets.`
  const emoji = '🎉'

  console.log(`${emoji} ${status} ${desc}`);
}

const displayFeedBack = function(result, currScore, wicketsLoss, maxBatsmen) {
  const isWicket = result === WICKET;

  const message = isWicket
    ? `🚨 WICKET!`
    : `Scored ${result} run${result > 1 ? 's' : ''}`;

  const scoreLine = `Score: ${currScore}/${wicketsLoss}`;
  const wicketsLine = `Wickets Left: ${maxBatsmen - wicketsLoss}`;
  console.log(`${message}  |  ${scoreLine}  | ${wicketsLine} `);
}

function animateBall(distance, angle) {
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

const displayGameInfo = function (mode, target, currScore, wicketsLoss, maxBatsmen) {
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`Target: ${target}`);
  console.log(`Score: ${currScore}/${wicketsLoss}`);
  console.log(`Wickets Left: ${maxBatsmen - wicketsLoss}\n`);
}

const getGameStatus = function (target, currScore, maxBatsmen, wicketsLoss) {
  const win = currScore >= target;
  const loss = wicketsLoss >= maxBatsmen;

  if (win) return WIN_STATUS;
  if (loss) return LOSS_STATUS;

  return ON_GOING_STATUS;
}

const placeFielders = function (grid, centerX, centerY) {
  for (let filder = 0; filder < FIELDERS.length; filder++) {
    const dist = FIELDERS[filder][0];
    const angle = FIELDERS[filder][1] * (Math.PI / 180);

    const filderX = Math.round(centerX + dist * Math.cos(angle));
    const filderY = Math.round(centerY + dist * Math.sin(angle));

    if (grid[filderY] && grid[filderY][filderX]) {
      grid[filderY][filderX] = FIELDER;
    }
  }
}

const addPitch = function (grid, centerX, centerY) {
  const pitchHalf = 2;
  for (let point = -pitchHalf; point <= pitchHalf; point++) {
    grid[centerY + point][centerX] = PITCH;
  }
}

const createGround = function () {
  const grid = [];
  const groundDimensions = getGroundDimensions();
  const width = groundDimensions[0];
  const height = groundDimensions[1];
  const innerRadius = groundDimensions[2];
  const boundaryRadius = groundDimensions[3];
  const center = centerCoords(width, height);
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const point = [x, y];
      const d = distanceBetween(point, center);

      if (Math.abs(d - boundaryRadius) < 1) row.push(OUTER_BOUNDARY);
      else if (Math.abs(d - innerRadius) < 1) row.push(INNER_BOUNDARY);
      else if (d < boundaryRadius) row.push(GRASS);
      else row.push(EMPTY_GROUND);
    }
    grid.push(row);
  }

  return [grid, center[0], center[1]];
}

const displayGroundLegend = function () {
  let legend = 'Legend: \n';
  legend += `${OUTER_BOUNDARY} Boundary | `;
  legend += `${INNER_BOUNDARY} Inner Ring | `;
  legend += `${FIELDER} Fielder | `;
  legend += `${PITCH} Pitch | `;
  legend += `${GRASS} Ground | `;
  legend += `${EMPTY_GROUND} Outside `;
  console.log(legend);
}

const renderGrid = function (grid) {
  for (let line = 0; line < grid.length; line++) {
    console.log(grid[line].join(""));
  }
}

function buildGround() {
  const result = createGround();
  const grid = result[0];
  const centerX = result[1];
  const centerY = result[2];

  addPitch(grid, centerX, centerY);
  placeFielders(grid, centerX, centerY);

  return [grid, centerX, centerY];
}

function displayGround() {
  const grid = buildGround()[0];

  renderGrid(grid);
  displayGroundLegend();
}

// Functions to get result for ball delivery

const getRun = function (runPool) {
  const run = randomInRange([0, runPool.length]);
  return runPool[run];
}

const isShortRun = function (distance, innerRadius) {
  return distance < innerRadius / 2;
}

const isInnerCircle = function (distance, innerRadius) {
  return distance < innerRadius;
}

const isDeepInside = function (distance, boundaryRadius) {
  return distance < boundaryRadius - 2;
}

const isNearBoundary = function (distance, boundaryRadius) {
  return distance < boundaryRadius;
}

const isValidShot = function (shotChoice, validShots) {
  if (!shotChoice) return false;
  return validShots.includes(shotChoice.toLowerCase());
}

const isCaught = function (distance, angle, fielders) {
  for (let i = 0; i < fielders.length; i++) {
    const fielderDist = fielders[i][0];
    const fielderAngle = fielders[i][1];

    const distDiff = Math.abs(distance - fielderDist);
    const angleDiff = Math.abs(angle - fielderAngle);

    if (distDiff < 2 && angleDiff < 15) {
      return true;
    }
  }
  return false;
}

// score updation

const updateScore = function (score, wickets, result) {
  if (result === WICKET) return [score, wickets + 1];
  return [score + result, wickets];
}

// functions to determine shot based on user input

function shotOutcome(distance, angle) {
  if (isCaught(distance, angle, FIELDERS)) {
    return WICKET;
  }

  const groundDimensions = getGroundDimensions();
  const innerRadius = groundDimensions[2];
  const boundaryRadius = groundDimensions[3];
  if (isShortRun(distance, innerRadius)) {
    return chance(0.20) ? WICKET : DOT;
  }

  if (isInnerCircle(distance, innerRadius)) {
    const runPool = [SINGLE, SINGLE, SINGLE, DOUBLE, DOUBLE];
    return getRun(runPool);
  }

  if (isDeepInside(distance, boundaryRadius)) {
    const runPool = [SINGLE, DOUBLE, DOUBLE, TRIPLE];
    getRun(runPool);
  }

  if (isNearBoundary(distance, boundaryRadius)) {
    return chance(0.70) ? BOUNDARY : DOUBLE;
  }

  return MAXIMUM;
}

const getAngleForShot = function (shot) {
  if (shot === LEFT_SIDE) {
    const part = Math.random() < 0.5;
    return part ? randomInRange([315, 360]) : randomInRange([0, 45]); 
  }
  if (shot === RIGHT_SIDE) return randomInRange([135, 225]);
  if (shot === BACK_SIDE) return randomInRange([225, 315]);
  return randomInRange([45, 135]);
}

const getDistanceForShot = function () {
  const maxDistanceRange = GROUND_RADIUS + 5;
  return randomInRange([0, maxDistanceRange]);
}

const getShotCoordinates = function (shot) {
  const distance = getDistanceForShot();
  const angle = getAngleForShot(shot);
  return [distance, angle];
}

const determineOutcome = function (shot) {
  const coords = getShotCoordinates(shot);
  animateBall(coords[0], coords[1]);
  return shotOutcome(coords[0], coords[1]);
}

const chooseShot = function () {
  const validShots = [LEFT_SIDE, RIGHT_SIDE, BACK_SIDE, STRAIGHT];

  while (true) {
    const shotChoice = prompt(
      'Choose Your Shot:\n' +
      'L: Left-side(Leg)\n' +
      'R: Right-side(Off)\n' +
      'B: Back Side (Backfoot)\n' +
      'S: Straight (Frontfoot)\n'
    );

    if (isValidShot(shotChoice, validShots)) {
      return shotChoice.toLowerCase();
    }

    console.log("Invalid shot! Please try again.\n");
  }
}

// main functions

const playDelivery = function () {
  const userShot = chooseShot();
  return determineOutcome(userShot);
}

const game = function (mode, target, maxBatsmen) {
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

const getMaxBatsmen = function (mode) {
  if (mode === 'easy') return 6;
  if (mode === 'medium') return 5;
  return 4;
}

const getTarget = function (mode) {
  if (mode === 'easy') return randomInRange([15, 20]);
  if (mode === 'medium') return randomInRange([35, 50]);
  return randomInRange([75, 100]);
}

const initGame = function (mode = 'easy') {
  const target = getTarget(mode);
  const maxBatsmen = getMaxBatsmen(mode);
  displayGameInfo(mode, target, maxBatsmen);
  displayGround();

  const result = game(mode, target, maxBatsmen);
  const status = result[0];
  const runsScored = result[1];
  const wicketsLoss = result[2];

  if (status === WIN_STATUS) {
    displayWinMessage(maxBatsmen, wicketsLoss);
  } else {
    endGame(target, runsScored);
  }
}

initGame();