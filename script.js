import { updateGround, setupGround } from "./ground.js"
import { updatePlayer, setupPlayer, getPlayerRect, setPlayerLose } from "./player.js"
import { updateObstacle, setupObstacle, getObstacleRects } from "./obstacle.js"


const GAME_WIDTH = 100
const GAME_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const gameElem = document.querySelector("[data-game]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")
const gweiTotalScoreEleme = document.querySelector("[data-wei-total-score]")



setPixelToGameScale()
window.addEventListener("resize", setPixelToGameScale)
document.addEventListener("keydown", handleStart, { once: true })

let lastTime
let speedScale
let score


function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime

  updateGround(delta, speedScale)
  updatePlayer(delta, speedScale)
  updateObstacle(delta, speedScale)
  updateNft(delta, speedScale)
  updateSpeedScale(delta)
  updateScore(delta)
  checkIfWeGotNft()
  // if there is a collision lose the game
  if (checkLose()) return handleLose()
  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const playerRect = getPlayerRect()
  return getObstacleRects().some(rect => isCollision(rect, playerRect))
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top 
  )
}



function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
  // kolku score dobivas tuka se presmetue
  // console.log("delta u update score function = ", delta)
  score += delta * 0.01
  scoreElem.textContent = `Wei score: ${Math.floor(score)}` 
}

// kaa kje pozne
function handleStart() {
  lastTime = null
  speedScale = 1
  score = 0
  setupGround()
  setupPlayer()
  setupObstacle()
  setupNft()
  startScreenElem.classList.add("hide")
  // call this onnly wehne screen refershes
  window.requestAnimationFrame(update)
}



window.totalGweiScore = 0

function handleLose() {
  window.totalGweiScore += Math.floor(score)  
 

  
  gweiTotalScoreEleme.textContent = `Wei total score ${window.totalGweiScore}`

  
  setPlayerLose()
  // save
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true })
    startScreenElem.classList.remove("hide")
  }, 100)
}

function setPixelToGameScale() {
  let gameToPixelScale
  if (window.innerWidth / window.innerHeight < GAME_WIDTH / GAME_HEIGHT) {
    gameToPixelScale = window.innerWidth / GAME_WIDTH
  } else {
    gameToPixelScale = window.innerHeight / GAME_HEIGHT
  }

  gameElem.style.width = `${GAME_WIDTH * gameToPixelScale}px`
  gameElem.style.height = `${GAME_HEIGHT * gameToPixelScale}px`
}

