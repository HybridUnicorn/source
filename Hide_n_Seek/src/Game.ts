
module Contrast {
    
    export class Game extends Phaser.Game {

        // Store name when call Level State
        static level_code: string
        static level_name: string

        static vel = 200
        static jump = -420

        static music: Phaser.Sound
        static fromBoot = true

        /*
        ** Save data
        */

        static rescued = {
            "regular": {},
            "snow": {},
            "wave": {},
            "fall": {},
            "reverse": {},
            "without": {}
        }

        static master = {}

        // Player's drops
        static drops = {
            blue: 0,
            red: 0,
            yellow: 0
        }

        static helped = {
            "regular": 2,
            "snow": 0,
            "wave": 2,
            "fall": 1,
            "reverse": 1,
            "without": 2
        }
        
        // Debloqued
        static debloqued = [0]

        static load() {
            Game.debloqued = JSON.parse(localStorage.getItem("debloqued"))
            Game.helped = JSON.parse(localStorage.getItem("helped"))
            Game.drops = JSON.parse(localStorage.getItem("drops"))
            Game.master = JSON.parse(localStorage.getItem("master"))
            Game.rescued = JSON.parse(localStorage.getItem("rescued"))
        }

        static save() {
            localStorage.setItem("saved", "true")
            localStorage.setItem("debloqued", JSON.stringify(Game.debloqued))
            localStorage.setItem("helped", JSON.stringify(Game.helped))
            localStorage.setItem("drops", JSON.stringify(Game.drops))
            localStorage.setItem("master", JSON.stringify(Game.master))
            localStorage.setItem("rescued", JSON.stringify(Game.rescued))
        }

        /****/

        constructor() {

            super(480, 320, Phaser.AUTO, 'content', null, false, false)

            this.state.add('boot', Boot)
            this.state.add('loader', Loader)
            this.state.add('title', Title)
            this.state.add('menu', Menu)
            this.state.add('level', Level)
            this.state.add('credit', Credit)

            this.state.start('boot')

        }

    }

}
