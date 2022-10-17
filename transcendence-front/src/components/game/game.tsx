import Phaser from 'phaser';
import React from 'react'

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

		let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
		let ballVelocity : number[] = [1000, -1000];

		function preload(this: Phaser.Scene): void {
	
			this.load.image('pad', require('./assets/pad.png'));
			this.load.image('ball', require('./assets/ball.png'));
		}

		function create(this: Phaser.Scene): void {
			player = this.physics.add.sprite(100, 450, 'pad');
			ball = this.physics.add.sprite(this.sys.canvas.height / 2, this.sys.canvas.height / 2, 'ball');

			player.setCollideWorldBounds(true);
			player.body.setImmovable(true);
			ball.setCollideWorldBounds(true);
			ball.setAcceleration(0);
			this.time.delayedCall(1000, start, [], this);
		}

		function update(this: Phaser.Scene): void {
			cursors = this.input.keyboard.createCursorKeys();
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
		this.physics.add.collider(ball, player, HandleCollision, undefined, player);
	}
}

	shouldComponentUpdate(): boolean {
		return false;
	}
	render(): React.ReactNode {
		return <div id="transcendence-pong-game" />;
	}
}
