
module Contrast {

    export class Platform extends Phaser.Sprite {

        vertical: any
        horizontal: any
        max: number
        min: number

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'platform')

            this.game.physics.arcade.enable(this)

            this.body.immovable = true

        }

        move() {

            if (this.vertical) {

                this.vertical = parseInt(this.vertical)

                this.max = this.y
                this.min = this.y - this.vertical * 40
                
                this.body.velocity.y = -100

            }

            if (this.horizontal) {

                this.horizontal = parseInt(this.horizontal)

                this.min = this.x
                this.max = this.x + this.horizontal * 40

                this.body.velocity.x = 100

            }

        }

        update() {

            // Y Bounce
            if (this.vertical) {
                if (this.y < this.min) {
                    this.body.velocity.y = 100
                } else if (this.y > this.max) {
                        this.body.velocity.y = -100
                }
            }

            // X Bounce
            if (this.horizontal) {
                if (this.x < this.min) {
                    this.body.velocity.x = 100
                } else if (this.x > this.max) {
                    this.body.velocity.x = -100
                }
            }
            
            super.update()

        }

    }

}
