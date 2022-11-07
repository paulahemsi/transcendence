import Phaser from 'phaser';
import React from 'react'
import io from 'socket.io-client';

const gameSocket = io('/game');

export class PhaserGame extends React.Component {
	componentDidMount(): void {
		const gameConfig: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
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
		new Phaser.Game(gameConfig);

		let player1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let player2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
		let keyW : Phaser.Input.Keyboard.Key;
		let keyS : Phaser.Input.Keyboard.Key;
		let ballVelocity : number[] = [1000, -1000];

		let player1PosY: number = 0;
		let player2PosY: number = 0;
		let ballPosX: number = 0;
		let ballPosY: number = 0;

		function preload(this: Phaser.Scene): void {
	
			this.load.image('pad', require('./assets/pad.png'));
			this.load.image('ball', require('./assets/ball.png'));
		}

		function create(this: Phaser.Scene): void {
			gameSocket.connect();
			player1 = this.physics.add.sprite(100, 450, 'pad');
			player2 = this.physics.add.sprite(1750, 450, 'pad');
			ball = this.physics.add.sprite(this.sys.canvas.height / 2, this.sys.canvas.height / 2, 'ball');

			player1.setCollideWorldBounds(true);
			player1.body.setImmovable(true);
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

			if (player1.y != player1PosY) {
				gameSocket.emit('player1', "PLAYER 1 Y POSITION: " + player1.y);
				player1PosY = player1.y;
			}

			if (player2.y != player2PosY) {
				gameSocket.emit('player2', "PLAYER 2 Y POSITION: " + player2.y);
				player2PosY = player2.y;
			}

			if (keyW.isDown) {
				player1.setVelocityY(-500);
			}
			else if (keyS.isDown) {
				player1.setVelocityY(500);
			}
			else {
				player1.setVelocityY(0);
			}

			if (cursors.up.isDown) {
				player2.setVelocityY(-500);
			}
			else if (cursors.down.isDown) {
				player2.setVelocityY(500);
			}
			else {
				player2.setVelocityY(0);
			}

			if (ball.x != ballPosX || ball.y != ballPosY) {
				gameSocket.emit('ball', "BALL POSITION X: " + ball.x + " Y: " + ball.y);
				ballPosX = ball.x;
				ballPosY = ball.y;
			}

			gameSocket.off('player1').on('player1', (msg) => {
				console.log(msg);
			} );

			gameSocket.off('player2').on('player2', (msg) => {
				console.log(msg);
			} );

			gameSocket.off('ball').on('ball', (msg) => {
				console.log(msg);
			} );
		}

	function HandleCollision(this: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) : void {
		if (this.y < ball.y)
		{
		ball.setVelocityY(-10 * (this.y - ball.y));
		}
		else if (this.y > ball.y)
		{
		ball.setVelocityY(10 * (ball.y - this.y));
		}
	}	

	function start(this: Phaser.Scene) : void {
		(ball.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
		ball.body.velocity.setTo(ballVelocity[Math.floor(Math.random() * 2)], ballVelocity[Math.floor(Math.random() * 2)]);
		ball.setBounce(1);
		this.physics.add.collider(ball, player1, HandleCollision, () => (console.log("COLLIDED WITH PLAYER 1")), player1);
		this.physics.add.collider(ball, player2, HandleCollision, () => (console.log("COLLIDED WITH PLAYER 2")), player2);
	}
}

	shouldComponentUpdate(): boolean {
		return false;
	}
	render(): React.ReactNode {
		return <div id="transcendence-pong-game" />;
	}
}
