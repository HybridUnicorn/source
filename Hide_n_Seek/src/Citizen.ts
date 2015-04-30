
module Contrast {

    export class Citizen extends Phaser.Sprite {

        static id = 0

        help: Phaser.Text
        drop: any
        done: boolean = false

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'citizen')

            this.game.physics.arcade.enable(this)

            this.body.immovable = true

            this.help = this.game.add.text(18, 0, '!', { font: "16px Arial", fill: "#ffffff", align: "center" })

            this.addChild(this.help)

            this['id'] = Citizen.id++

            // Anim
            this.help.alpha = 0
            var tween = this.game.add.tween(this.help)
            tween.to({ y: '-8', alpha: 1 }, 200).to({ alpha: 0 }, 200).to({ y: '+8' }, 1).delay(5000).loop().start()

        }

        tintCit(tint: number) {
            this.tint = tint
        }

        tintHelp(tint: number) {
            this.help.tint = tint
        }

        killYou() {
            if (Game.rescued[Game.level_code][this['id']]) {
                this.visible = false
            }
        }

    }

}
 