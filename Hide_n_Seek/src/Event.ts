 
module Contrast {

    export class EventTouch extends Phaser.Sprite {

        callback: any

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'pixel')

            this.scale.setTo(16, this.game.world.height)
            this.y = this.game.world.height

            this.alpha = 0

        }

    }

}
