import Phaser from 'phaser';
import React from 'react'

export class PhaserGame extends React.Component {
	componentDidMount(): void {
		const gameConfig: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: 500,
			height: 500,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 1500 },
					debug: false,
				},
			},
			scene: [],
		}
		new Phaser.Game(gameConfig);
	}
	shouldComponentUpdate(): boolean {
		return false;
	}
	render(): React.ReactNode {
		return <div id="transcendence-pong-game" />;
	}
}
