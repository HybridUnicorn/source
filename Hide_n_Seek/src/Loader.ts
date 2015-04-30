
module Contrast {

    export class Loader extends Phaser.State {

        orange: Phaser.Graphics

        loadAssets() {

            this.load.text('levels', 'assets/levels.json')
            this.load.text('credit', 'assets/credit.txt')

            // Music ^^'
            this.load.audio('s_jump', 'assets/146726_2437358-lq.mp3')
            this.load.audio('s_spirit', 'assets/152721_2578041-lq.mp3')
            this.load.audio('s_master', 'assets/Mature_Sounds_(Sting).mp3')
            this.load.audio('s_hurt', 'assets/hurt.mp3')
            this.load.audio('s_bossa', 'assets/203419_bossa_nova_loop.mp3')
            this.load.audio('s_night', 'assets/Night_Music.mp3')
            this.load.audio('s_juicy', 'assets/Juicy.mp3')
            this.load.audio('s_mermaid', 'assets/613978_Mermaid.mp3')

            // Level data
            this.load.tilemap('level_tuto', 'assets/level_tuto.json', null, Phaser.Tilemap.TILED_JSON)
            this.load.tilemap('level_regular', 'assets/level_regular.json', null, Phaser.Tilemap.TILED_JSON)
            this.load.tilemap('level_wave', 'assets/level_wave.json', null, Phaser.Tilemap.TILED_JSON)
            this.load.tilemap('level_fall', 'assets/level_fall.json', null, Phaser.Tilemap.TILED_JSON)
            this.load.tilemap('level_without', 'assets/level_without.json', null, Phaser.Tilemap.TILED_JSON)
            this.load.tilemap('level_reverse', 'assets/level_reverse.json', null, Phaser.Tilemap.TILED_JSON)
            this.load.tilemap('level_snow', 'assets/level_snow.json', null, Phaser.Tilemap.TILED_JSON)

            // Sprites
            this.load.image('tileset', 'assets/tileset.png')
            this.load.image('player-undefined', 'assets/player.png')
            this.load.image('player-1', 'assets/player-1.png')
            this.load.image('player-2', 'assets/player-2.png')
            this.load.image('player-3', 'assets/player-3.png')
            this.load.image('player-4', 'assets/player-4.png')
            this.load.image('player-5', 'assets/player-5.png')
            this.load.image('player-6', 'assets/player-6.png')
            this.load.image('peak', 'assets/peak.png')
            this.load.image('peak_reverse', 'assets/peak_reverse.png')
            this.load.image('enemy', 'assets/enemy.png')
            this.load.image('platform', 'assets/platform.png')
            this.load.image('pixel', 'assets/pixel.png')
            this.load.image('drop_blue', 'assets/drop_blue.png')
            this.load.image('drop_red', 'assets/drop_red.png')
            this.load.image('drop_yellow', 'assets/drop_yellow.png')
            this.load.image('arrow_left', 'assets/arrow_left.png')
            this.load.image('arrow_right', 'assets/arrow_right.png')
            this.load.image('arrow_up', 'assets/arrow_up.png')
            this.load.image('citizen', 'assets/citizen.png')
            this.load.image('note', 'assets/note.png')
            this.load.image('masterpiece', 'assets/masterpiece.png')
            this.load.image('thief', 'assets/thief.png')
            this.load.image('mark-1', 'assets/mark-1.png')
            this.load.image('mark-2', 'assets/mark-2.png')
            this.load.image('mark-3', 'assets/mark-3.png')
            this.load.image('mark-4', 'assets/mark-4.png')
            this.load.image('mark-5', 'assets/mark-5.png')
            this.load.image('title', 'assets/title.png')
            this.load.image('circle-1', 'assets/circle-1.png')
            this.load.image('circle-2', 'assets/circle-2.png')
            this.load.image('circle-3', 'assets/circle-3.png')
            this.load.image('hybrid_unicorn', 'assets/hybrid_unicorn.png')

            this.load.start()
        }

        create() {

            //this.game.sound.mute = true

            Game.music = this.game.add.audio('s_love', 1, true)
            Game.music.play()

            this.orange = this.game.add.graphics(0, 0)
            this.orange.beginFill(0xff9900)
            this.orange.drawRect(0, 0, this.game.world.width, this.game.world.height)
            this.orange.scale.x = 0

            this.game.load.onFileComplete.add(this.fileComplete, this)
			this.game.load.onLoadComplete.add(this.loadComplete, this)
			this.loadAssets()

        }

        fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
            this.orange.scale.x = progress / 100
		}

        loadComplete() {
            this.game.state.start('title')
		}

    }

}
