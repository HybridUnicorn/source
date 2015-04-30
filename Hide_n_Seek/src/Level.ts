
module Contrast {

    export class Level extends Phaser.State {

        // Entity
        map: Phaser.Tilemap
        layer: Phaser.TilemapLayer
        player: Phaser.Sprite
        thief: Dual
        masterpiece: Phaser.Sprite
        dialog: Dialog
        spot: Spot
        cursor: any
        spawn: any
        dialogging: boolean = false
        debugKey: Phaser.Key

        create() {

            this.freePlayer()

            document.querySelector('canvas')['style'].cursor = 'none'
            this.createMap()

            this.playLoop()

            this.createLevel()
            this.createCheckpoints()
            this.createPlayer()
            this.createSpot()
            this.createEnd()
            this.createEnemies()
            this.createBounce()
            this.createNpc()
            this.createPlatforms()
            this.createCitizen()
            this.createDeco()
            this.createEvent()
            this.createThief()
            this.createMasterpiece()
            this.createLandmark()
            this.createDialog()
            this.createDebug()

        }

        update() {

            this.game.physics.arcade.collide(this.player, this.layer)
            this.game.physics.arcade.collide(Entities.enemies, this.layer)
            this.game.physics.arcade.collide(Entities.enemies, Entities.bounce)
            this.game.physics.arcade.collide(this.player, Entities.platforms)
            this.game.physics.arcade.overlap(this.player, Entities.peaks, this.respawn, null, this)
            this.game.physics.arcade.overlap(this.player, Entities.enemies, this.respawn, null, this)
            this.game.physics.arcade.overlap(this.player, Entities.checkpoints, this.checkpoint, null, this)
            this.game.physics.arcade.overlap(this.player, Entities.citizen, this.rescue, null, this)
            this.game.physics.arcade.overlap(this.player, Entities.eventsTouch, this.touching, null, this)
            this.game.physics.arcade.overlap(this.player, Entities.end, this.ending, null, this)
            this.game.physics.arcade.overlap(this.player, Entities.npc, this.discuss, null, this)
            this.game.physics.arcade.overlap(this.player, this.masterpiece, this.dropMaster, null, this)
            this.movePlayer()
            this.spot.update()

        }

        render() {
            if (!this.game.time.advancedTiming) {
                return
            }

            // Quit to menu
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                return this.game.state.start('menu')
            }

            // Drop and go back
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.O)) {
                Game.drops.blue += 3
                Game.drops.red += 3
                Game.drops.yellow += 3
                return this.game.state.start('menu')
            }

            // Deco
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                Entities.deco.alpha = 1
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.H)) {
                Entities.deco.alpha = 0
            }

            // Show enemies
            Entities.peaks.forEach((x: any) => {
                this.game.debug.body(x)
            }, this)

            // Show player
            this.game.debug.body(this.player)
            
            // Display fps
            this.game.debug.text(this.game.time.fps.toString() || "--", 2, 14, "#00ff00")
        }

        getFirst(id: number) {
            var group = this.game.add.group()
            this.map.createFromObjects('object', id, null, 0, false, false, group)
            var child: any = null
            try {
                child = group.getChildAt(0)
            } catch (e) {}
            group.destroy()
            return child // just return x y no ?
        }

        /*
        ** Core feature
        */

        // Respawn player after a death
        respawn() {

            this.game.sound.play('s_hurt', 1)

            this.player.x = this.spawn.x
            this.player.y = this.spawn.y
            this.player.body.velocity.x = 0
            this.player.body.velocity.y = 0

        }

        // Store last checkpoint
        checkpoint(player: Phaser.Sprite, checkpoint: Checkpoint) {

            this.spawn.x = checkpoint.spawn.x
            this.spawn.y = checkpoint.spawn.y

            checkpoint.destroy()

        }

        showDrop(color: string) {
            var drop = this.game.add.sprite(0, 0, 'drop_' + color)
            drop.anchor.setTo(.5, .5)
            drop.fixedToCamera = true
            drop.cameraOffset = new Phaser.Point(240, 160)
            drop.scale.setTo(0, 0)
            this.game.add.tween(drop.scale).to({ y: 1, x: 1 }, 200).to({ y: 2, x: 2 }, 200).start()
            this.game.add.tween(drop).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200).start()
        }

        // Player touch a citizen
        rescue(player: Phaser.Sprite, cit: Citizen) {
            
            if (cit.done) {
                return
            }

            this.game.sound.play('s_spirit', 2)

            // Drop drop
            switch (cit['drop']) {
                case "1":
                    ++Game.drops.blue
                    this.showDrop('blue')
                    break
                case "2":
                    ++Game.drops.red
                    this.showDrop('red')
                    break
                case "3":
                    ++Game.drops.yellow
                    this.showDrop('yellow')
                    break
            }

            // Remove rescued citizen
            --Game.helped[Game.level_code]

            Game.rescued[Game.level_code][cit['id']] = true

            this.game.add.tween(cit).to({ alpha: 0 }, 200).start()
            var tween = this.game.add.tween(cit.scale).to({ x: 2, y: 2 }, 200)
            cit.done = true
            tween.onComplete.add(() => {
                cit.destroy()
            }, this)
            tween.start()

        }

        dropMaster(player: Phaser.Sprite, master: Phaser.Sprite) {
            if (master['done']) {
                return
            }

            this.game.sound.play('s_master', 1)
            master['done'] = true

            Game.master[Game.level_code] = true

            this.game.add.tween(master).to({ alpha: 0 }, 200).start()
            var tween = this.game.add.tween(master.scale).to({ x: 2, y: 2 }, 200)
            tween.onComplete.add(() => {
                master.destroy()
            }, this)
            tween.start()

            // Show big one if all possess
            if (Object.keys(Game.master).length == 6) {
                var master = this.game.add.sprite(0, 0, 'masterpiece')
                master.anchor.setTo(.5)
                master.tint = 0xffb618
                master.fixedToCamera = true
                master.cameraOffset = new Phaser.Point(240, 160)
                master.scale.setTo(0, 0)
                this.game.add.tween(master.scale).to({ y: 8, x: 8 }, 400).to({ y: 16, x: 16 }, 400).start()
                this.game.add.tween(master).to({ alpha: 1 }, 400).to({ alpha: 0 }, 400).start()
            }
    
        }

        // Start touching event
        touching(player: Phaser.Sprite, event: EventTouch) {
            var fn = this[event.callback]
            if (typeof fn === 'function') {
                fn.call(this)
            }
            event.destroy()
        }

        // Start a dialog with a NPC
        discuss(player: Phaser.Sprite, npc: Npc) {

            if (this.cursor.up.isDown) {

                this.dialog.process(npc.dialog)
                this.stopPlayer()

            }

        }

        goodbye() {
            this.dialogging = false
        }

        // End level
        ending() {

            Game.music.stop()
            this.game.state.start('menu')

        }

        inputDialog() {
            if (this.dialog.talking) {
                this.dialog.next()
            }
        }

        stopPlayer() {
            this.dialogging = true
            this.player.body.velocity.x = 0
        }

        freePlayer() {
            this.dialogging = false
        }

        // Move player according to the pressed key
        movePlayer() {

            if (this.dialogging) {
                return

            }

            // Vertical movement
            if (this.cursor.left.isDown) {
                this.player.body.velocity.x = -Game.vel
            } else if (this.cursor.right.isDown) {
                    this.player.body.velocity.x = Game.vel
            } else if (!this.map.properties['slide']) {
                    this.player.body.velocity.x = 0
            }

            // Jump movement
            if (this.cursor.up.isDown && (this.player.body.blocked.up || this.player.body.onFloor() || this.player.body.touching.down)) {
                this.player.body.velocity.y = Game.jump
                this.game.sound.play('s_jump', 0.5)
            }
            

        }

        /*
        ** Scena
        */

        thankyou() {
            this.stopPlayer()
            this.dialog.process('Sir !$I\'am happy to see you !$But people are still trapped !$As a King,$you have to save your citizen.')
        }

        cutscene() {
            this.stopPlayer()
            this.camera.follow(null)
            var tween = this.game.add.tween(this.camera).to({ x: 1330 }, 2000)
            tween.onComplete.add(() => {
                this.spot.fadeAway()
                Game.music.fadeOut(2000)
                this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {

                    this.dialog.process('Sir ! The contrast !$It disappears !!$Are you alright ? I can\'t see you !$How are we going to do ?!')
                    this.dialog.endOnce(() => {

                        this.thief.visible = false
                        this.game.camera.follow(this.player)
                        this.spot.fadeIn()
                        this.freePlayer()
                        
                    }, this)

                }, this)
            }, this)
            tween.start()
        }

        // Level ending dialog

        firstDialog() {
            Game.music.fadeOut(800)
            this.stopPlayer()
            this.dialog.process('Can you guess why ?$Why I stole the Contrast ?$I am sure you can see it.')
            this.dialog.endOnce(() => {
                this.killThief()
                this.freePlayer()
            }, this)
        }

        waveDialog() {
            Game.music.fadeOut(800)
            this.stopPlayer()
            this.dialog.process('Don\'t you see that I\'m different ?$Normal people doesn\'t like different one.')
            this.dialog.endOnce(() => {
                this.killThief()
                this.freePlayer()
            }, this)
        }

        withoutDialog() { // Well, yes, with...
            Game.music.fadeOut(800)
            this.stopPlayer()
            this.dialog.process('Without Contrast, everyone is the same.$Even me !$Me, the eternal anomaly.$Without it I can be like everyone !')
            this.dialog.endOnce(() => {
                this.killThief()
                this.freePlayer()
            }, this)
        }

        reverseDialog() {
            Game.music.fadeOut(800)
            this.stopPlayer()
            this.dialog.process('People like you always reject someone like me.$You can\'t accept difference.$Now,$I\'am like everyone.')
            this.dialog.endOnce(() => {
                this.killThief()
                this.freePlayer()
            }, this)
        }

        fallDialog() {
            Game.music.fadeOut(800)
            this.stopPlayer()
            this.dialog.process('Stop chase me.$Don\'t put Contrast on me.$I don\'t want to be different again.')
            this.dialog.endOnce(() => {
                this.killThief()
                this.freePlayer()
            }, this)
        }

        finalDialog() {
            Game.music.fadeOut(800)
            this.stopPlayer()
            this.dialog.process('Come on, laugh at me.$Like everyone before you did it.$...$Why aren\'t laughing ?$...$Are you accepting me ?$Even if I\'m different ?$How is that possible ?$...$I guess you are...$...tolerant.')
            this.dialog.endOnce(() => {
                
                var bg = this.game.add.graphics(0, 0)
                bg.beginFill(0x000000)
                bg.drawRect(0, 0, this.game.width, this.game.height)
                bg.fixedToCamera = true
                bg.alpha = 0

                Game.music.stop()
                Game.music = this.game.add.audio('s_love', 1, true)
                Game.music.play()

                this.game.add.tween(bg).to({ alpha: 1 }, 2000).start()
                this.game.time.events.add(Phaser.Timer.SECOND * 2, () => { this.game.state.start('credit') }, this)

            }, this)
            
        }

        killThief() {
            this.thief.fadeAway()
        }

        /*
        ** Entity Factory
        */

        playLoop() {
            Game.music.stop()
            Game.music = this.game.add.audio('s_' + this.map.properties['music'], 1, true)
            Game.music.play()
        }

        createMap() {

            this.map = this.game.add.tilemap(Game.level_name)
            this.map.addTilesetImage('tileset', 'tileset')

            // Replace string by real hex
            var prop = ['ocean', 'contrast', 'anomaly']
            for (var i in prop) {
                var color = Phaser.Color.valueToColor(this.map.properties[prop[i]])
                this.map.properties[prop[i]] = Phaser.Color.getColor(color.r, color.g, color.b)
            }

        }

        createPlayer() {

            // Get player spawn
            var spawn = this.getFirst(6)

            // First death point
            this.spawn = { x: spawn.x, y: spawn.y }

            // Player sprite
            this.player = this.game.add.sprite(spawn.x, spawn.y, 'player-' + this.map.properties['player'])
            this.game.physics.arcade.enable(this.player)
            this.player.checkWorldBounds = true
            this.player.events.onOutOfBounds.add(this.respawn, this)
		    this.player.body.gravity.y = 980
            Game.jump = -Math.abs(Game.jump)
            Game.vel = 200

            if (Game.level_code == 'fall') {
                this.player.body.setSize(14, 28)
            }

            if (this.map.properties['reverse']) {
                this.player.body.gravity.y *= -1
                Game.jump *= -1
                this.player.body.setSize(20, 15)
            }

            if (this.map.properties['slide']) {
                Game.vel = 400
            }

            if (this.map.properties['gravity']) {
                this.player.body.maxVelocity.y = 500
            }
            
		    this.player.anchor.setTo(0.5, 0.5)
		    this.player.tint = this.map.properties['ocean']
		    this.cursor = this.game.input.keyboard.createCursorKeys()
            this.cursor.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		    this.game.camera.follow(this.player)

        }

        createSpot() {

            this.spot = new Spot(this.game, this.player, this.map.properties['spot'])

            this.spot.setTint(this.map.properties['contrast'])

            // Sort Z Index
            this.world.bringToTop(this.player)
            this.world.bringToTop(this.layer)

        }

        createLevel() {

            this.layer = this.map.createLayer('ground')
            this.layer.resizeWorld()

            this.map.setCollision(2)
            this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

            // Tint background and ground
            this.game.stage.backgroundColor = this.map.properties['ocean']
            this.layer.tint = this.map.properties['ocean']

        }

        createEnemies() {

            Entities.peaks = this.game.add.group()
            Entities.peaks.enableBody = true

            this.map.createFromObjects('object', 11, 'peak', 0, true, false, Entities.peaks, Dual)
            this.map.createFromObjects('object', 14, 'peak_reverse', 0, true, false, Entities.peaks, Dual)

            Entities.peaks.callAll('setTint', '', this.map.properties['anomaly'])
            Entities.peaks.callAll('setMask', '', this.spot)
            Entities.peaks.callAll('setReverse', '')

            Entities.enemies = this.game.add.group()
            Entities.enemies.enableBody = true

            this.map.createFromObjects('object', 12, 'enemy', 0, true, false, Entities.enemies, Dual)

            Entities.enemies.callAll('setTint', '', this.map.properties['anomaly'])
            Entities.enemies.callAll('setMask', '', this.spot)

            Entities.enemies.forEach((child: Dual) => {
                child.body.velocity.x = -100
                child.body.bounce.x = 1
                child.checkWorldBounds = true
                child.outOfBoundsKill = true
            }, this)

        }

        createBounce() {

            Entities.bounce = this.game.add.group()
            Entities.bounce.enableBody = true
            
            this.map.createFromObjects('object', 13, 'citizen', 0, true, false, Entities.bounce)

            Entities.bounce.setAll('body.immovable', true)
            Entities.bounce.setAll('alpha', 0)

        }

        createNpc() {

            Entities.npc = this.game.add.group()

            this.map.createFromObjects('object', 3, 'citizen', 0, true, false, Entities.npc, Npc)
            this.map.createFromObjects('object', 18, 'note', 0, true, false, Entities.npc, Npc)

            Entities.npc.setAll('tint', this.map.properties['ocean'])

        }

        createPlatforms() {

            Entities.platforms = this.game.add.group()

            this.map.createFromObjects('object', 16, null, 0, true, false, Entities.platforms, Platform)

            Entities.platforms.callAll('move', '')

            Entities.platforms.setAll('tint', this.map.properties['ocean'])

        }

        createCitizen() {

            Citizen.id = 0

            Entities.citizen = this.game.add.group()
            this.map.createFromObjects('object', 20, null, 0, true, false, Entities.citizen, Citizen)

            Entities.citizen.callAll('tintCit', '', this.map.properties['ocean'])
            Entities.citizen.callAll('tintHelp', '', this.map.properties['contrast'])

            Entities.citizen.callAll('killYou', '')
        }

        createCheckpoints() {

            Entities.checkpoints = this.game.add.group()
            Entities.checkpoints.enableBody = true

            this.map.createFromObjects('object', 7, null, 0, true, false, Entities.checkpoints, Checkpoint)

        }

        createEnd() {

            // Get player spawn
            Entities.end = this.game.add.group()
            Entities.end.enableBody = true

            this.map.createFromObjects('object', 8, null, 0, true, false, Entities.end, End)

            Entities.end.callAll('setSpot', '', this.spot, this.map.properties['ocean'])

            this.world.bringToTop(this.layer)
        }

        createDeco() {

            var group = this.game.add.group()
            this.map.createFromObjects('object', 21, 'arrow_left', 0, true, false, group)
            this.map.createFromObjects('object', 22, 'arrow_right', 0, true, false, group)
            this.map.createFromObjects('object', 23, 'arrow_up', 0, true, false, group)

            group.setAll('tint', this.map.properties['contrast'])
            group.forEach((child: Phaser.Sprite) => {
                child.anchor.setTo(0.5, 0)
            }, this)

        }

        createEvent() {

            Entities.eventsTouch = this.game.add.group()
            Entities.eventsTouch.enableBody = true

            this.map.createFromObjects('object', 4, null, 0, true, false, Entities.eventsTouch, EventTouch)

        }

        createDialog() {

            this.dialog = new Dialog(this.game)
            this.dialog.onEnd(this.goodbye, this)
            this.cursor.space.onDown.add(this.inputDialog, this)
            this.game.input.onUp.add(this.inputDialog, this)

        }

        createThief() {
            var spr = this.getFirst(5)
            if (spr) {
                this.thief = new Dual(this.game, spr.x, spr.y, 'thief')
                this.game.add.existing(this.thief)
                this.thief.y -= 8

                this.thief.setTint(this.map.properties['anomaly'])
                this.thief.setMask(this.spot)

                spr.destroy()
                
            }
        }

        createMasterpiece() {
            if (Game.master[Game.level_code]) {
                return
            }

            var spr = this.getFirst(19)
            if (spr) {
                this.masterpiece = this.game.add.sprite(spr.x, spr.y, 'masterpiece')
                this.masterpiece.tint = this.map.properties['ocean']
                this.game.physics.arcade.enable(this.masterpiece)

                spr.destroy()
            }
        }

        createLandmark() {
            Entities.deco = this.game.add.group()
            this.map.createFromObjects('object', 26, 'mark-5', 0, true, false, Entities.deco)
            this.map.createFromObjects('object', 27, 'mark-1', 0, true, false, Entities.deco)
            this.map.createFromObjects('object', 28, 'mark-2', 0, true, false, Entities.deco)
            this.map.createFromObjects('object', 29, 'mark-3', 0, true, false, Entities.deco)
            this.map.createFromObjects('object', 30, 'mark-4', 0, true, false, Entities.deco)

            Entities.deco.setAll('tint', this.map.properties['contrast'])
            Entities.deco.forEach((child: Phaser.Sprite) => {
                child.alpha = 0.3
                this.game.add.tween(child).to({ alpha: 0.6 }, 3000).to({ alpha: 0.3 }, 3000).loop().start()
            }, this)

            Entities.deco.alpha = 0
        }

        createDebug() {

            this.debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.M)
            this.debugKey.onDown.add(() => {
                if (this.game.time.advancedTiming) {
                    this.game.debug.reset()
                }
                this.game.time.advancedTiming = !this.game.time.advancedTiming

            }, this)
            this.game.time.advancedTiming = false

        }

    }

}
