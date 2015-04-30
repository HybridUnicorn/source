
module Contrast {

    export class Npc extends Phaser.Sprite {

        dialog: any

        constructor(game: Phaser.Game, x: number, y: number, key: string) {

            super(game, x, y, key)

            this.game.physics.arcade.enable(this)

            this.body.immovable = true

        }

    }

}
