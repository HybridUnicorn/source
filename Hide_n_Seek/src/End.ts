
module Contrast {

    export class End extends Phaser.Sprite {

        second: Phaser.Sprite
        third: Phaser.Sprite

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'pixel')

            this.scale.setTo(40, this.game.world.height)
            this.y = this.game.world.height

            this.second = this.game.add.sprite(0, 0, 'pixel')
            this.third = this.game.add.sprite(0, 0, 'pixel')

            this.addChild(this.second)
            this.addChild(this.third)

        }

        setSpot(spot: Spot, tint: number) {

            this.second.mask = spot.getAura()
            this.third.mask = spot.getMate()

            this.second.tint = this.third.tint = tint
        }



    }

}