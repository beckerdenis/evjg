var loadState = {

    preload : function() {
        game.add.text(80, 150, 'Chargement en cours...', { font : '30px serif', fill : '#ffffff' });
        
        game.load.spritesheet('bowling_bowl', 'img/bowling_bowl.png', 50, 50);
        game.load.spritesheet('bubblebump_red', 'img/footbulle_red.png', 131, 150);
        game.load.spritesheet('bubblebump_blue', 'img/footbulle_blue.png', 131, 150);
        game.load.spritesheet('bubblebump_unicorn', 'img/footbulle_licorne.png', 131, 150);
        game.load.spritesheet('bubblebump_ball', 'img/footbulle_boal.png');
        
        game.load.image('before_bowling', 'img/dummy.png');
        game.load.image('bowling_pin', 'img/bowling_pin.png');
        game.load.image('bowling_background', 'img/bowling_c1.png');
        game.load.image('bowling_foreground', 'img/bowling_c2.png');
        game.load.image('bowling_arrow', 'img/arrow.png');
        game.load.image('bubblebump_background', 'img/footbulle_c1.png');
        game.load.image('bubblebump_goals', 'img/footbulle_c2.png');
        
        game.load.audio('bowling_roll', 'audio/bip.mp3');
        game.load.audio('bowling_border', 'audio/bip.mp3');
        game.load.audio('bowling_pinhit', 'audio/bowling_pin.ogg');
        game.load.audio('transition', 'audio/bip.mp3');
    },

    create : function() {
        nextState('bowling', [], { img : 'before_bowling', text: '~ Chapitre 1 ~\n   Le Bowling' });
        /*
            { img : '01t1', music : 'intro1', text : "Au fin fond d'une bourgade\n      Perdue dans les montagnes,\nSe prévoyait une escapade\n      Vers la profonde campagne." },
            { img : '01t2', music : 'intro2', text : "Les gourgandins endormis\n      Furent alors soudain réveillés,\nPar un fort et vilain bruit\n      Emis d'un objet enchanté." },
            { img : '01t3', music : 'intro3' },
            { img : '01t4' },
        ], { img : '01t5', text : '~ Chapitre 1 ~\n      La Gare' });
        */
    }

};
