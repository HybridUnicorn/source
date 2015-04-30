var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Contrast;
(function (Contrast) {
    var Board = (function (_super) {
        __extends(Board, _super);
        function Board(game, i, state, data) {
            var _this = this;
            var x = 16 + (i % 3) * 160;
            var y = 56 + Math.floor(i / 3) * 110;

            _super.call(this, game, x, y, 'pixel');

            this.data = data;
            this.state = state;
            this.unlocked = false;
            var color = Phaser.Color.valueToColor(data.gray);
            Contrast.Game.debloqued.forEach(function (j) {
                if (j == i) {
                    _this.unlocked = true;
                    color = Phaser.Color.valueToColor(data.color);
                }
            }, this);

            this.tint = Phaser.Color.getColor(color.r, color.g, color.b);
            this.scale.setTo(128, 78);

            this.inputEnabled = true;
            this.input.useHandCursor = true;

            if (this.unlocked) {
                this.events.onInputUp.add(function () {
                    _this.state.goTo(_this.data.name);
                }, this);
            } else {
                this.events.onInputOver.add(function () {
                    _this.drops.alpha = 1;
                }, this);

                this.events.onInputOut.add(function () {
                    _this.drops.alpha = 0;
                }, this);

                this.events.onInputDown.add(function () {
                    // Can I buy it ?
                    var okay = true;

                    // Test
                    _this.data.drops.split('').forEach(function (d) {
                        switch (d) {
                            case "1":
                                if (Contrast.Game.drops.blue < 1) {
                                    okay = false;
                                }
                                break;
                            case "2":
                                if (Contrast.Game.drops.red < 1) {
                                    okay = false;
                                }
                                break;
                            case "3":
                                if (Contrast.Game.drops.yellow < 1) {
                                    okay = false;
                                }
                                break;
                        }
                    }, _this);

                    // Buy
                    if (okay) {
                        // Unlock it !
                        Contrast.Game.debloqued.push(i);

                        Contrast.Game.fromBoot = true;

                        // Delete drop from inventory
                        _this.data.drops.split('').forEach(function (d) {
                            switch (d) {
                                case "1":
                                    --Contrast.Game.drops.blue;
                                    break;
                                case "2":
                                    --Contrast.Game.drops.red;
                                    break;
                                case "3":
                                    --Contrast.Game.drops.yellow;
                                    break;
                            }
                        }, _this);

                        // Refresh page
                        _this.game.state.start('menu');
                    }
                }, this);
            }

            this.game.add.existing(this);

            if (this.unlocked) {
                if (Contrast.Game.master[this.data.name]) {
                    this.game.add.sprite(x + 88, y, 'masterpiece');
                }

                y += 70;

                for (var j = 0; j < Contrast.Game.helped[this.data.name]; ++j) {
                    var tmp = this.game.add.sprite(x, y, 'citizen');
                    tmp.anchor.setTo(0, 1);
                    x += 20;
                }
            } else {
                this.drops = this.game.add.group();
                y += 8;
                x += 8;

                function drawDrop(type) {
                    this.drops.create(x, y, "drop_" + type);
                    x += 28;
                }

                this.data.drops.split('').forEach(function (d) {
                    switch (d) {
                        case "1":
                            drawDrop.call(_this, "blue");
                            break;
                        case "2":
                            drawDrop.call(_this, "red");
                            break;
                        case "3":
                            drawDrop.call(_this, "yellow");
                            break;
                    }
                }, this);

                this.drops.alpha = 0;
            }
        }
        return Board;
    })(Phaser.Sprite);
    Contrast.Board = Board;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.game.stage.backgroundColor = 0x00627C;
            this.load.audio('s_love', 'assets/Young_And_Old_Know_Love.mp3');
        };

        Boot.prototype.create = function () {
            var style = { font: '65px Droid Sans', fill: '#ffffff', align: 'left' };
            var t = this.game.add.text(0, 0, 'void', style);
            t.destroy();

            // Game config
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.game.state.start('loader');
        };
        return Boot;
    })(Phaser.State);
    Contrast.Boot = Boot;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Checkpoint = (function (_super) {
        __extends(Checkpoint, _super);
        function Checkpoint(game, x, y) {
            _super.call(this, game, x, y, 'pixel');

            this.scale.setTo(16, this.game.world.height);
            this.y = this.game.world.height;

            this.alpha = 0;

            this.spawn = { x: x, y: y };
        }
        return Checkpoint;
    })(Phaser.Sprite);
    Contrast.Checkpoint = Checkpoint;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Citizen = (function (_super) {
        __extends(Citizen, _super);
        function Citizen(game, x, y) {
            _super.call(this, game, x, y, 'citizen');
            this.done = false;

            this.game.physics.arcade.enable(this);

            this.body.immovable = true;

            this.help = this.game.add.text(18, 0, '!', { font: "16px Arial", fill: "#ffffff", align: "center" });

            this.addChild(this.help);

            this['id'] = Citizen.id++;

            // Anim
            this.help.alpha = 0;
            var tween = this.game.add.tween(this.help);
            tween.to({ y: '-8', alpha: 1 }, 200).to({ alpha: 0 }, 200).to({ y: '+8' }, 1).delay(5000).loop().start();
        }
        Citizen.prototype.tintCit = function (tint) {
            this.tint = tint;
        };

        Citizen.prototype.tintHelp = function (tint) {
            this.help.tint = tint;
        };

        Citizen.prototype.killYou = function () {
            if (Contrast.Game.rescued[Contrast.Game.level_code][this['id']]) {
                this.visible = false;
            }
        };
        Citizen.id = 0;
        return Citizen;
    })(Phaser.Sprite);
    Contrast.Citizen = Citizen;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Credit = (function (_super) {
        __extends(Credit, _super);
        function Credit() {
            _super.apply(this, arguments);
            this.header1 = { font: '65px Droid Sans', fill: '#ffffff', align: 'center' };
            this.header2 = { font: '48px Droid Sans', fill: '#ffffff', align: 'center' };
            this.header3 = { font: '32px Droid Sans', fill: '#ffffff', align: 'center' };
            this.content = { font: '24px Droid Sans', fill: '#ffffff', align: 'center' };
        }
        Credit.prototype.create = function () {
            var _this = this;
            Contrast.Game.save();
            Contrast.Game.fromBoot = true;

            this.game.stage.backgroundColor = '#000000';

            var texts = this.game.add.group();
            var credits = this.game.cache.getText('credit').split('\n');
            var y = 0;

            for (var i in credits) {
                var line = credits[i];
                var text;

                if (/_hu_/.test(line)) {
                    text = this.game.add.sprite(0, y, 'hybrid_unicorn');
                    y += 110;
                } else if (/^###/.test(line)) {
                    line = line.replace(/^###/, '');
                    text = this.game.add.text(0, y, line, this.header3);
                    y += 50;
                } else if (/^##/.test(line)) {
                    line = line.replace(/^##/, '');
                    text = this.game.add.text(0, y, line, this.header2);
                    y += 60;
                } else if (/^#/.test(line)) {
                    line = line.replace(/^#/, '');
                    text = this.game.add.text(0, y, line, this.header1);
                    y += 100;
                } else {
                    text = this.game.add.text(0, y, line, this.content);
                    y += 30;
                }

                text.x = 240 - (text.width / 2);

                texts.addChild(text);
            }

            texts.y = 320;

            var tween = this.game.add.tween(texts).to({ y: -y + 170 }, y * 30);

            tween.onComplete.add(function () {
                _this.game.add.tween(texts).to({ alpha: 0 }, 2000).start();
                _this.game.time.events.add(Phaser.Timer.SECOND * 5, function () {
                    _this.game.state.start('title');
                }, _this);
            }, this);
            tween.start();
        };
        return Credit;
    })(Phaser.State);
    Contrast.Credit = Credit;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Dialog = (function (_super) {
        __extends(Dialog, _super);
        function Dialog(game) {
            _super.call(this, game, 0, 0);
            this.talking = false;
            this.once = null;

            this.beginFill(0x000000, .7);

            this.drawRect(0, 0, 480, 80);

            this.fixedToCamera = true;
            this.cameraOffset = new Phaser.Point(0, 240);

            this.alpha = 0;

            this.game.add.existing(this);
        }
        Dialog.prototype.process = function (msg) {
            if (msg) {
                this.buffer = msg.split('$');

                this.talking = true;

                if (this.buffer.length > 0) {
                    this.show();
                } else {
                    this.close();
                }
            } else {
                this.close();
            }
        };

        Dialog.prototype.onEnd = function (func, context) {
            this.ending = func;
            this.context = context;
        };

        Dialog.prototype.endOnce = function (func, context) {
            this.once = func;
            this.context = context;
        };

        Dialog.prototype.show = function () {
            this.game.add.tween(this).to({ alpha: 1 }, 100).start();
            this.next();
        };

        Dialog.prototype.next = function () {
            if (this.text) {
                this.text.destroy();
            }

            if (this.buffer.length > 0) {
                this.text = this.game.add.text(0, 30, this.buffer.shift(), { font: "20px Droid Sans", fill: "#ffffff", align: "center" });
                this.text.alpha = 0;
                this.text.x = 480 / 2 - this.text.width / 2;
                this.addChild(this.text);
                this.text.y += 20;
                this.game.add.tween(this.text).to({ y: '-20', alpha: 1 }, 200).start();
            } else {
                this.close();
            }
        };

        Dialog.prototype.close = function () {
            this.game.add.tween(this).to({ alpha: 0 }, 100).start();
            this.talking = false;
            if (this.once) {
                this.once.call(this.context);
                this.once = null;
            } else {
                this.ending.call(this.context);
            }
        };
        return Dialog;
    })(Phaser.Graphics);
    Contrast.Dialog = Dialog;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Dual = (function (_super) {
        __extends(Dual, _super);
        function Dual(game, x, y, key) {
            _super.call(this, game, x, y, key);
            this.soulmate = this.game.add.sprite(x, y, key);
        }
        Dual.prototype.setTint = function (tint) {
            this.tint = tint;
            this.soulmate.tint = tint;
        };

        Dual.prototype.setReverse = function () {
            if (this['reversed']) {
                this.y -= 30;
                this.soulmate.y -= 30;
            }
        };

        Dual.prototype.setMask = function (spot) {
            this.mask = spot.getAura();
            this.soulmate.mask = spot.getMate();
        };

        Dual.prototype.update = function () {
            this.soulmate.position = this.position;
        };

        Dual.prototype.fadeAway = function () {
            this.game.add.tween(this).to({ alpha: 0 }, 200).start();
            this.game.add.tween(this.scale).to({ x: 2, y: 2 }, 200).start();

            this.game.add.tween(this.soulmate).to({ alpha: 0 }, 200).start();
            this.game.add.tween(this.soulmate.scale).to({ x: 2, y: 2 }, 200).start();
        };
        return Dual;
    })(Phaser.Sprite);
    Contrast.Dual = Dual;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var End = (function (_super) {
        __extends(End, _super);
        function End(game, x, y) {
            _super.call(this, game, x, y, 'pixel');

            this.scale.setTo(40, this.game.world.height);
            this.y = this.game.world.height;

            this.second = this.game.add.sprite(0, 0, 'pixel');
            this.third = this.game.add.sprite(0, 0, 'pixel');

            this.addChild(this.second);
            this.addChild(this.third);
        }
        End.prototype.setSpot = function (spot, tint) {
            this.second.mask = spot.getAura();
            this.third.mask = spot.getMate();

            this.second.tint = this.third.tint = tint;
        };
        return End;
    })(Phaser.Sprite);
    Contrast.End = End;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Entities = (function () {
        function Entities() {
        }
        return Entities;
    })();
    Contrast.Entities = Entities;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var EventTouch = (function (_super) {
        __extends(EventTouch, _super);
        function EventTouch(game, x, y) {
            _super.call(this, game, x, y, 'pixel');

            this.scale.setTo(16, this.game.world.height);
            this.y = this.game.world.height;

            this.alpha = 0;
        }
        return EventTouch;
    })(Phaser.Sprite);
    Contrast.EventTouch = EventTouch;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Game = (function (_super) {
        __extends(Game, _super);
        /****/
        function Game() {
            _super.call(this, 480, 320, Phaser.AUTO, 'content', null, false, false);

            this.state.add('boot', Contrast.Boot);
            this.state.add('loader', Contrast.Loader);
            this.state.add('title', Contrast.Title);
            this.state.add('menu', Contrast.Menu);
            this.state.add('level', Contrast.Level);
            this.state.add('credit', Contrast.Credit);

            this.state.start('boot');
        }
        Game.load = function () {
            Game.debloqued = JSON.parse(localStorage.getItem("debloqued"));
            Game.helped = JSON.parse(localStorage.getItem("helped"));
            Game.drops = JSON.parse(localStorage.getItem("drops"));
            Game.master = JSON.parse(localStorage.getItem("master"));
            Game.rescued = JSON.parse(localStorage.getItem("rescued"));
        };

        Game.save = function () {
            localStorage.setItem("saved", "true");
            localStorage.setItem("debloqued", JSON.stringify(Game.debloqued));
            localStorage.setItem("helped", JSON.stringify(Game.helped));
            localStorage.setItem("drops", JSON.stringify(Game.drops));
            localStorage.setItem("master", JSON.stringify(Game.master));
            localStorage.setItem("rescued", JSON.stringify(Game.rescued));
        };
        Game.vel = 200;
        Game.jump = -420;

        Game.fromBoot = true;

        Game.rescued = {
            "regular": {},
            "snow": {},
            "wave": {},
            "fall": {},
            "reverse": {},
            "without": {}
        };

        Game.master = {};

        Game.drops = {
            blue: 0,
            red: 0,
            yellow: 0
        };

        Game.helped = {
            "regular": 2,
            "snow": 0,
            "wave": 2,
            "fall": 1,
            "reverse": 1,
            "without": 2
        };

        Game.debloqued = [0];
        return Game;
    })(Phaser.Game);
    Contrast.Game = Game;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
            this.dialogging = false;
        }
        Level.prototype.create = function () {
            this.freePlayer();

            document.querySelector('canvas')['style'].cursor = 'none';
            this.createMap();

            this.playLoop();

            this.createLevel();
            this.createCheckpoints();
            this.createPlayer();
            this.createSpot();
            this.createEnd();
            this.createEnemies();
            this.createBounce();
            this.createNpc();
            this.createPlatforms();
            this.createCitizen();
            this.createDeco();
            this.createEvent();
            this.createThief();
            this.createMasterpiece();
            this.createLandmark();
            this.createDialog();
            this.createDebug();
        };

        Level.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, this.layer);
            this.game.physics.arcade.collide(Contrast.Entities.enemies, this.layer);
            this.game.physics.arcade.collide(Contrast.Entities.enemies, Contrast.Entities.bounce);
            this.game.physics.arcade.collide(this.player, Contrast.Entities.platforms);
            this.game.physics.arcade.overlap(this.player, Contrast.Entities.peaks, this.respawn, null, this);
            this.game.physics.arcade.overlap(this.player, Contrast.Entities.enemies, this.respawn, null, this);
            this.game.physics.arcade.overlap(this.player, Contrast.Entities.checkpoints, this.checkpoint, null, this);
            this.game.physics.arcade.overlap(this.player, Contrast.Entities.citizen, this.rescue, null, this);
            this.game.physics.arcade.overlap(this.player, Contrast.Entities.eventsTouch, this.touching, null, this);
            this.game.physics.arcade.overlap(this.player, Contrast.Entities.end, this.ending, null, this);
            this.game.physics.arcade.overlap(this.player, Contrast.Entities.npc, this.discuss, null, this);
            this.game.physics.arcade.overlap(this.player, this.masterpiece, this.dropMaster, null, this);
            this.movePlayer();
            this.spot.update();
        };

        Level.prototype.render = function () {
            var _this = this;
            if (!this.game.time.advancedTiming) {
                return;
            }

            // Quit to menu
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                return this.game.state.start('menu');
            }

            // Drop and go back
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.O)) {
                Contrast.Game.drops.blue += 3;
                Contrast.Game.drops.red += 3;
                Contrast.Game.drops.yellow += 3;
                return this.game.state.start('menu');
            }

            // Deco
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                Contrast.Entities.deco.alpha = 1;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.H)) {
                Contrast.Entities.deco.alpha = 0;
            }

            // Show enemies
            Contrast.Entities.peaks.forEach(function (x) {
                _this.game.debug.body(x);
            }, this);

            // Show player
            this.game.debug.body(this.player);

            // Display fps
            this.game.debug.text(this.game.time.fps.toString() || "--", 2, 14, "#00ff00");
        };

        Level.prototype.getFirst = function (id) {
            var group = this.game.add.group();
            this.map.createFromObjects('object', id, null, 0, false, false, group);
            var child = null;
            try  {
                child = group.getChildAt(0);
            } catch (e) {
            }
            group.destroy();
            return child;
        };

        /*
        ** Core feature
        */
        // Respawn player after a death
        Level.prototype.respawn = function () {
            this.game.sound.play('s_hurt', 1);

            this.player.x = this.spawn.x;
            this.player.y = this.spawn.y;
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        };

        // Store last checkpoint
        Level.prototype.checkpoint = function (player, checkpoint) {
            this.spawn.x = checkpoint.spawn.x;
            this.spawn.y = checkpoint.spawn.y;

            checkpoint.destroy();
        };

        Level.prototype.showDrop = function (color) {
            var drop = this.game.add.sprite(0, 0, 'drop_' + color);
            drop.anchor.setTo(.5, .5);
            drop.fixedToCamera = true;
            drop.cameraOffset = new Phaser.Point(240, 160);
            drop.scale.setTo(0, 0);
            this.game.add.tween(drop.scale).to({ y: 1, x: 1 }, 200).to({ y: 2, x: 2 }, 200).start();
            this.game.add.tween(drop).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200).start();
        };

        // Player touch a citizen
        Level.prototype.rescue = function (player, cit) {
            if (cit.done) {
                return;
            }

            this.game.sound.play('s_spirit', 2);

            switch (cit['drop']) {
                case "1":
                    ++Contrast.Game.drops.blue;
                    this.showDrop('blue');
                    break;
                case "2":
                    ++Contrast.Game.drops.red;
                    this.showDrop('red');
                    break;
                case "3":
                    ++Contrast.Game.drops.yellow;
                    this.showDrop('yellow');
                    break;
            }

            // Remove rescued citizen
            --Contrast.Game.helped[Contrast.Game.level_code];

            Contrast.Game.rescued[Contrast.Game.level_code][cit['id']] = true;

            this.game.add.tween(cit).to({ alpha: 0 }, 200).start();
            var tween = this.game.add.tween(cit.scale).to({ x: 2, y: 2 }, 200);
            cit.done = true;
            tween.onComplete.add(function () {
                cit.destroy();
            }, this);
            tween.start();
        };

        Level.prototype.dropMaster = function (player, master) {
            if (master['done']) {
                return;
            }

            this.game.sound.play('s_master', 1);
            master['done'] = true;

            Contrast.Game.master[Contrast.Game.level_code] = true;

            this.game.add.tween(master).to({ alpha: 0 }, 200).start();
            var tween = this.game.add.tween(master.scale).to({ x: 2, y: 2 }, 200);
            tween.onComplete.add(function () {
                master.destroy();
            }, this);
            tween.start();

            // Show big one if all possess
            if (Object.keys(Contrast.Game.master).length == 6) {
                var master = this.game.add.sprite(0, 0, 'masterpiece');
                master.anchor.setTo(.5);
                master.tint = 0xffb618;
                master.fixedToCamera = true;
                master.cameraOffset = new Phaser.Point(240, 160);
                master.scale.setTo(0, 0);
                this.game.add.tween(master.scale).to({ y: 8, x: 8 }, 400).to({ y: 16, x: 16 }, 400).start();
                this.game.add.tween(master).to({ alpha: 1 }, 400).to({ alpha: 0 }, 400).start();
            }
        };

        // Start touching event
        Level.prototype.touching = function (player, event) {
            var fn = this[event.callback];
            if (typeof fn === 'function') {
                fn.call(this);
            }
            event.destroy();
        };

        // Start a dialog with a NPC
        Level.prototype.discuss = function (player, npc) {
            if (this.cursor.up.isDown) {
                this.dialog.process(npc.dialog);
                this.stopPlayer();
            }
        };

        Level.prototype.goodbye = function () {
            this.dialogging = false;
        };

        // End level
        Level.prototype.ending = function () {
            Contrast.Game.music.stop();
            this.game.state.start('menu');
        };

        Level.prototype.inputDialog = function () {
            if (this.dialog.talking) {
                this.dialog.next();
            }
        };

        Level.prototype.stopPlayer = function () {
            this.dialogging = true;
            this.player.body.velocity.x = 0;
        };

        Level.prototype.freePlayer = function () {
            this.dialogging = false;
        };

        // Move player according to the pressed key
        Level.prototype.movePlayer = function () {
            if (this.dialogging) {
                return;
            }

            // Vertical movement
            if (this.cursor.left.isDown) {
                this.player.body.velocity.x = -Contrast.Game.vel;
            } else if (this.cursor.right.isDown) {
                this.player.body.velocity.x = Contrast.Game.vel;
            } else if (!this.map.properties['slide']) {
                this.player.body.velocity.x = 0;
            }

            // Jump movement
            if (this.cursor.up.isDown && (this.player.body.blocked.up || this.player.body.onFloor() || this.player.body.touching.down)) {
                this.player.body.velocity.y = Contrast.Game.jump;
                this.game.sound.play('s_jump', 0.5);
            }
        };

        /*
        ** Scena
        */
        Level.prototype.thankyou = function () {
            this.stopPlayer();
            this.dialog.process('Sir !$I\'am happy to see you !$But people are still trapped !$As a King,$you have to save your citizen.');
        };

        Level.prototype.cutscene = function () {
            var _this = this;
            this.stopPlayer();
            this.camera.follow(null);
            var tween = this.game.add.tween(this.camera).to({ x: 1330 }, 2000);
            tween.onComplete.add(function () {
                _this.spot.fadeAway();
                Contrast.Game.music.fadeOut(2000);
                _this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                    _this.dialog.process('Sir ! The contrast !$It disappears !!$Are you alright ? I can\'t see you !$How are we going to do ?!');
                    _this.dialog.endOnce(function () {
                        _this.thief.visible = false;
                        _this.game.camera.follow(_this.player);
                        _this.spot.fadeIn();
                        _this.freePlayer();
                    }, _this);
                }, _this);
            }, this);
            tween.start();
        };

        // Level ending dialog
        Level.prototype.firstDialog = function () {
            var _this = this;
            Contrast.Game.music.fadeOut(800);
            this.stopPlayer();
            this.dialog.process('Can you guess why ?$Why I stole the Contrast ?$I am sure you can see it.');
            this.dialog.endOnce(function () {
                _this.killThief();
                _this.freePlayer();
            }, this);
        };

        Level.prototype.waveDialog = function () {
            var _this = this;
            Contrast.Game.music.fadeOut(800);
            this.stopPlayer();
            this.dialog.process('Don\'t you see that I\'m different ?$Normal people doesn\'t like different one.');
            this.dialog.endOnce(function () {
                _this.killThief();
                _this.freePlayer();
            }, this);
        };

        Level.prototype.withoutDialog = function () {
            var _this = this;
            Contrast.Game.music.fadeOut(800);
            this.stopPlayer();
            this.dialog.process('Without Contrast, everyone is the same.$Even me !$Me, the eternal anomaly.$Without it I can be like everyone !');
            this.dialog.endOnce(function () {
                _this.killThief();
                _this.freePlayer();
            }, this);
        };

        Level.prototype.reverseDialog = function () {
            var _this = this;
            Contrast.Game.music.fadeOut(800);
            this.stopPlayer();
            this.dialog.process('People like you always reject someone like me.$You can\'t accept difference.$Now,$I\'am like everyone.');
            this.dialog.endOnce(function () {
                _this.killThief();
                _this.freePlayer();
            }, this);
        };

        Level.prototype.fallDialog = function () {
            var _this = this;
            Contrast.Game.music.fadeOut(800);
            this.stopPlayer();
            this.dialog.process('Stop chase me.$Don\'t put Contrast on me.$I don\'t want to be different again.');
            this.dialog.endOnce(function () {
                _this.killThief();
                _this.freePlayer();
            }, this);
        };

        Level.prototype.finalDialog = function () {
            var _this = this;
            Contrast.Game.music.fadeOut(800);
            this.stopPlayer();
            this.dialog.process('Come on, laugh at me.$Like everyone before you did it.$...$Why aren\'t laughing ?$...$Are you accepting me ?$Even if I\'m different ?$How is that possible ?$...$I guess you are...$...tolerant.');
            this.dialog.endOnce(function () {
                var bg = _this.game.add.graphics(0, 0);
                bg.beginFill(0x000000);
                bg.drawRect(0, 0, _this.game.width, _this.game.height);
                bg.fixedToCamera = true;
                bg.alpha = 0;

                Contrast.Game.music.stop();
                Contrast.Game.music = _this.game.add.audio('s_love', 1, true);
                Contrast.Game.music.play();

                _this.game.add.tween(bg).to({ alpha: 1 }, 2000).start();
                _this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                    _this.game.state.start('credit');
                }, _this);
            }, this);
        };

        Level.prototype.killThief = function () {
            this.thief.fadeAway();
        };

        /*
        ** Entity Factory
        */
        Level.prototype.playLoop = function () {
            Contrast.Game.music.stop();
            Contrast.Game.music = this.game.add.audio('s_' + this.map.properties['music'], 1, true);
            Contrast.Game.music.play();
        };

        Level.prototype.createMap = function () {
            this.map = this.game.add.tilemap(Contrast.Game.level_name);
            this.map.addTilesetImage('tileset', 'tileset');

            // Replace string by real hex
            var prop = ['ocean', 'contrast', 'anomaly'];
            for (var i in prop) {
                var color = Phaser.Color.valueToColor(this.map.properties[prop[i]]);
                this.map.properties[prop[i]] = Phaser.Color.getColor(color.r, color.g, color.b);
            }
        };

        Level.prototype.createPlayer = function () {
            // Get player spawn
            var spawn = this.getFirst(6);

            // First death point
            this.spawn = { x: spawn.x, y: spawn.y };

            // Player sprite
            this.player = this.game.add.sprite(spawn.x, spawn.y, 'player-' + this.map.properties['player']);
            this.game.physics.arcade.enable(this.player);
            this.player.checkWorldBounds = true;
            this.player.events.onOutOfBounds.add(this.respawn, this);
            this.player.body.gravity.y = 980;
            Contrast.Game.jump = -Math.abs(Contrast.Game.jump);
            Contrast.Game.vel = 200;

            if (Contrast.Game.level_code == 'fall') {
                this.player.body.setSize(14, 28);
            }

            if (this.map.properties['reverse']) {
                this.player.body.gravity.y *= -1;
                Contrast.Game.jump *= -1;
                this.player.body.setSize(20, 15);
            }

            if (this.map.properties['slide']) {
                Contrast.Game.vel = 400;
            }

            if (this.map.properties['gravity']) {
                this.player.body.maxVelocity.y = 500;
            }

            this.player.anchor.setTo(0.5, 0.5);
            this.player.tint = this.map.properties['ocean'];
            this.cursor = this.game.input.keyboard.createCursorKeys();
            this.cursor.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.game.camera.follow(this.player);
        };

        Level.prototype.createSpot = function () {
            this.spot = new Contrast.Spot(this.game, this.player, this.map.properties['spot']);

            this.spot.setTint(this.map.properties['contrast']);

            // Sort Z Index
            this.world.bringToTop(this.player);
            this.world.bringToTop(this.layer);
        };

        Level.prototype.createLevel = function () {
            this.layer = this.map.createLayer('ground');
            this.layer.resizeWorld();

            this.map.setCollision(2);
            this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

            // Tint background and ground
            this.game.stage.backgroundColor = this.map.properties['ocean'];
            this.layer.tint = this.map.properties['ocean'];
        };

        Level.prototype.createEnemies = function () {
            Contrast.Entities.peaks = this.game.add.group();
            Contrast.Entities.peaks.enableBody = true;

            this.map.createFromObjects('object', 11, 'peak', 0, true, false, Contrast.Entities.peaks, Contrast.Dual);
            this.map.createFromObjects('object', 14, 'peak_reverse', 0, true, false, Contrast.Entities.peaks, Contrast.Dual);

            Contrast.Entities.peaks.callAll('setTint', '', this.map.properties['anomaly']);
            Contrast.Entities.peaks.callAll('setMask', '', this.spot);
            Contrast.Entities.peaks.callAll('setReverse', '');

            Contrast.Entities.enemies = this.game.add.group();
            Contrast.Entities.enemies.enableBody = true;

            this.map.createFromObjects('object', 12, 'enemy', 0, true, false, Contrast.Entities.enemies, Contrast.Dual);

            Contrast.Entities.enemies.callAll('setTint', '', this.map.properties['anomaly']);
            Contrast.Entities.enemies.callAll('setMask', '', this.spot);

            Contrast.Entities.enemies.forEach(function (child) {
                child.body.velocity.x = -100;
                child.body.bounce.x = 1;
                child.checkWorldBounds = true;
                child.outOfBoundsKill = true;
            }, this);
        };

        Level.prototype.createBounce = function () {
            Contrast.Entities.bounce = this.game.add.group();
            Contrast.Entities.bounce.enableBody = true;

            this.map.createFromObjects('object', 13, 'citizen', 0, true, false, Contrast.Entities.bounce);

            Contrast.Entities.bounce.setAll('body.immovable', true);
            Contrast.Entities.bounce.setAll('alpha', 0);
        };

        Level.prototype.createNpc = function () {
            Contrast.Entities.npc = this.game.add.group();

            this.map.createFromObjects('object', 3, 'citizen', 0, true, false, Contrast.Entities.npc, Contrast.Npc);
            this.map.createFromObjects('object', 18, 'note', 0, true, false, Contrast.Entities.npc, Contrast.Npc);

            Contrast.Entities.npc.setAll('tint', this.map.properties['ocean']);
        };

        Level.prototype.createPlatforms = function () {
            Contrast.Entities.platforms = this.game.add.group();

            this.map.createFromObjects('object', 16, null, 0, true, false, Contrast.Entities.platforms, Contrast.Platform);

            Contrast.Entities.platforms.callAll('move', '');

            Contrast.Entities.platforms.setAll('tint', this.map.properties['ocean']);
        };

        Level.prototype.createCitizen = function () {
            Contrast.Citizen.id = 0;

            Contrast.Entities.citizen = this.game.add.group();
            this.map.createFromObjects('object', 20, null, 0, true, false, Contrast.Entities.citizen, Contrast.Citizen);

            Contrast.Entities.citizen.callAll('tintCit', '', this.map.properties['ocean']);
            Contrast.Entities.citizen.callAll('tintHelp', '', this.map.properties['contrast']);

            Contrast.Entities.citizen.callAll('killYou', '');
        };

        Level.prototype.createCheckpoints = function () {
            Contrast.Entities.checkpoints = this.game.add.group();
            Contrast.Entities.checkpoints.enableBody = true;

            this.map.createFromObjects('object', 7, null, 0, true, false, Contrast.Entities.checkpoints, Contrast.Checkpoint);
        };

        Level.prototype.createEnd = function () {
            // Get player spawn
            Contrast.Entities.end = this.game.add.group();
            Contrast.Entities.end.enableBody = true;

            this.map.createFromObjects('object', 8, null, 0, true, false, Contrast.Entities.end, Contrast.End);

            Contrast.Entities.end.callAll('setSpot', '', this.spot, this.map.properties['ocean']);

            this.world.bringToTop(this.layer);
        };

        Level.prototype.createDeco = function () {
            var group = this.game.add.group();
            this.map.createFromObjects('object', 21, 'arrow_left', 0, true, false, group);
            this.map.createFromObjects('object', 22, 'arrow_right', 0, true, false, group);
            this.map.createFromObjects('object', 23, 'arrow_up', 0, true, false, group);

            group.setAll('tint', this.map.properties['contrast']);
            group.forEach(function (child) {
                child.anchor.setTo(0.5, 0);
            }, this);
        };

        Level.prototype.createEvent = function () {
            Contrast.Entities.eventsTouch = this.game.add.group();
            Contrast.Entities.eventsTouch.enableBody = true;

            this.map.createFromObjects('object', 4, null, 0, true, false, Contrast.Entities.eventsTouch, Contrast.EventTouch);
        };

        Level.prototype.createDialog = function () {
            this.dialog = new Contrast.Dialog(this.game);
            this.dialog.onEnd(this.goodbye, this);
            this.cursor.space.onDown.add(this.inputDialog, this);
            this.game.input.onUp.add(this.inputDialog, this);
        };

        Level.prototype.createThief = function () {
            var spr = this.getFirst(5);
            if (spr) {
                this.thief = new Contrast.Dual(this.game, spr.x, spr.y, 'thief');
                this.game.add.existing(this.thief);
                this.thief.y -= 8;

                this.thief.setTint(this.map.properties['anomaly']);
                this.thief.setMask(this.spot);

                spr.destroy();
            }
        };

        Level.prototype.createMasterpiece = function () {
            if (Contrast.Game.master[Contrast.Game.level_code]) {
                return;
            }

            var spr = this.getFirst(19);
            if (spr) {
                this.masterpiece = this.game.add.sprite(spr.x, spr.y, 'masterpiece');
                this.masterpiece.tint = this.map.properties['ocean'];
                this.game.physics.arcade.enable(this.masterpiece);

                spr.destroy();
            }
        };

        Level.prototype.createLandmark = function () {
            var _this = this;
            Contrast.Entities.deco = this.game.add.group();
            this.map.createFromObjects('object', 26, 'mark-5', 0, true, false, Contrast.Entities.deco);
            this.map.createFromObjects('object', 27, 'mark-1', 0, true, false, Contrast.Entities.deco);
            this.map.createFromObjects('object', 28, 'mark-2', 0, true, false, Contrast.Entities.deco);
            this.map.createFromObjects('object', 29, 'mark-3', 0, true, false, Contrast.Entities.deco);
            this.map.createFromObjects('object', 30, 'mark-4', 0, true, false, Contrast.Entities.deco);

            Contrast.Entities.deco.setAll('tint', this.map.properties['contrast']);
            Contrast.Entities.deco.forEach(function (child) {
                child.alpha = 0.3;
                _this.game.add.tween(child).to({ alpha: 0.6 }, 3000).to({ alpha: 0.3 }, 3000).loop().start();
            }, this);

            Contrast.Entities.deco.alpha = 0;
        };

        Level.prototype.createDebug = function () {
            var _this = this;
            this.debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
            this.debugKey.onDown.add(function () {
                if (_this.game.time.advancedTiming) {
                    _this.game.debug.reset();
                }
                _this.game.time.advancedTiming = !_this.game.time.advancedTiming;
            }, this);
            this.game.time.advancedTiming = false;
        };
        return Level;
    })(Phaser.State);
    Contrast.Level = Level;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            _super.apply(this, arguments);
        }
        Loader.prototype.loadAssets = function () {
            this.load.text('levels', 'assets/levels.json');
            this.load.text('credit', 'assets/credit.txt');

            // Music ^^'
            this.load.audio('s_jump', 'assets/146726_2437358-lq.mp3');
            this.load.audio('s_spirit', 'assets/152721_2578041-lq.mp3');
            this.load.audio('s_master', 'assets/Mature_Sounds_(Sting).mp3');
            this.load.audio('s_hurt', 'assets/hurt.mp3');
            this.load.audio('s_bossa', 'assets/203419_bossa_nova_loop.mp3');
            this.load.audio('s_night', 'assets/Night_Music.mp3');
            this.load.audio('s_juicy', 'assets/Juicy.mp3');
            this.load.audio('s_mermaid', 'assets/613978_Mermaid.mp3');

            // Level data
            this.load.tilemap('level_tuto', 'assets/level_tuto.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_regular', 'assets/level_regular.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_wave', 'assets/level_wave.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_fall', 'assets/level_fall.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_without', 'assets/level_without.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_reverse', 'assets/level_reverse.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level_snow', 'assets/level_snow.json', null, Phaser.Tilemap.TILED_JSON);

            // Sprites
            this.load.image('tileset', 'assets/tileset.png');
            this.load.image('player-undefined', 'assets/player.png');
            this.load.image('player-1', 'assets/player-1.png');
            this.load.image('player-2', 'assets/player-2.png');
            this.load.image('player-3', 'assets/player-3.png');
            this.load.image('player-4', 'assets/player-4.png');
            this.load.image('player-5', 'assets/player-5.png');
            this.load.image('player-6', 'assets/player-6.png');
            this.load.image('peak', 'assets/peak.png');
            this.load.image('peak_reverse', 'assets/peak_reverse.png');
            this.load.image('enemy', 'assets/enemy.png');
            this.load.image('platform', 'assets/platform.png');
            this.load.image('pixel', 'assets/pixel.png');
            this.load.image('drop_blue', 'assets/drop_blue.png');
            this.load.image('drop_red', 'assets/drop_red.png');
            this.load.image('drop_yellow', 'assets/drop_yellow.png');
            this.load.image('arrow_left', 'assets/arrow_left.png');
            this.load.image('arrow_right', 'assets/arrow_right.png');
            this.load.image('arrow_up', 'assets/arrow_up.png');
            this.load.image('citizen', 'assets/citizen.png');
            this.load.image('note', 'assets/note.png');
            this.load.image('masterpiece', 'assets/masterpiece.png');
            this.load.image('thief', 'assets/thief.png');
            this.load.image('mark-1', 'assets/mark-1.png');
            this.load.image('mark-2', 'assets/mark-2.png');
            this.load.image('mark-3', 'assets/mark-3.png');
            this.load.image('mark-4', 'assets/mark-4.png');
            this.load.image('mark-5', 'assets/mark-5.png');
            this.load.image('title', 'assets/title.png');
            this.load.image('circle-1', 'assets/circle-1.png');
            this.load.image('circle-2', 'assets/circle-2.png');
            this.load.image('circle-3', 'assets/circle-3.png');
            this.load.image('hybrid_unicorn', 'assets/hybrid_unicorn.png');

            this.load.start();
        };

        Loader.prototype.create = function () {
            //this.game.sound.mute = true
            Contrast.Game.music = this.game.add.audio('s_love', 1, true);
            Contrast.Game.music.play();

            this.orange = this.game.add.graphics(0, 0);
            this.orange.beginFill(0xff9900);
            this.orange.drawRect(0, 0, this.game.world.width, this.game.world.height);
            this.orange.scale.x = 0;

            this.game.load.onFileComplete.add(this.fileComplete, this);
            this.game.load.onLoadComplete.add(this.loadComplete, this);
            this.loadAssets();
        };

        Loader.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            this.orange.scale.x = progress / 100;
        };

        Loader.prototype.loadComplete = function () {
            this.game.state.start('title');
        };
        return Loader;
    })(Phaser.State);
    Contrast.Loader = Loader;
})(Contrast || (Contrast = {}));
window.onload = function () {
    var game = new Contrast.Game();
};
var Contrast;
(function (Contrast) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        Menu.prototype.create = function () {
            // Save everything
            Contrast.Game.save();

            document.querySelector('canvas')['style'].cursor = 'default';

            this.game.stage.backgroundColor = 0xFFFFFF;

            this.createDrops();
            this.createBoards();
            this.createMasterpiece();

            if (Contrast.Game.fromBoot) {
                Contrast.Game.fromBoot = false;
            } else {
                Contrast.Game.music.stop();
                Contrast.Game.music = this.game.add.audio('s_love', 1, true);
                Contrast.Game.music.play();
            }
        };

        Menu.prototype.createDrops = function () {
            var x = 16;
            var codes = ['blue', 'red', 'yellow'];

            for (var i = 0; i < codes.length; ++i) {
                for (var j = 0; j < Contrast.Game.drops[codes[i]]; ++j) {
                    this.game.add.sprite(x, 16, 'drop_' + codes[i]);
                    x += 32;
                }
            }
        };

        Menu.prototype.createBoards = function () {
            var levels = JSON.parse(this.game.cache.getText('levels'));

            for (var i = 0; i < levels.list.length; ++i) {
                var level = levels.list[i];

                new Contrast.Board(this.game, i, this, level);
            }
        };

        Menu.prototype.createMasterpiece = function () {
            if (Object.keys(Contrast.Game.master).length == 6) {
                var m = this.game.add.sprite(240, 282, 'masterpiece');
                m.anchor.setTo(.5);
                m.tint = 0xffb618;
            }
        };

        Menu.prototype.goTo = function (name) {
            // Start selected level
            Contrast.Game.music.stop();
            Contrast.Game.level_code = name;
            Contrast.Game.level_name = 'level_' + name;
            this.game.state.start('level');
        };
        return Menu;
    })(Phaser.State);
    Contrast.Menu = Menu;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Npc = (function (_super) {
        __extends(Npc, _super);
        function Npc(game, x, y, key) {
            _super.call(this, game, x, y, key);

            this.game.physics.arcade.enable(this);

            this.body.immovable = true;
        }
        return Npc;
    })(Phaser.Sprite);
    Contrast.Npc = Npc;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Platform = (function (_super) {
        __extends(Platform, _super);
        function Platform(game, x, y) {
            _super.call(this, game, x, y, 'platform');

            this.game.physics.arcade.enable(this);

            this.body.immovable = true;
        }
        Platform.prototype.move = function () {
            if (this.vertical) {
                this.vertical = parseInt(this.vertical);

                this.max = this.y;
                this.min = this.y - this.vertical * 40;

                this.body.velocity.y = -100;
            }

            if (this.horizontal) {
                this.horizontal = parseInt(this.horizontal);

                this.min = this.x;
                this.max = this.x + this.horizontal * 40;

                this.body.velocity.x = 100;
            }
        };

        Platform.prototype.update = function () {
            // Y Bounce
            if (this.vertical) {
                if (this.y < this.min) {
                    this.body.velocity.y = 100;
                } else if (this.y > this.max) {
                    this.body.velocity.y = -100;
                }
            }

            // X Bounce
            if (this.horizontal) {
                if (this.x < this.min) {
                    this.body.velocity.x = 100;
                } else if (this.x > this.max) {
                    this.body.velocity.x = -100;
                }
            }

            _super.prototype.update.call(this);
        };
        return Platform;
    })(Phaser.Sprite);
    Contrast.Platform = Platform;
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Spot = (function () {
        function Spot(game, player, type) {
            this.game = game;

            this.player = player;

            switch (type) {
                case 'wave':
                    this.shape = new Wave(this.game, this.player);
                    break;
                case 'cross':
                    this.shape = new Cross(this.game, this.player);
                    break;
                case 'cast':
                    this.shape = new Cast(this.game, this.player);
                    break;
                case 'full':
                    this.shape = new Full(this.game, this.player);
                    break;
                case 'line':
                    this.shape = new Line(this.game, this.player);
                    break;
                default:
                    this.shape = new Round(this.game, this.player);
            }
        }
        Spot.prototype.update = function () {
            this.shape.update();
        };

        Spot.prototype.setTint = function (tint) {
            this.shape.aura.tint = tint;
            this.shape.mate.tint = tint;
        };

        Spot.prototype.getAura = function () {
            return this.shape.ghost_aura;
        };

        Spot.prototype.getMate = function () {
            return this.shape.ghost_mate;
        };

        Spot.prototype.fadeAway = function () {
            this.game.add.tween(this.shape.aura.scale).to({ x: 0, y: 0 }, 2000).start();
            this.game.add.tween(this.shape.ghost_aura.scale).to({ x: 0, y: 0 }, 2000).start();
        };

        Spot.prototype.fadeIn = function () {
            this.shape.rebase();
            this.game.add.tween(this.shape.aura.scale).to({ x: 0.3, y: 0.3 }, 800).start();
            this.game.add.tween(this.shape.ghost_aura.scale).to({ x: 0.3, y: 0.3 }, 800).start();
        };
        return Spot;
    })();
    Contrast.Spot = Spot;

    var Base = (function () {
        function Base(game, player) {
            this.game = game;
            this.player = player;

            this.aura = this.game.add.graphics(0, 0);
            this.mate = this.game.add.graphics(0, 0);

            this.ghost_aura = this.game.add.graphics(0, 0);
            this.ghost_mate = this.game.add.graphics(0, 0);
        }
        Base.prototype.update = function () {
        };
        return Base;
    })();

    var Round = (function (_super) {
        __extends(Round, _super);
        function Round(game, player) {
            _super.call(this, game, player);

            // Draw them
            this.create(this.aura, 60);
            this.create(this.mate, 120);
            this.create(this.ghost_aura, 60);
            this.create(this.ghost_mate, 120);

            this.aura.position = this.player.position;
            this.ghost_aura.position = this.player.position;

            this.mate.fixedToCamera = this.ghost_mate.fixedToCamera = true;

            this.mate.cameraOffset = this.game.input.position;
            this.ghost_mate.cameraOffset = this.game.input.position;
        }
        Round.prototype.create = function (graphics, radius) {
            graphics.beginFill(0xFFFFFF);
            graphics.drawCircle(0, 0, radius);
        };

        Round.prototype.update = function () {
        };
        return Round;
    })(Base);

    var Full = (function (_super) {
        __extends(Full, _super);
        function Full(game, player) {
            _super.call(this, game, player);

            this.create(this.aura);
            this.create(this.mate);
            this.create(this.ghost_aura);
            this.create(this.ghost_mate);

            // Scale of mate one
            this.mate.scale.set(0, 0);
            this.ghost_mate.scale.set(0, 0);

            this.aura.fixedToCamera = this.ghost_aura.fixedToCamera = true;
            this.aura.cameraOffset = this.ghost_aura.cameraOffset = new Phaser.Point(250, 150);
        }
        Full.prototype.create = function (graphics) {
            graphics.beginFill(0xFFFFFF);
            graphics.drawCircle(0, 0, 600);
        };

        Full.prototype.rebase = function () {
            this.aura.fixedToCamera = this.ghost_aura.fixedToCamera = false;
            this.aura.position = this.player.position;
            this.ghost_aura.position = this.player.position;
        };
        return Full;
    })(Base);

    var Wave = (function (_super) {
        __extends(Wave, _super);
        function Wave(game, player) {
            var _this = this;
            _super.call(this, game, player);

            this.aura.beginFill(0xFFFFFF);
            this.aura.drawRect(0, 0, this.game.width * 2, this.game.height * 2);

            this.ghost_aura.beginFill(0xFFFFFF);
            this.ghost_aura.drawRect(0, 0, this.game.width * 2, this.game.height * 2);

            this.aura.t = 0;

            var anim = this.game.add.tween(this.aura);
            anim.to({ t: '+20' }, 2000).to({ t: '-20' }, 2000);
            anim.onUpdateCallback(function () {
                _this.aura.y += _this.aura.t;
            }, this);
            anim.loop().start();
        }
        Wave.prototype.update = function () {
            this.aura.x = this.player.x - this.game.width;
            this.aura.y = this.player.y - 40;
        };
        return Wave;
    })(Base);

    var Cross = (function (_super) {
        __extends(Cross, _super);
        function Cross(game, player) {
            _super.call(this, game, player);

            this.aura.beginFill(0xFFFFFF);
            this.ghost_aura.beginFill(0xFFFFFF);

            this.aura.drawRect(-50, -this.game.height, 100, this.game.height * 2);
            this.ghost_aura.drawRect(-50, -this.game.height, 100, this.game.height * 2);
            this.aura.position = this.player.position;
            this.ghost_aura.position = this.player.position;

            this.mate.beginFill(0xFFFFFF);
            this.ghost_mate.beginFill(0xFFFFFF);

            this.mate.drawRect(-this.game.width, -50, this.game.width * 2, 100);
            this.ghost_mate.drawRect(-this.game.width, -50, this.game.width * 2, 100);
            this.mate.fixedToCamera = this.ghost_mate.fixedToCamera = true;
        }
        Cross.prototype.update = function () {
            this.mate.cameraOffset.y = this.game.input.position.y;
            this.ghost_mate.cameraOffset.y = this.game.input.position.y;
        };
        return Cross;
    })(Base);

    var Cast = (function (_super) {
        __extends(Cast, _super);
        function Cast(game, player) {
            _super.call(this, game, player);

            this.aura.beginFill(0xFFFFFF);
            this.ghost_aura.beginFill(0xFFFFFF);

            this.aura.drawCircle(0, 0, 0);
            this.ghost_aura.drawCircle(0, 0, 0);

            this.mate.beginFill(0xFFFFFF);
            this.ghost_mate.beginFill(0xFFFFFF);

            this.mate.drawCircle(0, 0, 160);
            this.ghost_mate.drawCircle(0, 0, 160);

            this.mate.fixedToCamera = this.ghost_mate.fixedToCamera = true;

            this.mate.cameraOffset = this.game.input.position;
            this.ghost_mate.cameraOffset = this.game.input.position;
        }
        return Cast;
    })(Base);

    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(game, player) {
            _super.call(this, game, player);

            this.aura.beginFill(0xFFFFFF);
            this.ghost_aura.beginFill(0xFFFFFF);

            this.aura.drawRect(-this.game.width, -75, this.game.width * 2, 150);
            this.ghost_aura.drawRect(-this.game.width, -75, this.game.width * 2, 150);
            this.aura.position = this.player.position;
            this.ghost_aura.position = this.player.position;

            this.mate.beginFill(0xFFFFFF);
            this.ghost_mate.beginFill(0xFFFFFF);

            this.mate.drawRect(-this.game.width, -1, this.game.width * 2, 2);
            this.ghost_mate.drawRect(-this.game.width, -1, this.game.width * 2, 2);
            this.mate.fixedToCamera = this.ghost_mate.fixedToCamera = true;
        }
        Line.prototype.update = function () {
            this.mate.cameraOffset.y = this.game.input.position.y;
            this.ghost_mate.cameraOffset.y = this.game.input.position.y;
        };
        return Line;
    })(Base);
})(Contrast || (Contrast = {}));
var Contrast;
(function (Contrast) {
    var Title = (function (_super) {
        __extends(Title, _super);
        function Title() {
            _super.apply(this, arguments);
        }
        Title.prototype.create = function () {
            this.game.stage.backgroundColor = '#ff9900';

            if (Contrast.Game.music.isDecoded) {
                this.callback();
            } else {
                Contrast.Game.music.onDecoded.add(this.callback, this);
            }
        };

        Title.prototype.startGame = function () {
            if (localStorage.getItem("saved")) {
                // Load
                Contrast.Game.load();

                // GoTo Menu
                this.game.state.start('menu');
            } else {
                // Run tuto
                Contrast.Game.level_name = 'level_tuto';
                this.game.state.start('level');
            }
        };

        Title.prototype.callback = function () {
            var _this = this;
            var bg = this.game.add.sprite(0, 0);
            bg.fixedToCamera = true;
            bg.scale.setTo(this.game.width, this.game.height);
            bg.inputEnabled = true;
            bg.input.priorityID = 0;
            bg.events.onInputDown.add(this.startGame, this);

            var hu = this.game.add.sprite(440, 280, 'hybrid_unicorn');
            hu.scale.setTo(.3);
            hu.alpha = 0;
            this.game.add.tween(hu).to({ alpha: 1 }, 400).start();

            hu.inputEnabled = true;
            hu.input.useHandCursor = true;
            hu.input.priorityID = 1;
            hu.events.onInputDown.add(function () {
                open('//hybridunicorn.github.io/');
            }, this);

            var c1 = this.game.add.sprite(150, 120, 'circle-3');
            var c2 = this.game.add.sprite(290, 80, 'circle-1');
            var c3 = this.game.add.sprite(320, 190, 'circle-2');

            c1.anchor.setTo(.5);
            c2.anchor.setTo(.5);
            c3.anchor.setTo(.5);

            var title = this.game.add.sprite(0, 0, 'title');
            title.tint = 0xff9900;

            // Scale
            c1.scale.set(0, 0);
            c2.scale.set(0, 0);
            c3.scale.set(0, 0);
            this.game.add.tween(c1.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Elastic.Out).delay(100).start();
            this.game.add.tween(c2.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Elastic.Out).start();
            this.game.add.tween(c3.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Elastic.Out).delay(200).start();

            // Anim
            this.game.add.tween(c1).to({ y: '+20' }, 6000, Phaser.Easing.Quadratic.InOut).to({ y: '-20' }, 6000, Phaser.Easing.Quadratic.InOut).loop().start();
            this.game.add.tween(c2).to({ y: '-10' }, 4000, Phaser.Easing.Quadratic.InOut).to({ y: '+10' }, 4000, Phaser.Easing.Quadratic.InOut).loop().start();
            this.game.add.tween(c3).to({ y: '+30' }, 5000, Phaser.Easing.Quadratic.InOut).to({ y: '-30' }, 5000, Phaser.Easing.Quadratic.InOut).loop().start();

            // Click
            this.game.time.events.add(Phaser.Timer.SECOND * 8, function () {
                var text2 = 'click';
                var style2 = { font: '20px Droid Sans', fill: '#ffffff', align: 'left' };

                var tmp = _this.game.add.text(20, 280, text2, style2);
                tmp.alpha = 0;
                _this.game.add.tween(tmp).to({ alpha: .8 }, 1800).to({ alpha: .2 }, 1800).loop().start();
            }, this);
            //this.game.input.onUp.add(this.startGame, this)
        };
        return Title;
    })(Phaser.State);
    Contrast.Title = Title;
})(Contrast || (Contrast = {}));
//# sourceMappingURL=game.js.map
