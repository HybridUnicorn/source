
module Contrast {

    export class Spot {

        game: Phaser.Game
        player: Phaser.Sprite
        shape: any

        constructor(game: Phaser.Game, player: Phaser.Sprite, type: string) {

            this.game = game

            this.player = player

            switch (type) {
                case 'wave':
                    this.shape = new Wave(this.game, this.player)
                    break
                case 'cross':
                    this.shape = new Cross(this.game, this.player)
                    break
                case 'cast':
                    this.shape = new Cast(this.game, this.player)
                    break
                case 'full':
                    this.shape = new Full(this.game, this.player)
                    break
                case 'line':
                    this.shape = new Line(this.game, this.player)
                    break
                default:
                    this.shape = new Round(this.game, this.player)
            }
            
        }

        update() {

            this.shape.update()

        }

        setTint(tint: number) {

            this.shape.aura.tint = tint
            this.shape.mate.tint = tint

        }

        getAura(): Phaser.Graphics {
            return this.shape.ghost_aura
        }

        getMate(): Phaser.Graphics {
            return this.shape.ghost_mate
        }

        fadeAway() {
            this.game.add.tween(this.shape.aura.scale).to({ x: 0, y: 0 }, 2000).start()
            this.game.add.tween(this.shape.ghost_aura.scale).to({ x: 0, y: 0 }, 2000).start()
        }

        fadeIn() {
            this.shape.rebase()
            this.game.add.tween(this.shape.aura.scale).to({x: 0.3, y: 0.3}, 800).start()
            this.game.add.tween(this.shape.ghost_aura.scale).to({ x: 0.3, y: 0.3 }, 800).start()
        }


    }

    class Base {

        game: Phaser.Game
        player: Phaser.Sprite

        // What we see
        aura: any
        mate: Phaser.Graphics

        // What mask entites
        ghost_aura: Phaser.Graphics
        ghost_mate: Phaser.Graphics

        constructor(game: Phaser.Game, player: Phaser.Sprite) {

            this.game = game
            this.player = player

            this.aura = this.game.add.graphics(0, 0)
            this.mate = this.game.add.graphics(0, 0)

            this.ghost_aura = this.game.add.graphics(0, 0)
            this.ghost_mate = this.game.add.graphics(0, 0)

        }

        update() { }

    }

    class Round extends Base {

        constructor(game: Phaser.Game, player: Phaser.Sprite) {

            super(game, player)

            // Draw them
            this.create(this.aura, 60)
            this.create(this.mate, 120)
            this.create(this.ghost_aura, 60)
            this.create(this.ghost_mate, 120)

            this.aura.position = this.player.position
            this.ghost_aura.position = this.player.position

            this.mate.fixedToCamera = this.ghost_mate.fixedToCamera = true

            this.mate.cameraOffset = this.game.input.position
            this.ghost_mate.cameraOffset = this.game.input.position
            
        }

        create(graphics: Phaser.Graphics, radius: number) {

            graphics.beginFill(0xFFFFFF)
            graphics.drawCircle(0, 0, radius) // Radius value

        }

        update() {

        }

    }

    class Full extends Base {

        constructor(game: Phaser.Game, player: Phaser.Sprite) {
            super(game, player)

            this.create(this.aura)
            this.create(this.mate)
            this.create(this.ghost_aura)
            this.create(this.ghost_mate)

            // Scale of mate one
            this.mate.scale.set(0, 0)
            this.ghost_mate.scale.set(0, 0)

            this.aura.fixedToCamera = this.ghost_aura.fixedToCamera = true
            this.aura.cameraOffset = this.ghost_aura.cameraOffset = new Phaser.Point(250, 150)

        }

        create(graphics: Phaser.Graphics) {

            graphics.beginFill(0xFFFFFF)
            graphics.drawCircle(0, 0, 600)

        }

        rebase() {
            this.aura.fixedToCamera = this.ghost_aura.fixedToCamera = false
            this.aura.position = this.player.position
            this.ghost_aura.position = this.player.position
        }

    }

    class Wave extends Base {
        constructor(game: Phaser.Game, player: Phaser.Sprite) {
            super(game, player)

            this.aura.beginFill(0xFFFFFF)
            this.aura.drawRect(0, 0, this.game.width * 2, this.game.height * 2)

            this.ghost_aura.beginFill(0xFFFFFF)
            this.ghost_aura.drawRect(0, 0, this.game.width * 2, this.game.height * 2)

            this.aura.t = 0

            var anim = this.game.add.tween(this.aura)
            anim.to({ t: '+20' }, 2000).to({ t: '-20' }, 2000)
            anim.onUpdateCallback(() => {
                this.aura.y += this.aura.t
            }, this)
            anim.loop().start()

        }

        update() {
            this.aura.x = this.player.x - this.game.width
            this.aura.y = this.player.y - 40
        }

    }

    class Cross extends Base {

        constructor(game: Phaser.Game, player: Phaser.Sprite) {
            super(game, player)

            this.aura.beginFill(0xFFFFFF)
            this.ghost_aura.beginFill(0xFFFFFF)

            this.aura.drawRect(-50, -this.game.height, 100, this.game.height * 2)
            this.ghost_aura.drawRect(-50, -this.game.height, 100, this.game.height * 2)
            this.aura.position = this.player.position
            this.ghost_aura.position = this.player.position

            this.mate.beginFill(0xFFFFFF)
            this.ghost_mate.beginFill(0xFFFFFF)

            this.mate.drawRect(-this.game.width, -50, this.game.width * 2, 100)
            this.ghost_mate.drawRect(-this.game.width, -50, this.game.width * 2, 100)
            this.mate.fixedToCamera = this.ghost_mate.fixedToCamera = true

        }

        update() {

            this.mate.cameraOffset.y = this.game.input.position.y
            this.ghost_mate.cameraOffset.y = this.game.input.position.y

        }

    }

    class Cast extends Base {

        constructor(game: Phaser.Game, player: Phaser.Sprite) {
            super(game, player)

            this.aura.beginFill(0xFFFFFF)
            this.ghost_aura.beginFill(0xFFFFFF)

            this.aura.drawCircle(0, 0, 0)
            this.ghost_aura.drawCircle(0, 0, 0)

            this.mate.beginFill(0xFFFFFF)
            this.ghost_mate.beginFill(0xFFFFFF)

            this.mate.drawCircle(0, 0, 160)
            this.ghost_mate.drawCircle(0, 0, 160)

            this.mate.fixedToCamera = this.ghost_mate.fixedToCamera = true

            this.mate.cameraOffset = this.game.input.position
            this.ghost_mate.cameraOffset = this.game.input.position

        }

    }

    class Line extends Base {

        constructor(game: Phaser.Game, player: Phaser.Sprite) {
            super(game, player)

            this.aura.beginFill(0xFFFFFF)
            this.ghost_aura.beginFill(0xFFFFFF)

            this.aura.drawRect(-this.game.width, -75, this.game.width * 2, 150)
            this.ghost_aura.drawRect(-this.game.width, -75, this.game.width * 2, 150)
            this.aura.position = this.player.position
            this.ghost_aura.position = this.player.position

            this.mate.beginFill(0xFFFFFF)
            this.ghost_mate.beginFill(0xFFFFFF)

            this.mate.drawRect(-this.game.width, -1, this.game.width * 2, 2)
            this.ghost_mate.drawRect(-this.game.width, -1, this.game.width * 2, 2)
            this.mate.fixedToCamera = this.ghost_mate.fixedToCamera = true

        }

        update() {

            this.mate.cameraOffset.y = this.game.input.position.y
            this.ghost_mate.cameraOffset.y = this.game.input.position.y

        }

    }

}
