import Phaser from 'phaser';
import React, { FunctionComponent } from 'react'
import io from 'socket.io-client';
import { useEffect } from 'react';
import { EndGameData } from '../Home';

const gameSocket = io('/game');

interface Props {
	setScore: React.Dispatch<React.SetStateAction<number[]>>
	setEndGameVisible: React.Dispatch<React.SetStateAction<boolean>>
	setEndGameDisplay: React.Dispatch<React.SetStateAction<EndGameData>>
	isHost: boolean
	matchRoom: string
}

interface Ball {
  x: number;
  y: number;
}

interface Score {
  player1: number;
  player2: number;
}

export const PhaserGame: FunctionComponent<Props> = ({
	setScore,
	setEndGameVisible,
	setEndGameDisplay,
	isHost,
	matchRoom,
}) => {
	useEffect(() =>  {
		const gameConfig: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: window.innerWidth - 4,
			height: window.innerHeight - 4,
			backgroundColor: '#110931',
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 0 },
					debug: false,
				},
			},
			scale: {
				parent: 'game-container',
				autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
			},
			scene: {
				preload: preload,
				create: create,
				update: update
			}
		}
		let game = new Phaser.Game(gameConfig);

		let player1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let player2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let rightGoal: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let leftGoal: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let ballVelocity : number[] = [1000, -1000];
		let screenWidth : number = window.innerWidth;
		let screenHeight : number = window.innerHeight;

		let player1PosY: number = 0;
		let player2PosY: number = 0;
		let ballPos: Ball = {x: 0, y: 0}

		let score: Score = {player1: 0, player2: 0}
		let endingScore: number =  4;
		let winningPlayer: 1 | 2 | undefined = undefined;

		function preload(this: Phaser.Scene): void {
			this.load.image('pad', require('./assets/pad.png'));
			this.load.image('ball', require('./assets/ball.png'));
		}

		function create(this: Phaser.Scene): void {
			gameSocket.connect();
			player1 = this.physics.add.sprite(screenWidth * 0.1, screenHeight * 0.5, 'pad');
			player2 = this.physics.add.sprite(screenWidth * 0.9, screenHeight * 0.5, 'pad');
			ball = this.physics.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'ball').setSize(30, 30);
			rightGoal = this.physics.add.sprite(screenWidth, screenHeight * 0.5, 'pad').setSize(screenWidth * 0.01, screenHeight).setVisible(false);
			leftGoal = this.physics.add.sprite(1, screenHeight * 0.5, 'pad').setSize(screenWidth * 0.01, screenHeight).setVisible(false);

			player1.setCollideWorldBounds(true);
			player1.body.setImmovable(true);
			rightGoal.body.setImmovable(true);
			leftGoal.body.setImmovable(true);
			player2.setCollideWorldBounds(true);
			player2.body.setImmovable(true);
			ball.setCollideWorldBounds(true);
			ball.setAcceleration(0);

			if (isHost) {
				this.time.delayedCall(1000, start, [], this);
			} else {
				updateScore();
			}
		}

		function update(this: Phaser.Scene): void {
			if (isHost) {
				updatePlayerVelocit(player1, this.input);
				updatePlayer1Position();
				updatePlayer2PositionFromSocket();
				updateBallPosition();
			} else {
				updatePlayerVelocit(player2, this.input);
				updatePlayer1PositionFromSocket();
				updatePlayer2Position();
				updateBallPositionFromSocket();
			}
		
			checkEndGame(this.scene);
		}

		function updatePlayer1Position() {
			if (player1.y != player1PosY) {
				player1PosY = player1.y;
				gameSocket.emit('player1', player1PosY);
			}
		}

		function updatePlayer1PositionFromSocket() {
			gameSocket.off('player1').on('player1', (pos: number) => {
				player1.y = pos;
			} );
		}
		
		function updatePlayer2Position() {
			if (player2.y != player2PosY) {
				player2PosY = player2.y;
				gameSocket.emit('player2', player2PosY);
			}
		}

		function updatePlayer2PositionFromSocket() {
			gameSocket.off('player2').on('player2', (pos: number) => {
				player2.y = pos;
			} );
		}
		
		function updateBallPosition() {
			if (ball.x != ballPos.x || ball.y != ballPos.y) {
				ballPos.x = ball.x;
				ballPos.y = ball.y;
				gameSocket.emit('ball', ballPos);
			}
		}

		function updateBallPositionFromSocket() {
			gameSocket.off('ball').on('ball', (ballPosFromSocket: Ball) => {
				ballPos = ballPosFromSocket
				ball.x = ballPos.x;
				ball.y = ballPos.y;
			} );
		}

		function updatePlayerVelocit(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, input: Phaser.Input.InputPlugin) {
			const cursors = input.keyboard.createCursorKeys();
			if (cursors.up.isDown) {
				player.setVelocityY(-500);
			}
			else if (cursors.down.isDown) {
				player.setVelocityY(500);
			}
			else {
				player.setVelocityY(0);
			}
		}
		
		function checkEndGame(phaserScene: Phaser.Scenes.ScenePlugin) {
			if (score.player1 >= endingScore || score.player2 >= endingScore) {
				winningPlayer = score.player1 > score.player2 ? 1 : 2;
				phaserScene.pause();
				setEndGameDisplay({
					player1Name: "PLAYER 1",
					player2Name: "PLAYER 2",
					winner: winningPlayer
				})
				setEndGameVisible(true);
				sleep(1000).then(() => {game.destroy(true);});
			}
		}

	function HandleCollision(this: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) : void {
		if (this.y < ball.y) {
			ball.setVelocityY(-10 * (this.y - ball.y));
		}
		else if (this.y > ball.y) {
			ball.setVelocityY(10 * (ball.y - this.y));
		}
	}

	function sleep(milliseconds: number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

	function increaseP1Score() {
		setScore([score.player1 += 1, score.player2]);
		gameSocket.emit('score', {player1: score.player1, player2: score.player2} );
		initializeBall();
		startBall()
	}

	function increaseP2Score() {
		setScore([score.player1, score.player2 += 1]);
		gameSocket.emit('score', {player1: score.player1, player2: score.player2} );
		initializeBall();
		startBall()
	}

	function initializeBall() {
		ball.x = screenWidth / 2;
		ball.y = screenHeight / 2;
		ball.body.velocity.setTo(0);
	}

	function startBall() {
		sleep(700).then(() => {
			setBallVelocity();	
		});
	}

	function setBallVelocity() {
		const velocity = Math.floor(Math.random() * 2);
		ball.body.velocity.setTo(ballVelocity[velocity]);
	}

	function start(this: Phaser.Scene) : void {
		(ball.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
		setBallVelocity()
		ball.setBounce(1);
		this.physics.add.collider(ball, player1, HandleCollision, () => (console.log("COLLIDED WITH PLAYER 1")), player1);
		this.physics.add.collider(ball, player2, HandleCollision, () => (console.log("COLLIDED WITH PLAYER 2")), player2);
		this.physics.add.collider(ball, rightGoal, increaseP1Score, () => (console.log("COLLIDED WITH RIGHT GOAL")), rightGoal);
		this.physics.add.collider(ball, leftGoal, increaseP2Score, () => (console.log("COLLIDED WITH LEFT GOAL")), leftGoal);
	}

	function updateScore() {
		gameSocket.off('score').on('score', (scoreFromSocket: Score) => {
			score = scoreFromSocket;	
			setScore([score.player1, score.player2]);
		} );
	}

	}, [])

	return (<div id="transcendence-pong-game" />)
}

export default PhaserGame
