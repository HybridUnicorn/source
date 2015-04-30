module Contrast {

    export class Title extends Phaser.State {

        create() {

            this.game.stage.backgroundColor = '#ff9900'

            if (Game.music.isDecoded) {
                this.callback()
            } else {
                Game.music.onDecoded.add(this.callback, this)
            }

        }

        startGame() {

            if (localStorage.getItem("saved")) { // Save find ?

                // Load
                Game.load()

                // GoTo Menu
                this.game.state.start('menu')

            } else {
                // Run tuto
                Game.level_name = 'level_tuto'
                this.game.state.start('level')

            }
        }

        callback() {

            var bg = this.game.add.sprite(0, 0)
            bg.fixedToCamera = true
            bg.scale.setTo(this.game.width, this.game.height)
            bg.inputEnabled = true
            bg.input.priorityID = 0
            bg.events.onInputDown.add(this.startGame, this)

            var hu = this.game.add.sprite(440, 280, 'hybrid_unicorn')
            hu.scale.setTo(.3)
            hu.alpha = 0
            this.game.add.tween(hu).to({ alpha: 1 }, 400).start()

            hu.inputEnabled = true
            hu.input.useHandCursor = true
            hu.input.priorityID = 1
            hu.events.onInputDown.add(() => {
                open('//hybridunicorn.github.io/')
            }, this)


            var c1 = this.game.add.sprite(150, 120, 'circle-3')
            var c2 = this.game.add.sprite(290, 80, 'circle-1')
            var c3 = this.game.add.sprite(320, 190, 'circle-2')

            c1.anchor.setTo(.5)
            c2.anchor.setTo(.5)
            c3.anchor.setTo(.5)

            var title = this.game.add.sprite(0, 0, 'title')
            title.tint = 0xff9900

            // Scale
            c1.scale.set(0, 0)
            c2.scale.set(0, 0)
            c3.scale.set(0, 0)
            this.game.add.tween(c1.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Elastic.Out).delay(100).start()
            this.game.add.tween(c2.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Elastic.Out).start()
            this.game.add.tween(c3.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Elastic.Out).delay(200).start()

            // Anim
            this.game.add.tween(c1).to({ y: '+20' }, 6000, Phaser.Easing.Quadratic.InOut).to({ y: '-20' }, 6000, Phaser.Easing.Quadratic.InOut).loop().start()
            this.game.add.tween(c2).to({ y: '-10' }, 4000, Phaser.Easing.Quadratic.InOut).to({ y: '+10' }, 4000, Phaser.Easing.Quadratic.InOut).loop().start()
            this.game.add.tween(c3).to({ y: '+30' }, 5000, Phaser.Easing.Quadratic.InOut).to({ y: '-30' }, 5000, Phaser.Easing.Quadratic.InOut).loop().start()

            // Click
            this.game.time.events.add(Phaser.Timer.SECOND * 8, () => {
                var text2 = 'click'
                var style2 = { font: '20px Droid Sans', fill: '#ffffff', align: 'left' }

                var tmp = this.game.add.text(20, 280, text2, style2)
                tmp.alpha = 0
                this.game.add.tween(tmp).to({ alpha: .8 }, 1800).to({ alpha: .2 }, 1800).loop().start()
            }, this)


            //this.game.input.onUp.add(this.startGame, this)

        }

    }

}