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
}

export const PhaserGame: FunctionComponent<Props> = ({setScore, setEndGameVisible, setEndGameDisplay}) => {
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
		let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
		let keyW : Phaser.Input.Keyboard.Key;
		let keyS : Phaser.Input.Keyboard.Key;
		let ballVelocity : number[] = [1000, -1000];
		let screenWidth : number = window.innerWidth;
		let screenHeight : number = window.innerHeight;

		let player1PosY: number = 0;
		let player2PosY: number = 0;
		let ballPosX: number = 0;
		let ballPosY: number = 0;

		let player1Score: number = 0;
		let player2Score: number = 0;
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
			this.time.delayedCall(1000, start, [], this);

		}

		function update(this: Phaser.Scene): void {

			keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
			keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
			cursors = this.input.keyboard.createCursorKeys();

			updatePlayer1Position();
			updatePlayer2Position();
			updateBallPosition();

			updatePlayer1Velocit(keyW, keyS);
			updatePlayer2Velocit(cursors);
		
			checkEndGame(this.scene);
		}

		function updatePlayer1Position() {
			if (player1.y != player1PosY) {
				gameSocket.emit('player1', "PLAYER 1 Y POSITION: " + player1.y);
				player1PosY = player1.y;
			}
			gameSocket.off('player1').on('player1', (msg) => {
				console.log(msg);
			} );
		}
		
		function updatePlayer2Position() {
			if (player2.y != player2PosY) {
				gameSocket.emit('player2', "PLAYER 2 Y POSITION: " + player2.y);
				player2PosY = player2.y;
			}
			gameSocket.off('player2').on('player2', (msg) => {
				console.log(msg);
			} );
		}

		function updateBallPosition() {
			if (ball.x != ballPosX || ball.y != ballPosY) {
				gameSocket.emit('ball', "BALL POSITION X: " + ball.x + " Y: " + ball.y);
				ballPosX = ball.x;
				ballPosY = ball.y;
			}
			gameSocket.off('ball').on('ball', (msg) => {
				console.log(msg);
			} );
		}
		
		function updatePlayer1Velocit(keyW: any, keyS: any) {
			if (keyW.isDown) {
				player1.setVelocityY(-500);
			}
			else if (keyS.isDown) {
				player1.setVelocityY(500);
			}
			else {
				player1.setVelocityY(0);
			}
		}
		
		function updatePlayer2Velocit(cursors: any) {
			if (cursors.up.isDown) {
				player2.setVelocityY(-500);
			}
			else if (cursors.down.isDown) {
				player2.setVelocityY(500);
			}
			else {
				player2.setVelocityY(0);
			}
		}
		
		function checkEndGame(phaserScene: any) {
			if (player1Score >= endingScore || player2Score >= endingScore) {
				winningPlayer = player1Score > player2Score ? 1 : 2;
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

	function increaseP1Score(this: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
		setScore([player1Score += 1, player2Score]);
		ball.x = screenWidth / 2;
		ball.y = screenHeight / 2;
		ball.body.velocity.setTo(0);
		sleep(700).then(() => {ball.body.velocity.setTo(ballVelocity[Math.floor(Math.random() * 2)], ballVelocity[Math.floor(Math.random() * 2)]);});
	}

	function increaseP2Score(this: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
		setScore([player1Score, player2Score += 1]);
		ball.x = screenWidth / 2;
		ball.y = screenHeight / 2;
		ball.body.velocity.setTo(0);
		sleep(700).then(() => {ball.body.velocity.setTo(ballVelocity[Math.floor(Math.random() * 2)], ballVelocity[Math.floor(Math.random() * 2)]);});
	}

	function start(this: Phaser.Scene) : void {
		(ball.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
		ball.body.velocity.setTo(ballVelocity[Math.floor(Math.random() * 2)], ballVelocity[Math.floor(Math.random() * 2)]);
		ball.setBounce(1);
		this.physics.add.collider(ball, player1, HandleCollision, () => (console.log("COLLIDED WITH PLAYER 1")), player1);
		this.physics.add.collider(ball, player2, HandleCollision, () => (console.log("COLLIDED WITH PLAYER 2")), player2);
		this.physics.add.collider(ball, rightGoal, increaseP1Score, () => (console.log("COLLIDED WITH RIGHT GOAL")), rightGoal);
		this.physics.add.collider(ball, leftGoal, increaseP2Score, () => (console.log("COLLIDED WITH LEFT GOAL")), leftGoal);
		
	}

	}, [])

	return (<div id="transcendence-pong-game" />)
}

export default PhaserGame
