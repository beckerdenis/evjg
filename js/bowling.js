var bowlingState = {

    // graphics
    
    pinOriginY : 140,
    
    pinGapX : 40,
    
    pinGapY : 24,
    
    step : 0,
    
    leftBound : 290,
    
    rightBound : 506,
    
    borderWidth : 248,
    
    bowlChoiceVelocity : 200,
    
    spaceFlag : false,
    
    arrowAngleStep : 3,

    turn : 0,
    
    subturn : 0,
    
    scores : [],
    
    nbPinRows : 3,
    
    // utilities
    
    createPin : function(group, row, column) {
        var pin = group.create(GAME_WIDTH / 2 - row * this.pinGapX + 2 * this.pinGapX * column,
                               this.pinOriginY - row * this.pinGapY,
                               'bowling_pin');
        pin.anchor.setTo(0.5);
        pin.initialX = pin.x;
        pin.initialY = pin.y;
        pin.hit = false;
        game.physics.arcade.enable(pin);
        pin.body.setSize(34, 18, 0, 100 - 32);
    },
    
    createPins : function(group) {
        for (var i = this.nbPinRows - 1; i >= 0; --i) { // rows
            for (var j = 0; j <= i; ++j) {
                this.createPin(group, i, j);
            }
        }
    },
    
    blockBall : function(bowl, border) {
        if (!bowl.blocked) {
            bowl.body.velocity.x = 0;
            bowl.body.velocity.y /= 2;
            this.sound.border.play();
            bowl.blocked = true;
        }
    },
    
    reset : function(partial) {
        if (partial) {
            for (var i = 0; i < this.pinGroup.children.length; i++) {
                var pin = this.pinGroup.children[i];
                if (pin.hit) {
                    pin.kill();
                }
            }
        } else {
            for (var i = 0; i < this.pinGroup.children.length; i++) {
                var pin = this.pinGroup.children[i];
                pin.revive();
                pin.hit = false;
                pin.x = pin.initialX;
                pin.y = pin.initialY;
                pin.body.velocity.x = 0;
                pin.body.velocity.y = 0;
            }
        }
        this.bowl.body.velocity.x = 0;
        this.bowl.body.velocity.y = 0;
        this.bowl.x = this.bowl.initialX;
        this.bowl.y = this.bowl.initialY;
        this.bowl.blocked = false;
        this.bowl.animations.stop();
        this.step = 0;
    },
    
    endOfRoll : function() {
        var score = 0;
        for (var i = 0; i < this.pinGroup.children.length; i++) {
            if (this.pinGroup.children[i].hit) {
                score++;
            }
        }
        
        this.scores.push(score);
        if (this.subturn == 1 || score == this.pinGroup.children.length) {
            this.turn += 1;
            this.subturn = 0;
            this.reset(false);
        } else {
            this.subturn = 1;
            this.reset(true);
        }
    },
    
    // phaser API implementation

    create : function() {
        game.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        game.add.image(0, 0, 'bowling_background');
        
        this.sound.border = game.add.audio('bowling_border');
        this.sound.pinhit = game.add.audio('bowling_pinhit');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // pins
        this.pinGroup = game.add.group();
        this.createPins(this.pinGroup);
        
        // bowls
        this.bowlGroup = game.add.group();
        this.bowl = this.bowlGroup.create(GAME_WIDTH / 2, GAME_HEIGHT - 30, 'bowling_bowl');
        this.bowl.anchor.setTo(0.5);
        this.bowl.initialX = this.bowl.x;
        this.bowl.initialY = this.bowl.y;
        this.bowl.checkWorldBounds = true;
        this.bowl.events.onOutOfBounds.add(function() {
            game.time.events.add(Phaser.Timer.SECOND, this.endOfRoll, this)
        }, this);
        game.physics.arcade.enable(this.bowl);
        this.bowl.animations.add('roll');
        this.bowl.body.mass = 2;
        this.bowl.blocked = false;
        this.bowl.body.velocity.x = this.bowlChoiceVelocity;
        
        // borders
        this.borderGroup = game.add.group();
        var leftBorder = this.borderGroup.create(0, 0);
        game.physics.arcade.enable(leftBorder);
        leftBorder.body.setSize(this.borderWidth, GAME_HEIGHT);
        var rightBorder = this.borderGroup.create(GAME_WIDTH - this.borderWidth, 0);
        game.physics.arcade.enable(rightBorder);
        rightBorder.body.setSize(this.borderWidth, GAME_HEIGHT);
        
        // foreground
        this.foreGroup = game.add.group();
        this.foreGroup.create(0, 0, 'bowling_foreground');
        
        // keys
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    },

    update : function() {
        if (!this.spaceFlag) {
            if (this.step == 0) { // choose origin
                if (this.bowl.body.x < this.leftBound) {
                    this.bowl.body.velocity.x = this.bowlChoiceVelocity;
                } else if (this.bowl.body.x + this.bowl.body.width > this.rightBound) {
                    this.bowl.body.velocity.x = -this.bowlChoiceVelocity;
                }
                
                if (this.spaceKey.isDown) {
                    this.spaceFlag = true;
                    this.bowl.body.velocity.x = 0;
                    this.step = 1;
                    this.arrow = game.add.image(this.bowl.body.x + this.bowl.body.width / 2, this.bowl.body.y, 'bowling_arrow');
                    this.arrow.anchor.setTo(0.5, 1.0);
                }
            } else if (this.step == 1) { // choose direction
                this.arrow.angle += this.arrowAngleStep;
                if (this.arrow.angle > 45 || this.arrow.angle < -45) {
                    this.arrowAngleStep = -this.arrowAngleStep;
                }
                
                if (this.spaceKey.isDown) {
                    this.spaceFlag = true;
                    this.bowl.body.velocity.y = -800;
                    this.bowl.body.velocity.x = -(this.arrow.angle * this.bowl.body.velocity.y) / 45;
                    this.bowl.animations.play('roll', 10, true);
                    this.arrow.kill();
                    this.step = -1;
                }
            } else {
                game.physics.arcade.overlap(this.bowlGroup, this.borderGroup, this.blockBall, null, this);
                game.physics.arcade.collide(this.bowlGroup, this.pinGroup, function(bowl, pin) {
                    if (!pin.hit) {
                        pin.hit = true;
                        this.sound.pinhit.play();
                    }
                }, null, this);
                game.physics.arcade.collide(this.pinGroup, this.pinGroup, function(pin1, pin2) {
                    if ((!pin1.hit) || (!pin2.hit)) {
                        pin1.hit = true;
                        pin2.hit = true;
                        this.sound.pinhit.play();
                    }
                }, null, this);
            }
        } else if (!this.spaceKey.isDown) {
            this.spaceFlag = false;
        }
    }

};
