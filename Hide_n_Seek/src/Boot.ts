
module Contrast {

    export class Boot extends Phaser.State {

        preload() {

            this.game.stage.backgroundColor = 0x00627C
            this.load.audio('s_love', 'assets/Young_And_Old_Know_Love.mp3')

        }

        create() {

            var style = { font: '65px Droid Sans', fill: '#ffffff', align: 'left' }
            var t = this.game.add.text(0, 0, 'void', style)
            t.destroy()

            // Game config
		    this.game.physics.startSystem(Phaser.Physics.ARCADE)

            this.game.state.start('loader')

        }

    }

}
