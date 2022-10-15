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
		let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

		function preload(this: Phaser.Scene): void {
	
			this.load.image('pad', require('./assets/pad.png'));
		}

		function create(this: Phaser.Scene): void {
			player = this.physics.add.sprite(100, 450, 'pad');
			player.setCollideWorldBounds(true);
		}

		function update(this: Phaser.Scene): void {
			cursors = this.input.keyboard.createCursorKeys();
			if (cursors.up.isDown) {
				player.setVelocityY(-300);
			}
			else if (cursors.down.isDown) {
				player.setVelocityY(300);
			}
			else {
				player.setVelocityY(0);
			}
		}
	}
	shouldComponentUpdate(): boolean {
		return false;
	}
	render(): React.ReactNode {
		return <div id="transcendence-pong-game" />;
	}
}
