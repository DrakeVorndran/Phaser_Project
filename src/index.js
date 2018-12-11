import 'phaser';

const maxDrag = 300;
const jumpMult = 5;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var platforms;
var player;
var star;
var sky;
var text;
var prevx = 100;
var prevy = 450;

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('boxy', 'assets/boxy.png');
}

function create ()
{
    sky = this.add.image(400, 300, 'sky').setScale(20);

    platforms = this.physics.add.staticGroup();
    this.physics.world.setBounds(0, 0, 4000, 4000);

    text = this.add.text(30, 30).setText('Score: 0').setScrollFactor(0);


    player = this.physics.add.sprite(100,450,'boxy');
    //    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    //    platforms.create(600, 400, 'ground');
    //    platforms.create(50, 250, 'ground');
    //    platforms.create(750, 220, 'ground');
    for(let i = 0; i<10; i++){
        for(let j = 1; j<11; j++){
            if(Math.random()<.5){
            platforms.create(i*400+200, j*400+16, 'ground');
                }
//            platforms.create(i*400+200,3968, 'ground');
        }

    }
    console.log(platforms)
    star = this.add.sprite(100,450,'star').setScale(.5);
    star.visible = false;


    player.setBounce(.2);
    player.setCollideWorldBounds(true);
    this.cameras.main.startFollow(player,.1,.1);
    console.log(this.cameras);

    //    sky.x = this.cameras.main.x;
    //    sky.y = this.cameras.main.y;



    this.physics.add.collider(player, platforms);

    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked)
        {
            star.x += pointer.movementX;
            star.y += pointer.movementY;
            let distx = star.x-player.x;
            let disty = star.y-player.y;
            if((distx*distx)+(disty*disty) < maxDrag*maxDrag){
                star.setTint(0xffffff);

            }
            else{
                star.setTint(0xff0000);
                star.x -= pointer.movementX;
                star.y -= pointer.movementY;

            }


            // Force the sprite to stay on screen


        }
    }, this);

    game.canvas.addEventListener('mousedown', function (pointer) {
        star.visible = true;
        star.x = player.x;
        star.y = player.y;
        game.input.mouse.requestPointerLock();
    });

    game.canvas.addEventListener('mouseup', function (pointer) {
        star.visible = false;


        if (game.input.mouse.locked)
        {
            game.input.mouse.releasePointerLock();
            let distx = player.x-star.x;
            let disty = player.y-star.y;
            player.setVelocityX(distx*jumpMult);
            player.setVelocityY(disty*jumpMult);
        }
    });







}


function update ()
{
    star.x += player.x-prevx;
    star.y += player.y-prevy;
    prevx = player.x;
    prevy = player.y;
    //    sky.x = this.cameras.cameras[0].centerX;
    //    sky.y = this.cameras.cameras[0].centerY;
    if(player.body.touching.down){
        player.body.drag.x = 60;

        //        player.setVelocityX(player.velocityX-(player.velocityX/100))
    }
    else{
        player.body.drag.x = 0;
    }

}
