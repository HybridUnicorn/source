
module Contrast {

    export class Checkpoint extends Phaser.Sprite {

        spawn: any

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'pixel')

            this.scale.setTo(16, this.game.world.height)
            this.y = this.game.world.height

            this.alpha = 0

            this.spawn = { x: x, y: y }

        }

    }

}
