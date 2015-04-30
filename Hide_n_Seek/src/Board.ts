
module Contrast {

    export class Board extends Phaser.Sprite {

        data: any
        state: Menu
        unlocked: boolean
        drops: Phaser.Group

        constructor(game: Phaser.Game, i: number, state: Menu, data: any) {

            var x = 16 + (i % 3) * 160
            var y = 56 + Math.floor(i / 3) * 110

            super(game, x, y, 'pixel')

            this.data = data
            this.state = state
            this.unlocked = false
            var color = Phaser.Color.valueToColor(data.gray)
            Game.debloqued.forEach((j: number) => {
                if (j == i) {
                    this.unlocked = true
                    color = Phaser.Color.valueToColor(data.color)
                }
            }, this)

            this.tint = Phaser.Color.getColor(color.r, color.g, color.b)
            this.scale.setTo(128, 78)

            this.inputEnabled = true
            this.input.useHandCursor = true

            if (this.unlocked) {

                this.events.onInputUp.add(() => {
                    this.state.goTo(this.data.name)
                }, this)

            } else {

                this.events.onInputOver.add(() => {
                    this.drops.alpha = 1
                }, this)

                this.events.onInputOut.add(() => {
                    this.drops.alpha = 0
                }, this)

                this.events.onInputDown.add(() => {
                    // Can I buy it ?
                    var okay = true

                    // Test
                    this.data.drops.split('').forEach((d: string) => {
                        switch (d) {
                            case "1":
                                if (Game.drops.blue < 1) {
                                    okay = false
                                }
                                break
                            case "2":
                                if (Game.drops.red < 1) {
                                    okay = false
                                }
                                break
                            case "3":
                                if (Game.drops.yellow < 1) {
                                    okay = false
                                }
                                break
                        }
                    }, this)

                    // Buy
                    if (okay) {

                        // Unlock it !
                        Game.debloqued.push(i)

                        Game.fromBoot = true

                        // Delete drop from inventory
                        this.data.drops.split('').forEach((d: string) => {
                            switch (d) {
                                case "1":
                                    --Game.drops.blue
                                    break
                                case "2":
                                    --Game.drops.red
                                    break
                                case "3":
                                    --Game.drops.yellow
                                    break
                            }
                        }, this)

                        // Refresh page
                        this.game.state.start('menu')
                    }
                }, this)
            }

            this.game.add.existing(this)

            if (this.unlocked) {

                if (Game.master[this.data.name]) {
                    this.game.add.sprite(x + 88, y, 'masterpiece')
                }

                y += 70

                for (var j = 0; j < Game.helped[this.data.name]; ++j) {
                    var tmp = this.game.add.sprite(x, y, 'citizen')
                    tmp.anchor.setTo(0, 1)
                    x += 20
                }

            } else {


                this.drops = this.game.add.group()
                y += 8
                x += 8

                function drawDrop(type: string) {
                        this.drops.create(x, y, "drop_" + type)
                    x += 28
                }

                    this.data.drops.split('').forEach((d: string) => {
                        switch (d) {
                            case "1":
                                drawDrop.call(this, "blue")
                            break
                        case "2":
                                drawDrop.call(this, "red")
                            break
                        case "3":
                                drawDrop.call(this, "yellow")
                            break
                    }
                    }, this)


                this.drops.alpha = 0

            }


        }

    }

}
