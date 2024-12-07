import MovementHandler from "./classes/game/MovementHandler.js";
import { Game } from "./classes/game/Game";
import { getSeed } from "./utils/seeds.js";
import KeyboardHandler from "./classes/game/KeyboardHandler.js";

const playerElement = document.querySelector('#player');
const pointerElement = document.querySelector('#pointer');
const pointsCounter = document.querySelector('#pointsCounter');
const obstacleContainer = document.querySelector('#obstacleContainer');
const gameElement = document.body;

if (!(playerElement instanceof HTMLElement)) throw 'No HTMLElement of id = #player';
if (!(pointsCounter instanceof HTMLElement)) throw 'No HTMLElement of id = #pointCounter';
if (!(pointerElement instanceof HTMLElement)) throw 'No HTMLElement of id = #pointer';
if (!(obstacleContainer instanceof HTMLElement)) throw 'No HTMLElement of id = #obstacleContainer';

const seed = getSeed();
const game = new Game(gameElement, playerElement, obstacleContainer, pointerElement, pointsCounter, seed);;
const movementHandler = new MovementHandler(game); 
const keyboardHandler = new KeyboardHandler();

keyboardHandler.registerKeysDown(['w', 'a', 's', 'd'], movementHandler.keyPress);
keyboardHandler.registerKeysUp(['w', 'a', 's', 'd'], movementHandler.keyRelease);
keyboardHandler.registerKeyDown('r', game.playerRelease);

document.addEventListener('DOMContentLoaded', () => {    
    keyboardHandler.start();
    movementHandler.start();
    game.start();
});
