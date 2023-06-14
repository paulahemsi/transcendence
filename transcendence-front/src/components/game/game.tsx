import Phaser from 'phaser';
import React, { FunctionComponent, useContext, useState } from 'react'
import { useEffect } from 'react';
import { gameSocket } from '../context/socket';
import { MatchContext } from '../context/MatchContext';
import { EndGameData } from '../GamePage';
import { getAuthToken } from "../utils/constants";
import axios from "axios";

interface Props {
	setScore: React.Dispatch<React.SetStateAction<number[]>>
	setEndGameVisible: React.Dispatch<React.SetStateAction<boolean>>
	setEndGameDisplay: React.Dispatch<React.SetStateAction<EndGameData>>
	setIsSpectator: React.Dispatch<React.SetStateAction<boolean>>
	isHost: boolean
	isSpectator: boolean
	matchRoom: string
	standardMode: boolean
}

interface Ball {
	x: number;
	y: number;
}

interface Score {
	player1: number;
	player2: number;
}

const envType = process.env.REACT_APP_ENV;

export const PhaserGame: FunctionComponent<Props> = ({
	setScore,
	setEndGameVisible,
	setEndGameDisplay,
	setIsSpectator,
	isHost,
	isSpectator,
	matchRoom,
	standardMode,
}) => {
	useEffect(() =>  {
		const gameConfig: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: window.innerWidth - 4,
			height: window.innerHeight - 4,
			transparent: standardMode ? false : true,
			backgroundColor:'#110931',
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
				update: isSpectator ? updateSpectator : (isHost ? updateHost : updateGuest)
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
		let endingScore: number =  10;
		let winningPlayer: 1 | 2 | undefined = undefined;

		function preload(this: Phaser.Scene): void {
			this.load.image('pad', (standardMode ? require('./assets/pad.png') : require('./assets/rainbow_pad.png')));
			this.load.image('ball', (standardMode ? require('./assets/ball.png') : require('./assets/rainbow_ball.png')));
		}

		function create(this: Phaser.Scene): void {
			joinGameRoom();
			player1 = this.physics.add.sprite(screenWidth * 0.1, screenHeight * 0.5, 'pad');
			player1.displayWidth = screenWidth * 0.05;
			player1.displayHeight = screenHeight * 0.35;
			player2 = this.physics.add.sprite(screenWidth * 0.9, screenHeight * 0.5, 'pad');
			player2.displayWidth = screenWidth * 0.05;
			player2.displayHeight = screenHeight * 0.35;
			ball = this.physics.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'ball').setSize(15, 15);
			ball.displayWidth = screenWidth * 0.075;
			ball.displayHeight = ball.displayWidth;
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
			listenStopGame(this.scene);
		}

		function updateSpectator(this: Phaser.Scene): void {
			updatePlayer1PositionFromSocket();
			updatePlayer2PositionFromSocket();
			updateBallPositionFromSocket();
			checkEndGame(this.scene);
		}

		function updateHost(this: Phaser.Scene): void {
			updatePlayerVelocity(player1, this.input);
			if (player1.y != player1PosY) {
				updatePlayer1Position();
			}
			updatePlayer2PositionFromSocket();
			if (ball.x != ballPos.x || ball.y != ballPos.y) {
				updateBallPosition();
			}
			checkEndGame(this.scene);
		}

		function updateGuest(this: Phaser.Scene): void {
			updatePlayerVelocity(player2, this.input);
			updatePlayer1PositionFromSocket();
			if (player2.y != player2PosY) {
				updatePlayer2Position();
			}
			updateBallPositionFromSocket();
			checkEndGame(this.scene);
		}

		function updatePlayer1Position() {
			if (envType == "PROD") {
				player1PosY = player1.y + (player1.body.velocity.y * 0.070);
			} else {
				player1PosY = player1.y;
			}
			gameSocket.emit('player1', { room: matchRoom, value: player1PosY / screenHeight });
		}

		function updatePlayer1PositionFromSocket() {
			gameSocket.off('player1').on('player1', (pos: number) => {
				player1.y = pos * screenHeight;
			} );
		}
		
		function updatePlayer2Position() {
			if (envType == "PROD") {
				player2PosY = player2.y + (player2.body.velocity.y * 0.070);
			} else {
				player2PosY = player2.y;
			}
			gameSocket.emit('player2', { room: matchRoom, value: player2PosY / screenHeight });
		}

		function updatePlayer2PositionFromSocket() {
			gameSocket.off('player2').on('player2', (pos: number) => {
				player2.y = pos * screenHeight;
			} );
		}
		
		function updateBallPosition() {
			if (envType == "PROD") {
				ballPos.x = ball.x + (ball.body.velocity.x * 0.070);
				ballPos.y = ball.y + (ball.body.velocity.y * 0.070);
			} else {
				ballPos.x = ball.x;
				ballPos.y = ball.y;
			}
			let normalizedBallPos: Ball = {x: ballPos.x / screenWidth, y: ballPos.y / screenHeight}
			gameSocket.emit('ball', { room: matchRoom, ball: normalizedBallPos });
		}

		function updateBallPositionFromSocket() {
			gameSocket.off('ball').on('ball', (ballPosFromSocket: Ball) => {
				ballPos = ballPosFromSocket;
				ball.x = ballPos.x * screenWidth;
				ball.y = ballPos.y * screenHeight;
			} );
		}

		function updatePlayerVelocity(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, input: Phaser.Input.InputPlugin) {
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
					disconnected: false,
					winner: winningPlayer,
				})
				setEndGameVisible(true);
				leaveGameRoom();
				if (isHost) {
					gameSocket.emit('computeMatch', { room: matchRoom, score: score } );
				}
				sleep(1000).then(() => {game.destroy(true);});
			}
		}

		function joinGameRoom() {
			if (isSpectator) {
				return gameSocket.emit('joinGameRoomAsSpectator', matchRoom);
			}
			return gameSocket.emit('joinGameRoom', matchRoom);
		}

		function leaveGameRoom() {
			if (isSpectator) {
				setIsSpectator(false);
				return gameSocket.emit('leaveGameRoomAsSpectator', matchRoom);
			}
			gameSocket.emit('leaveGameRoom', matchRoom);
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
		gameSocket.emit('score', { room: matchRoom, score: score } );
		initializeBall();
		startBall()
	}

	function increaseP2Score() {
		setScore([score.player1, score.player2 += 1]);
		gameSocket.emit('score', { room: matchRoom, score: score } );
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
		this.physics.add.collider(ball, player1, HandleCollision, undefined);
		this.physics.add.collider(ball, player2, HandleCollision, undefined);
		this.physics.add.collider(ball, rightGoal, increaseP1Score, undefined);
		this.physics.add.collider(ball, leftGoal, increaseP2Score, undefined);
	}

	function updateScore() {
		gameSocket.off('score').on('score', (scoreFromSocket: Score) => {
			score = scoreFromSocket;	
			setScore([score.player1, score.player2]);
		} );
	}

	function listenStopGame(phaserScene: Phaser.Scenes.ScenePlugin) {
		gameSocket.off('stopGame').on('stopGame', () => {
			stopGame(phaserScene);
		} );
	}

	function stopGame(phaserScene: Phaser.Scenes.ScenePlugin) {
		phaserScene.pause();
		setEndGameDisplay({
			disconnected: true,
			winner: winningPlayer,
		})
		setEndGameVisible(true);
		gameSocket.emit('leaveGameRoom', matchRoom);
		sleep(1000).then(() => {game.destroy(true);});
	}

	}, [])

	return (<div id="transcendence-pong-game" />)
}

export default PhaserGame
