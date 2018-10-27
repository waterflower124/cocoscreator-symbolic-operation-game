var CHD = require("commonHandler");
cc.Class({
    extends: cc.Component,

    properties: {

        timeNode: cc.Node,
        scoreLable: cc.Label,
        soundBtn: cc.Node, 
        gameOverNode: cc.Node,

        game_pad: cc.Node,

        operator_plus: cc.Node,
        operator_minus: cc.Node,
        operator_multiply: cc.Node,

        operand1_card: cc.Node,
        operand2_card: cc.Node,
        result_card: cc.Node,

        operand1_Label: cc.Label,
        operand2_Label: cc.Label,
        result_Label: cc.Label,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.score = 0;
        this.isGameOver = false;
        this.soundOnTexture = cc.textureCache.addImage(cc.url.raw("resources/images/app/set/sound.png"));
        this.soundOffTexture = cc.textureCache.addImage(cc.url.raw("resources/images/app/set/mute.png"));


        this.operand1 = 0;
        this.operand2 = 0;
        this.operator = 0;
        this.result = 0;
        this.expand = false;

    },

    start () {

        this.operator_plus.on("touchstart", function() {
            
            this.operator = 0;
            let scale_expand = cc.scaleTo(0.1, 1.2);
            let scale_reduce = cc.scaleTo(0.1, 1);
            this.operator_plus.runAction(cc.sequence(scale_expand, scale_reduce));
            this.checkResult();
            
        }, this);

        this.operator_minus.on("touchstart", function() {

            this.operator = 1;
            let scale_expand = cc.scaleTo(0.1, 1.2);
            let scale_reduce = cc.scaleTo(0.1, 1);
            this.operator_minus.runAction(cc.sequence(scale_expand, scale_reduce));
            this.checkResult();
            
        }, this);

        this.operator_multiply.on("touchstart", function() {

            this.operator = 2;
            let scale_expand = cc.scaleTo(0.1, 1.2);
            let scale_reduce = cc.scaleTo(0.1, 1);
            this.operator_multiply.runAction(cc.sequence(scale_expand, scale_reduce));
            this.checkResult();
            
        }, this);




        this.isloadSoundOn = true;
        if (!CHD.getSoundStatus()) {
            this.soundBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.soundOffTexture);
            // cc.audioEngine.pauseAll();
        } else {
            cc.audioEngine.play(cc.url.raw('resources/sounds/HappyLevel.mp3'), true, 1);
            this.isloadSoundOn = false;
        }

        this.soundBtn.on('touchstart', function(){
            let isSound = CHD.getSoundStatus();
            isSound = !isSound;
            if (this.isloadSoundOn) {
                this.isloadSoundOn = false;
                cc.audioEngine.play(cc.url.raw('resources/sounds/HappyLevel.mp3'), true, 1);                
            }
            if (isSound) {
                this.soundBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.soundOnTexture);
                cc.audioEngine.resumeAll();
            } else {
                this.soundBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.soundOffTexture);
                cc.audioEngine.pauseAll();
            }
            CHD.setSoundStatus(isSound);
        }, this);

        this.node.on('touchstart', function(){}, this);
    },

    init() {
        this.score = 0;
        this.isGameOver = false;
        this.scoreLable.string = this.score;
        this.isComplex = false;
        
        this.expand = false;
        this.generateOperands();
        this.runTimeAction();
    },

    

    checkResult() {

        var result_local = 0;
        switch (this.operator) {
            case 0:
                result_local = this.operand1 + this.operand2;
                break;
            case 1:
                result_local = this.operand1 - this.operand2;
                break;
            case 2:
                result_local = this.operand1 * this.operand2;
        }

        if(result_local == this.result) {
 
            this.score ++;
            this.scoreLable.string = this.score;
            if(this.score == 5) {
                this.expand = true;
            }
            this.runTimeAction();
            if (CHD.getSoundStatus()) {
                cc.audioEngine.play(cc.url.raw('resources/sounds/right.mp3'), false, 1);
            }
            let scale_reduce = cc.scaleTo(0.05, 0, 1);
            this.operand1_card.runAction(cc.scaleTo(0.05, 0, 1));
            this.operand2_card.runAction(cc.scaleTo(0.05, 0, 1));
            this.result_card.runAction(cc.sequence(cc.scaleTo(0.05, 0, 1), cc.callFunc(this.generateOperands, this)));
        } else {
            if (CHD.getSoundStatus()) {
                cc.audioEngine.play(cc.url.raw('resources/sounds/wrong.mp3'), false, 1);
            }
            this.padMoving_Over();
        }
    },

    generateOperands() {

        if(this.expand) {
            this.operator_plus.setPositionX(-355);
            this.operator_minus.setPositionX(0);
            this.operator_multiply.active = true;
        } else {
            this.operator_plus.setPositionX(-250);
            this.operator_minus.setPositionX(250);
            this.operator_multiply.active = false;
        }
        
        this.operand1 = Math.round(8 * Math.random()) + 1;
        this.operand2 = Math.round(8 * Math.random()) + 1;
        if(this.expand)
            this.operator = Math.round(2 * Math.random());
        else 
            this.operator = Math.round(Math.random());
        switch(this.operator) {
            case 0:
                this.result = this.operand1 + this.operand2;
                break;
            case 1:
                this.result = this.operand1 - this.operand2;
                break;
            case 2:
                this.result = this.operand1 * this.operand2;
        }

        this.operand1_Label.string = this.operand1;
        this.operand2_Label.string = this.operand2;
        this.result_Label.string = "=" + this.result

        let scale_expand = cc.scaleTo(0.05, 1, 1);
        this.operand1_card.runAction(cc.scaleTo(0.05, 1, 1));
        this.operand2_card.runAction(cc.scaleTo(0.05, 1, 1));
        this.result_card.runAction(cc.scaleTo(0.05, 1, 1));
    },

    padMoving_Over() {
        let moveleft = cc.moveTo(0.07, cc.p(-36, 298));
        let moveright = cc.moveTo(0.07, cc.p(36, 298));
        
        let movecenter = cc.moveTo(0.07, cc.p(6, 298));
        this.game_pad.runAction(cc.sequence(moveleft, moveright, moveleft, movecenter, cc.callFunc(this.gameOver, this)));

    },


    runTimeAction() {
        this.timeNode.scale = 1;
        this.timeNode.stopAllActions();
        let s = cc.scaleTo(3, 0, 1);
        this.timeNode.runAction(cc.sequence(s, cc.callFunc(this.gameOver, this)));
    },

    gameOver() {

        this.node.active = false;
        this.gameOverNode.active = true;
        this.gameOverNode.getComponent('gameOver').setScore(this.score);
    }
});
