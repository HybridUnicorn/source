
module Contrast {

    export class Dual extends Phaser.Sprite {

        soulmate: Phaser.Sprite

        constructor(game: Phaser.Game, x: number, y: number, key: string) {

            super(game, x, y, key)
            this.soulmate = this.game.add.sprite(x, y, key)

        }

        setTint(tint: number) {

            this.tint = tint
            this.soulmate.tint = tint

        }

        setReverse() {
            if (this['reversed']) {
                this.y -= 30
                this.soulmate.y -= 30
            }
        }

        setMask(spot: Spot) {

            this.mask = spot.getAura()
            this.soulmate.mask = spot.getMate()

        }

        update() {
            this.soulmate.position = this.position
        }

        fadeAway() {
            this.game.add.tween(this).to({ alpha: 0 }, 200).start()
            this.game.add.tween(this.scale).to({ x: 2, y: 2 }, 200).start()

            this.game.add.tween(this.soulmate).to({ alpha: 0 }, 200).start()
            this.game.add.tween(this.soulmate.scale).to({ x: 2, y: 2 }, 200).start()
        }

    }

}
