namespace SpriteKind {
    export const Boss = SpriteKind.create()
    export const Echo = SpriteKind.create()
    export const sonic = SpriteKind.create()
    export const bloodSPot = SpriteKind.create()
    export const warningSign = SpriteKind.create()
    export const ImmuneBoss = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Echo, function (sprite, otherSprite) {
    bloodSpot = sprites.create(img`
        2 . . . 2 . 2 . . . . . 
        . 2 2 2 2 2 . . . 2 . 2 
        . 2 2 2 2 2 2 2 2 2 2 . 
        . 2 . 2 2 2 2 2 2 . 2 . 
        . 2 2 2 2 2 2 2 2 2 2 . 
        . . 2 2 2 2 2 2 2 2 2 . 
        2 . 2 2 2 2 2 2 2 2 2 . 
        2 2 2 2 2 2 2 2 2 2 2 . 
        . . 2 2 2 2 2 2 2 2 2 . 
        2 2 2 2 2 2 2 2 2 2 . 2 
        . 2 2 . . 2 2 2 . . . . 
        . 2 . . 2 . . . . 2 2 . 
        `, SpriteKind.bloodSPot)
    bloodSpot.setPosition(otherSprite.x, otherSprite.y)
    bloodSpot.z = -1
    otherSprite.destroy()
    playerHealth.value += -3
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.bloodSPot, function (sprite, otherSprite) {
    playerHealth.value += -0.05
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 0, function (status) {
    game.over(true, effects.confetti)
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 90, function (status) {
    sonicPulse2()
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 50, function (status) {
    sonicPulse2()
})
function echos (numEchos: number) {
    count = 0
    for (let index = 0; index < numEchos; index++) {
        echoo = sprites.create(img`
            . d d d d d d d . 
            d d b b b b b d d 
            d b d d d d d b d 
            d b d b b b d b d 
            d b d b d b d b d 
            d b d b b b d b d 
            d b d d d d d b d 
            d d b b b b b d d 
            . d d d d d d d . 
            `, SpriteKind.Echo)
        echoo.setPosition(shriekwing.x, shriekwing.y)
        if (count % 4 == 0) {
            echoo.setVelocity(18, 18)
        } else if (count % 4 == 1) {
            echoo.setVelocity(-18, 18)
        } else if (count % 4 == 2) {
            echoo.setVelocity(-18, -18)
        } else if (count % 4 == 3) {
            echoo.setVelocity(18, -18)
        }
        echoo.setBounceOnWall(true)
        count += 1
        echoo.lifespan = 10000
        pause(1000)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    projectile = sprites.createProjectileFromSprite(img`
        . . 5 5 5 5 5 5 . . 
        . 5 5 4 4 4 4 5 5 . 
        . 5 4 2 2 2 2 4 5 . 
        . . 5 4 2 2 4 5 . . 
        . . 5 4 2 2 4 5 . . 
        . . 5 4 2 2 4 5 . . 
        . . . 5 4 4 5 . . . 
        . . . . 5 5 . . . . 
        . . . 5 . . . . . . 
        . . . . . 5 . . . . 
        `, mage, 0, -150)
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 66.6, function (status) {
    immunePhase()
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Boss, function (sprite, otherSprite) {
    ShreikHealth.value += -0.25
    sprite.destroy()
})
sprites.onCreated(SpriteKind.bloodSPot, function (sprite) {
    bloodList.push(sprite)
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 30, function (status) {
    sonicPulse2()
})
function immunePhase () {
    shriekwing.setPosition(80, 60)
    shriekwing.setKind(SpriteKind.ImmuneBoss)
    animation.stopAnimation(animation.AnimationTypes.All, shriekwing)
    shriekwing.setImage(assets.image`immuneBat`)
    animation.runImageAnimation(
    shriekwing,
    assets.animation`immuneBatAnimation`,
    200,
    true
    )
    shriekwing.setFlag(SpriteFlag.GhostThroughWalls, true)
    countBloods = 0
    for (let value of bloodList) {
        if (countBloods % 2 == 0) {
            value.destroy(effects.disintegrate, 2000)
            pause(1000)
            bloodList.removeAt(bloodList.indexOf(value))
        }
    }
    pause(2000)
    for (let index = 0; index < 3; index++) {
        shriekwing.follow(mage, 25)
        pause(5000)
        shriekwing.follow(mage, 0)
        sonicPulse2()
        pause(1000)
        echos(5)
    }
    shriekwing.setKind(SpriteKind.Boss)
    shriekwing.setPosition(80, 20)
    shriekwing.setFlag(SpriteFlag.GhostThroughWalls, false)
    animation.runImageAnimation(
    shriekwing,
    assets.animation`callScreech`,
    200,
    true
    )
}
statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 0, function (status) {
    game.over(false, effects.melt)
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 60, function (status) {
    echos(10)
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 70, function (status) {
    sonicPulse2()
})
function HomeScreen () {
    scene.setBackgroundImage(img`
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccccccccccccccccccccccc222222222222222cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccc222222222222222222222cccccccccccccccccccccccc2222222222cccccccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccccccccccccccccc222222222222222222222222222ccccccccccccccccccccc2222222222cccccccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccc22222222222222222222222222222cccccccccccccccccccc22222222222ccccccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccc222222222222222222222222222222222cccccccccccccccccc22222222222ccccccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccc2222222222222222222222222222222222222cccccccccccccccc222222222222cccccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccccccccccc222222222222222222222222222222222222222ccccccccccccccc2222222222222ccccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccc22222222222222222222222222222222222222222cccccccccccccc2222222222222ccccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccccccccc2222222222222222222222222222222222222222222ccccccccccccc22222222222222cccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccc222222222222222222222222222222222222222222222cccccccccccc22222222222222cccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccccccc22222222222222222222222222222222222222222222222ccccccccccc222222222222222ccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccc222222222222222222ccccccccccccc222222222222222222cccccccccc222222222222222ccccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccc2222222222222222ccccccccccccccccc2222222222222222cccccccccc2222222222222222cccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccccc222222222222222ccccccccccccccccccccc222222222222222ccccccccc2222222222222222cccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccccc2222222222222ccccccccccccccccccccccccc2222222222222ccccccccc22222222222222222ccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccc2222222222222ccccccccccccccccccccccccccc2222222222222cccccccc22222222222222222ccccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccc2222222222222ccccccccccccccccccccccccccccc2222222222222ccccccc2222222222c2222222cccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccc222222222222ccccccccccccccccccccccccccccccc222222222222ccccccc2222222222c22222222ccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccccc22222222222ccccccccccccccccccccccccccccccccc22222222222ccccccc2222222222cc2222222ccccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccc222222222222ccccccccccccccccccccccccccccccccc222222222222cccccc2222222222cc22222222cccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccc22222222222ccccccccccccccccccccccccccccccccccc22222222222cccccc2222222222ccc2222222cccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccccccccccc22222222222ccccccccccccccccccccccccccccccccccc22222222222cccccc2222222222cccc2222222ccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc22222222222cccdccccccccccccccccccccccccccccccccc22222222222ccccc2222222222cccc2222222ccccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc22222222222cccdccccccccccccdcccccccccccccccccccc22222222222ccccc2222222222ccccc2222222cccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222ccccddccccccccccdddccccccccccccccccccccccccccccccccccc2222222222ccccc2222222cccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222dcccddccccccccccdddccccccccccccccccccccccccccccccccccc2222222222cccccc2222222ccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222cccdddcccccccccdddddcccccccccccccccccccccccccccccccccc2222222222cccccc2222222ccccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222cccddddccccccccddddddccccccccccccccccccccccccccccccccc2222222222ccccccc2222222cccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222dcccddccccccccccddddcccccccccccccccccccccccccccccccccc2222222222ccccccc22222222ccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222ddccdddcccccccddddddcccccccccccccccccccccccccccccccccc2222222222cccccccc2222222ccccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222cccdddcccccccccddddddccccccccccccccccccccccccccccccccc2222222222cccccccc22222222cccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222dccddddcccccccdddddcddcccccccccccccccccccccccccccccccc2222222222ccccccccc2222222cccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222dddddddccccccdddddddcccccccccccccccccccccccccccccccccc2222222222cccccccccc2222222ccccccc2222222222ccccccccccccccccccccccccccccccc
        ccccccccccccccccccccc2222222222dddddddddddddccddddddccccccccccccccccccccccccccccccccc2222222222cccccccccc2222222ccccccc2222222222ccccccccccccccccccccccccccccccc
        cccccccccccccdccccccc2222222222ddddddddddddddccddddddcccccccccccccccccccccccccccccccc2222222222ccccccccccc2222222cccccc2222222222ccccccccccccdcccccccccccccccccc
        ccccccccccccdddcccccc2222222222ddddddddddddddddddcccccccccccccccccccccccccccccccccccc2222222222ccccccccccc2222222cccccc2222222222ccccccdccccddcccccccccccccccccc
        ccccccccccccddccccccc2222222222dddddddddddddddddddccccccccccccccccccccccccccccccccccd2222222222cccccccccccc2222222ccccc2222222222ccccccddcccddcccccccccccccccccc
        cccccccccccdddcccccccc2222222222dddddddddddddddddddcccccccccccccccccc2222222222cccccd2222222222cccccccccccc2222222ccccc2222222222ccccccddccdddcccccccccccccccccc
        ccccccccccdddddccccccd2222222222ddddddddddddddddddddccccccccccccccccc2222222222cccccd2222222222ccccccccccccc2222222cccc2222222222cdcccddddcdddddcccccccccccccccc
        cccccccccccdddcccccddd22222222222ddddddddddddddddddddccccccccccccccc22222222222ccccdd2222222222ccccccccccccc22222222ccc2222222222dddccddddccddcccccccccccccccccc
        ccccccccccccdddcccddddd2222222222dddddddddddddddddddddcccccccccccccc2222222222cccccdd2222222222cccccccccccccc2222222ccc2222222222dddcccddccddddddccccccccccccccc
        ccccccccccddddccddddddd22222222222dddddddddddddddddddddcccccccccccc22222222222ccccccd2222222222cccccccccccccc22222222cc2222222222dddcdddddddddcccccccccdcccccccc
        cccccccccccdddddddddddd22222222222ddddddddddddddddddddddccccccccccc22222222222ccccddd2222222222ccccccccccccccc2222222cc2222222222cdddcddddcccddccccccccdcccccccc
        ccccccccccccdddddddddddd22222222222ddddddddddddddddddddddccccccccc22222222222ccccccdd2222222222cccccccccccccccc2222222c2222222222dddccdddddccdccccccccddddcccccc
        ccccccccccccddddddddddddd22222222222ddddddddddddddddddddddccccccc22222222222cccccccdd2222222222cccccccccccdcccc2222222c2222222222dddddddddddcdcccccccccdcccccccc
        cccccccccccdddddddddddddd222222222222dddddddddddddddddddddcccccc222222222222cccccdddd2222222222ccccccccccddccccc22222222222222222ddddddddddddddddccccddddccccccc
        ccccccccccdddddddddddddddd222222222222dddddddddddddddddddddcccc222222222222cccccccddd2222222222ccccccccccdddcccc22222222222222222dddccdddddddddddddcccdddccccccc
        ccccccccdddddddddddddddddd22222222222222ddddddddddddddddddddc22222222222222ccccccccdd2222222222cccccccccdddddcccc2222222222222222dddddddddddddddddddccdddddccccc
        cccccccdddddddddddddddddddd222222222222222ddddddddddddddddd222222222222222ccccccccddd2222222222ccccccccdddddddccc2222222222222222dddddddddddddddddddddddddcccccc
        ccccccdddddddddddddddddddddd2222222222222222ddddddddddddd2222222222222222cccccccddddd2222222222dcccccccdcddddccccc222222222222222ddddddddddddddddddddddddccccccc
        cccccdddddddddddddddddddddddd2222222222222222222222222222222222222222222ccccccddddddd2222222222ddddcccccdddddccccc222222222222222ddddddddddddddddddddddddccccccc
        cccddddddddddddddddddddddddddd22222222222222222222222222222222222222222ccccdddddddddd2222222222ddddddccdddddddccccc22222222222222dddddddddddddddddddddddddcccccc
        ccddddddddddddddddddddddddddddd222222222222222222222222222222222222222cccdddddddddddd2222222222ddddddddcddddcdccccc22222222222222dddddddddddddddddddddddddddcccc
        cddddddddddddddddddddddddddddddd2222222222222222222222222222222222222cccddddddddddddd2222222222ddddddddddddddccccccc2222222222222dddddddddddddddddddddddddddddcc
        dddddddddddddddddddddddddddddddddd222222222222222222222222222222222dcccdddddddddddddd2222222222dddddddddddddddccccccc222222222222ddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddd22222222222222222222222222222dddddddddddddddddddd2222222222dddddddddddddddccccccc222222222222ddddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddd222222222222222222222222222ddddddddddddddddddddd2222222222ddddddddddddddddccccccc22222222222ddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddd222222222222222222222dddddddddddddddddddddddd2222222222dddddddddddddddddcccccc22222222222ddddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddd222222222222222ddddddddddddddddddddddddddd2222222222dddddddddddddddddddccccd2222222222ddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        `)
    game.showLongText("Welcome to Castle Nathria. Press 'A' and prepare to fight Shreikwing", DialogLayout.Bottom)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.ImmuneBoss, function (sprite, otherSprite) {
    playerHealth.value += -100
})
function sonicPulse2 () {
    warning.say("Break LoS!", 1000)
    pause(2000)
    sonicPulse = sprites.create(assets.image`echoSprite`, SpriteKind.sonic)
    sonicPulse.setPosition(shriekwing.x, shriekwing.y)
    animation.runImageAnimation(
    sonicPulse,
    assets.animation`myAnim0`,
    100,
    false
    )
    pause(1300)
    sonicPulse.destroy()
    if (sight.isInSight(
    shriekwing,
    mage,
    300,
    false
    )) {
        bloodSpot = sprites.create(img`
            2 . . . 2 . 2 . . . . . 
            . 2 2 2 2 2 . . . 2 . 2 
            . 2 2 2 2 2 2 2 2 2 2 . 
            . 2 . 2 2 2 2 2 2 . 2 . 
            . 2 2 2 2 2 2 2 2 2 2 . 
            . . 2 2 2 2 2 2 2 2 2 . 
            2 . 2 2 2 2 2 2 2 2 2 . 
            2 2 2 2 2 2 2 2 2 2 2 . 
            . . 2 2 2 2 2 2 2 2 2 . 
            2 2 2 2 2 2 2 2 2 2 . 2 
            . 2 2 . . 2 2 2 . . . . 
            . 2 . . 2 . . . . 2 2 . 
            `, SpriteKind.bloodSPot)
        bloodSpot.setPosition(mage.x, mage.y)
        bloodSpot.z = -1
        playerHealth.value += -15
    }
}
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 33.3, function (status) {
    immunePhase()
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 20, function (status) {
    echos(10)
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 40, function (status) {
    echos(10)
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 10, function (status) {
    sonicPulse2()
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 80, function (status) {
    echos(10)
})
let sonicPulse: Sprite = null
let countBloods = 0
let projectile: Sprite = null
let echoo: Sprite = null
let count = 0
let bloodSpot: Sprite = null
let ShreikHealth: StatusBarSprite = null
let playerHealth: StatusBarSprite = null
let bloodList: Sprite[] = []
let shriekwing: Sprite = null
let mage: Sprite = null
let warning: Sprite = null
HomeScreen()
tiles.setTilemap(tilemap`level1`)
warning = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.warningSign)
warning.setPosition(80, 60)
mage = sprites.create(img`
    . . . . . . f f f f . . . . . . 
    . . . . f f e e e e f f . . . . 
    . . . f e e e f f e e e f . . . 
    . . f f f f f 2 2 f f f f f . . 
    . . f f e 2 e 2 2 e 2 e f f . . 
    . . f e 2 f 2 f f 2 f 2 e f . . 
    . . f f f 2 2 e e 2 2 f f f . . 
    . f f e f 2 f e e f 2 f e f f . 
    . f e e f f e e e e f e e e f . 
    . . f e e e e e e e e e e f . . 
    . . . f e e e e e e e e f . . . 
    . . e 4 f f f f f f f f 4 e . . 
    . . 4 d f 2 2 2 2 2 2 f d 4 . . 
    . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
    . . . . . f f f f f f . . . . . 
    . . . . . f f . . f f . . . . . 
    `, SpriteKind.Player)
controller.moveSprite(mage, 75, 75)
mage.setPosition(80, 80)
shriekwing = sprites.create(img`
    . . f f f . . . . . . . . . . . 
    f f f c c . . . . . . . . f f f 
    f f c c c . c c . . . f c b b c 
    f f c 3 c c 3 c c f f b b b c . 
    f f c 3 b c 3 b c f b b c c c . 
    f c b b b b b b c f b c b c c . 
    c c 1 b b b 1 b c b b c b b c . 
    c b b b b b b b b b c c c b c . 
    c b 1 f f 1 c b b c c c c c . . 
    c f 1 f f 1 f b b b b f c . . . 
    f f f f f f f b b b b f c . . . 
    f f 2 2 2 2 f b b b b f c c . . 
    . f 2 2 2 2 2 b b b c f . . . . 
    . . f 2 2 2 b b b c f . . . . . 
    . . . f f f f f f f . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Boss)
shriekwing.setPosition(80, 20)
bloodList = []
animation.runImageAnimation(
shriekwing,
assets.animation`callScreech`,
200,
true
)
playerHealth = statusbars.create(75, 4, StatusBarKind.Health)
playerHealth.setLabel("Player")
playerHealth.positionDirection(CollisionDirection.Bottom)
playerHealth.setOffsetPadding(-17, 0)
ShreikHealth = statusbars.create(75, 4, StatusBarKind.EnemyHealth)
ShreikHealth.setLabel("Boss")
ShreikHealth.positionDirection(CollisionDirection.Top)
ShreikHealth.setOffsetPadding(-11, 0)
echos(10)
