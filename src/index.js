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
var collectable;
var prevx = 100;
var prevy = 450;
var bombs;
var score = 0;
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

    text = this.add.text(30, 30).setText('Score: '+score).setScrollFactor(0);


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

    collectable = this.physics.add.group({
        key: 'star',
        repeat: 39,
        setXY: {x: 12, y:0, stepX: 100 }
    });

    console.log(platforms)
    star = this.add.sprite(100,450,'star').setScale(.5);
    star.visible = false;


    player.setBounce(.2);
    player.setCollideWorldBounds(true);
    this.cameras.main.startFollow(player,.1,.1);
    console.log(this.cameras);

    //    sky.x = this.cameras.main.x;
    //    sky.y = this.cameras.main.y;

    bombs = this.physics.add.group();


    this.physics.add.collider(player, platforms);
    this.physics.add.collider(collectable, platforms);
    this.physics.add.overlap(player, collectable, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);


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


function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    text.setText('Score: ' + score);

    if (collectable.countActive(true) === 0)
    {
        collectable.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    gameOver = true;
}
