
module Contrast {

    export class Menu extends Phaser.State {


        create() {

            // Save everything
            Game.save()

            document.querySelector('canvas')['style'].cursor = 'default'

            this.game.stage.backgroundColor = 0xFFFFFF

            this.createDrops()
            this.createBoards()
            this.createMasterpiece()

            if (Game.fromBoot) {
                Game.fromBoot = false

            } else {
                Game.music.stop()
                Game.music = this.game.add.audio('s_love', 1, true)
                Game.music.play()
            }

        }

        createDrops() {

            var x = 16
            var codes = ['blue', 'red', 'yellow']

            for (var i = 0; i < codes.length; ++i) {
                for (var j = 0; j < Game.drops[codes[i]]; ++j) {

                    this.game.add.sprite(x, 16, 'drop_' + codes[i])
                    x += 32

                }
            }

        }

        createBoards() {

            var levels = JSON.parse(this.game.cache.getText('levels'))

            for (var i = 0; i < levels.list.length; ++i) {
                var level = levels.list[i]
                
                new Board(this.game, i, this, level)

            }

        }

        createMasterpiece() {
            if (Object.keys(Game.master).length == 6) {
                var m = this.game.add.sprite(240, 282, 'masterpiece')
                m.anchor.setTo(.5)
                m.tint = 0xffb618
            }
        }

        goTo(name: string) {

            // Start selected level
            Game.music.stop()
            Game.level_code = name
            Game.level_name = 'level_' + name
            this.game.state.start('level')

        }

    }

}
