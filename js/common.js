// common utilities (= globals) for all scripts & levels

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, 'game', Phaser.AUTO);

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadPlayer(x, y, physics, group /* optional */) {
    var player = null;
    if (group != undefined) {
        player = group.create(x, y, 'player');
    } else {
        player = game.add.sprite(x, y, 'player');
    }
    player.animations.add('moveDown', [1, 2, 3, 0], 10, true);
    player.animations.add('moveLeft', [5, 6, 7, 4], 10, true);
    player.animations.add('moveRight', [9, 10, 11, 8], 10, true);
    player.animations.add('moveUp', [13, 14, 15, 12], 10, true);
    player.anchor = {x : 0.5, y : 1};
    physics.enable(player);
    player.body.collideWorldBounds = true;
    player.body.setSize(32, 18, 0, -4);
    return player;
}

function createWindow(g, x, y, w, h, backgroundColor /* optional */) {
    // g = graphics object
    g.fixedToCamera = true;
    var frame = {

        graphx : g,
        
        xCoord : x,
        
        yCoord : y,
        
        width : w,
        
        height : h,
        
        color : backgroundColor || 0xddddff,

        textString : null,
        
        setY : function(y) {
            this.yCoord = y;
            this.graphx.clear();
            this.graphx.lineStyle(4, 0x000000, 0.9);
            this.graphx.beginFill(this.color, 0.9);
            this.graphx.drawRoundedRect(this.xCoord, this.yCoord, this.width, this.height, 8);
            this.graphx.endFill();
            this.setText(this.textString);
        },

        setText : function(text) {
            if (text == null) {
                return;
            }
            this.textString = text;
            if (this.text != null) {
                this.text.kill();
            }
            this.graphx.visible = true;
            this.text = game.add.text(this.xCoord, this.yCoord + 4, text, { font: "18px Arial", fill: "black", align: 'center', boundsAlignH: "center", boundsAlignV: "middle" });
            this.text.setTextBounds(this.xCoord, this.yCoord, this.width, this.height);
            this.text.fixedToCamera = true;
        },
        
        hide : function() {
            this.text.visible = false;
            this.graphx.visible = false;
        },
        
        bringToTop : function() {
            game.world.bringToTop(this.graphx);
            game.world.bringToTop(this.text);
        }

    };
    frame.setY(y);
    return frame;
}

function createJauge(g, x, y, w, h, maxFill, text /* optional */, fillColor /* optional */) {
    var jauge = {

        frame : createWindow(g, x, y, w, h, 0xffffff),

        graphics : game.add.graphics(0, 0),

        xCoord : x + 4,

        yCoord : y + 4,

        width : w - 8,

        height : h - 8,

        max : maxFill,

        fill : 0,

        backText : text,

        color : fillColor || 0xaa6611,

        setY : function(y) {
            this.frame.setY(y);
            this.yCoord = y + 4;
            this.setFill(this.fill);
        },

        setFill : function(fill) {
            if (fill > this.max) {
                fill = this.max;
            }
            this.graphics.clear();
            if (fill > 0) {
                this.graphics.lineStyle(null);
                this.graphics.beginFill(this.color, 0.9);
                var bw = Math.round(fill * this.width / this.max);
                bw = (bw < 20 ? 20 : bw); // solve phaser bug
                this.graphics.drawRoundedRect(this.xCoord, this.yCoord, bw, this.height, 4);
                this.graphics.endFill();
            }
            this.fill = fill;
        }
    };
    jauge.graphics.fixedToCamera = true;
    if (text != undefined) {
        jauge.frame.setText(text);
    }
    return jauge;
}

function clearMessageBubble(g) {
    if (g.text != null) {
        g.text.kill();
    }
    g.clear();
}

function messageBubble(g, x, y, msg, position) {
    // g = graphics object
    // x, y = position of the bubble's arrow bottom point (= top of the speaking character)
    // position = 'right' (default), 'left' or 'center'
    position = position || 'right'; // position of the bubble relatively to arrow

    var text = new Phaser.Text(game, 0, 0, msg, { font: "18px Arial" }); // only to have text size
    var arrow = null;
    y -= 28; // bubble is above the speaker
    if (position == 'right') {
        arrow = [x + 16, y - 4, x + 8, y + 18, x + 32, y - 4];
        x += text.width / 4;
    } else if (position == 'left') {
        arrow = [x - 16, y - 4, x - 8, y + 18, x - 32, y - 4];
        x -= text.width / 4;
    } else { // center
        arrow = [x - 8, y - 4, x, y + 18, x + 8, y - 4];
    }
    var ellipseOriginY = y - text.height;
    g.clear();
    g.lineStyle(2, 0x000000);
    g.beginFill(0xffffff);
    g.drawEllipse(x, ellipseOriginY, 2 * text.width / 3, text.height);
    g.endFill();
    g.lineStyle(null);
    g.beginFill(0xffffff);
    g.drawPolygon(arrow);
    g.endFill();
    g.lineStyle(2, 0x000000);
    g.drawPolygon(arrow);
    if (g.text != null) {
        g.text.kill();
    }
    g.text = game.add.text(x - text.width / 2, ellipseOriginY + 2 - text.height / 2, msg, { font : "18px Arial", fill : "black", align : "center" });
}
