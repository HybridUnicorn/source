
module Contrast {

    export class Dialog extends Phaser.Graphics {

        buffer: Array<string>

        text: Phaser.Text

        talking: boolean = false
        ending: Function
        once: Function = null
        context: any

        constructor(game: Phaser.Game) {

            super(game, 0, 0)

            this.beginFill(0x000000, .7)

            this.drawRect(0, 0, 480, 80)

            this.fixedToCamera = true
            this.cameraOffset = new Phaser.Point(0, 240)

            this.alpha = 0

            this.game.add.existing(this)

        }

        process(msg: string) {

            if (msg) {

                this.buffer = msg.split('$')

                this.talking = true

                if (this.buffer.length > 0) {
                    this.show()

                } else {
                    this.close()
                }
            } else {
                this.close()
            }

        }

        onEnd(func: Function, context: any) {
            this.ending = func
            this.context = context
        }

        endOnce(func: Function, context: any) {
            this.once= func
            this.context = context
        }

        show() {
            this.game.add.tween(this).to({ alpha: 1 }, 100).start()
            this.next()
        }

        next() {

            if (this.text) {
                this.text.destroy()
            }

            if (this.buffer.length > 0) {
                this.text = this.game.add.text(0, 30, this.buffer.shift(), { font: "20px Droid Sans", fill: "#ffffff", align: "center" })
                this.text.alpha = 0
                this.text.x = 480 / 2 - this.text.width / 2
                this.addChild(this.text)
                this.text.y += 20
                this.game.add.tween(this.text).to({ y: '-20', alpha: 1 }, 200).start()
            } else {
                this.close()
            }

        }

        close() {
            this.game.add.tween(this).to({ alpha: 0 }, 100).start()
            this.talking = false
            if (this.once) {
                this.once.call(this.context)
                this.once = null
            } else {
                this.ending.call(this.context)
            }
            

        }

    }

}
