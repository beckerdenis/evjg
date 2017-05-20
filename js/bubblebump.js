var bubbleBumpState = {

    // constants
    
    nbPlayers : 4,

    playerSpeed : 160,

    // utilities

    popKid : function(index, group) {
        var x = index % 4;
        var y = index / 4 >> 0;
        var c = (random(0, 1) == 0) ? 'a' : 'b';
        var kid = group.create(x * 160 + 80, y * 120 + 60, 'c10_' + c);
        kid.anchor = { x : 0.5, y : 0.5 };
        kid.animations.add('down', [0, 1, 2, 3], 4, true);
        kid.animations.add('left', [4, 5, 6, 7], 4, true);
        kid.animations.add('right', [8, 9, 10, 11], 4, true);
        kid.animations.add('up', [12, 13, 14, 15], 4, true);
        kid.animations.add('alert', [16, 17], 4, true);
        var danim = kid.animations.add('drowning', [18, 19], 4, false);
        danim.onComplete.add(function() {
            if (!this.firstSink) {
                this.freeze = true;
                this.alibiImage = game.add.image(0, 0, 'c10_alibi');
                this.messageWindow = createWindow(game.add.graphics(0, 0), 4, 4, GAME_WIDTH - 8, 128);
                this.messageWindow.setText("Oh non, un enfant s'est noyé ! Mais ne vous inquiétez pas, il est redirigé\nvers une salle secrète sous le lac qui donne sur un ascenseur lui\npermettant de remonter à la surface en toute sécurité ! (ouf...)");
                this.firstSink = true;
            }
        }, this);
        game.physics.arcade.enable(kid);
        kid.body.collideWorldBounds = true;
        kid.body.setSize(40, 32);
        kid.lastAnim = 0;
        kid.maxAnimTime = 100;
        kid.drowning = 0;
    },

    randomDrowning : function(item) {
        if (item.drowning == 0) {
            if (random(0, 1000) == 0) {
                item.drowning = 1;
                item.body.velocity.x = 0;
                item.body.velocity.y = 0;
                item.animations.play('alert');
            }
        } else if (item.drowning > 0) {
            item.drowning++;
            if (item.drowning > 400) {
                item.animations.play('drowning', null, false, true);
            }
        }
        return item.drowning > 0;
    },

    save : function(kid) {
        kid.drowning = 0;
        kid.animations.stop();
        kid.frame = 0;
        kid.lastAnim = 0;
    },

    randomMove : function(item) {
        if (this.randomDrowning(item)) {
            return;
        }

        item.body.velocity.x += 10 - random(0, 20);
        item.body.velocity.y += 10 - random(0, 20);
        var absX = Math.abs(item.body.velocity.x);
        var absY = Math.abs(item.body.velocity.y);
        if (item.body.velocity.x > 0 && item.body.velocity.x > absY) {
            if (item.lastAnim == 0 || (item.lastAnim != 1 && item.lastAnimTime == 0)) {
                item.animations.play('right');
                item.lastAnim = 1;
                item.lastAnimTime = item.maxAnimTime;
            }
        } else if (item.body.velocity.x < 0 && item.body.velocity.x < -absY) {
            if (item.lastAnim == 0 || (item.lastAnim != 2 && item.lastAnimTime == 0)) {
                item.animations.play('left');
                item.lastAnim = 2;
                item.lastAnimTime = item.maxAnimTime;
            }
        } else if (item.body.velocity.y > 0 && item.body.velocity.y > absX) {
            if (item.lastAnim == 0 || (item.lastAnim != 3 && item.lastAnimTime == 0)) {
                item.animations.play('down');
                item.lastAnim = 3;
                item.lastAnimTime = item.maxAnimTime;
            }
        } else if (item.body.velocity.y < 0 && item.body.velocity.y < -absX) {
            if (item.lastAnim == 0 || (item.lastAnim != 4 && item.lastAnimTime == 0)) {
                item.animations.play('up');
                item.lastAnim = 4;
                item.lastAnimTime = item.maxAnimTime;
            }
        } else {
            item.animations.stop();
            item.lastAnim = 0;
        }
        item.lastAnimTime = Math.max(0, item.lastAnimTime - 1);
    },
    
    createPlayer : function(group, x, y, img) {
        var player = group.create(x, y, img);
        player.anchor.setTo(0.5);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.mass = 4;
        player.body.bounce.setTo(0.5);
        player.body.setSize(52, 98, 39, 36);
        player.animations.add('right', [0, 1, 2, 3], 6, true);
        player.animations.add('idle', [4, 5, 6, 7], 2, true);
        player.animations.add('down', [8, 9, 10, 11], 6, true);
        player.animations.add('up', [12, 13, 14, 15], 6, true);
        player.animations.add('left', [16, 17, 18, 19], 6, true);
        player.animations.play('idle');
        return player;
    },

    // phaser API implementation

    create : function() {
        game.add.image(0, 0, 'bubblebump_background');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.redGroup = game.add.group();
        for (var i = 0; i < this.nbPlayers - 1; i++) {
            this.createPlayer(this.redGroup, GAME_WIDTH / 4, GAME_HEIGHT * (i + 1) / (this.nbPlayers + 2), 'bubblebump_red');
        }
        this.unicorn = this.createPlayer(this.redGroup, GAME_WIDTH / 4, GAME_HEIGHT * this.nbPlayers / (this.nbPlayers + 2), 'bubblebump_unicorn');;
        
        this.blueGroup = game.add.group();
        for (var i = 0; i < this.nbPlayers; i++) {
            this.createPlayer(this.blueGroup, 3 * GAME_WIDTH / 4, GAME_HEIGHT * (i + 1) / (this.nbPlayers + 2), 'bubblebump_blue');
        }
        
        this.ball = game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bubblebump_ball');
        this.ball.anchor.setTo(0.5);
        game.physics.arcade.enable(this.ball);
        this.ball.body.collideWorldBounds = true;
        this.ball.body.setCircle(16);
        this.ball.body.bounce.setTo(0.8);
        
        game.add.image(0, 0, 'bubblebump_goals');
        
        this.cursors = game.input.keyboard.createCursorKeys();
    },
    
    render : function() {
        /*for (var i = 0; i < this.redGroup.children.length; i++) {
            game.debug.body(this.redGroup.children[i]);
        }
        for (var i = 0; i < this.blueGroup.children.length; i++) {
            game.debug.body(this.blueGroup.children[i]);
        }
        game.debug.body(this.ball);*/
    },

    update : function() {
        game.physics.arcade.collide(this.redGroup);
        game.physics.arcade.collide(this.blueGroup);
        game.physics.arcade.collide(this.redGroup, this.blueGroup);
        game.physics.arcade.collide(this.ball, this.redGroup);
        game.physics.arcade.collide(this.ball, this.blueGroup);
        
        if (this.cursors.down.isDown) {
            this.unicorn.body.velocity.y = this.playerSpeed;
        } else if (this.cursors.up.isDown) {
            this.unicorn.body.velocity.y = -this.playerSpeed;
        } else {
            this.unicorn.body.velocity.y = 0;
        }
        if (this.cursors.left.isDown) {
            this.unicorn.body.velocity.x = -this.playerSpeed;
        } else if (this.cursors.right.isDown) {
            this.unicorn.body.velocity.x = this.playerSpeed;
        } else {
            this.unicorn.body.velocity.x = 0;
        }
        
        var absX = Math.abs(this.unicorn.body.velocity.x);
        var absY = Math.abs(this.unicorn.body.velocity.y);
        if (absX >= absY) {
            if (this.unicorn.body.velocity.x > 0) {
                this.unicorn.animations.play('right');
            } else if (this.unicorn.body.velocity.x < 0) {
                this.unicorn.animations.play('left');
            } else {
                this.unicorn.animations.play('idle');
            }
        } else if (absY > absX) {
            if (this.unicorn.body.velocity.y > 0) {
                this.unicorn.animations.play('down');
            } else {
                this.unicorn.animations.play('up');
            }
        }
        /*
        if (this.freeze) {
            if (this.spaceKey.isDown) {
                this.alibiImage.kill();
                this.freeze = false;
                this.messageWindow.hide();
            }
            return;
        }

        // make sure the objects are sorted by their 'y' position (for beautiful display)
        this.mainGroup.sort('y', Phaser.Group.SORT_ASCENDING);

        game.physics.arcade.collide(this.mainGroup, this.mainGroup, function(k1, k2) {
            var other = null;
            if (k1 == this.player) {
                other = k2;
            } else if (k2 == this.player) {
                other = k1;
            }
            if (other != null && other.drowning > 0) {
                this.save(other);
            }
        }, null, this);

        this.mainGroup.forEach(function(item) {
            if (item != this.player) {
                this.randomMove(item);
            }
        }, this);

        // player movement
        var moving = false;
        this.player.body.velocity = { x : 0, y : 0 };

        if (this.cursors.down.isDown) {
            this.missionWindow.hide();
            this.player.body.velocity.y = this.playerSpeed;
            this.player.animations.play('down');
            this.player.lastDir = 0;
            moving = true;
        } else if (this.cursors.up.isDown) {
            this.missionWindow.hide();
            this.player.body.velocity.y = -this.playerSpeed;
            this.player.animations.play('up');
            this.player.lastDir = 12;
            moving = true;
        }

        if (this.cursors.left.isDown) {
            this.missionWindow.hide();
            this.player.body.velocity.x = -this.playerSpeed;
            if (this.player.body.velocity.y == 0) {
                this.player.animations.play('left');
                this.player.lastDir = 4;
            }
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.missionWindow.hide();
            this.player.body.velocity.x = this.playerSpeed;
            if (this.player.body.velocity.y == 0) {
                this.player.animations.play('right');
                this.player.lastDir = 8;
            }
            moving = true;
        }

        if (!moving) {
            this.player.animations.stop();
            this.player.frame = this.player.lastDir || 0;
        }
        */
    }

};
