module Contrast {

    export class Credit extends Phaser.State {

        header1 = { font: '65px Droid Sans', fill: '#ffffff', align: 'center' }
        header2 = { font: '48px Droid Sans', fill: '#ffffff', align: 'center' }
        header3 = { font: '32px Droid Sans', fill: '#ffffff', align: 'center' }
        content = { font: '24px Droid Sans', fill: '#ffffff', align: 'center' }

        create() {

            Game.save()
            Game.fromBoot = true

            this.game.stage.backgroundColor = '#000000'

            var texts = this.game.add.group()
            var credits = this.game.cache.getText('credit').split('\n')
            var y = 0

            for (var i in credits) {
                var line = credits[i]
                var text: any

                if (/_hu_/.test(line)) {
                    text = this.game.add.sprite(0, y, 'hybrid_unicorn')
                    y += 110

                } else if (/^###/.test(line)) {
                    line = line.replace(/^###/, '')
                    text = this.game.add.text(0, y, line, this.header3)
                    y += 50

                } else if (/^##/.test(line)) {
                    line = line.replace(/^##/, '')
                    text = this.game.add.text(0, y, line, this.header2)
                    y += 60

                } else if (/^#/.test(line)) {
                    line = line.replace(/^#/, '')
                    text = this.game.add.text(0, y, line, this.header1)
                    y += 100

                } else {
                    text = this.game.add.text(0, y, line, this.content)
                    y += 30

                }

                text.x = 240 - (text.width / 2)

                texts.addChild(text)
            }

            texts.y = 320

            var tween = this.game.add.tween(texts).to({ y: -y + 170 }, y * 30)

            tween.onComplete.add(() => {

                this.game.add.tween(texts).to({ alpha: 0 }, 2000).start()
                this.game.time.events.add(Phaser.Timer.SECOND * 5, () => { this.game.state.start('title') }, this)

            }, this)
            tween.start()

        }

    }

}