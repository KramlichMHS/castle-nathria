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
        . . 2 . . . . . 2 . . . . . . . 
        . . . . 2 2 2 2 2 . . 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
        . . . 2 2 2 2 2 2 2 2 2 2 2 2 . 
        . . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 . 2 2 2 2 2 2 2 2 2 2 . 2 2 2 
        . . . 2 2 2 2 2 2 2 2 2 2 2 2 2 
        . 2 2 2 . . 2 2 . . . . 2 2 2 2 
        `, SpriteKind.bloodSPot)
    bloodSpot.setPosition(otherSprite.x, otherSprite.y)
    bloodSpot.z = -1
    otherSprite.destroy()
    playerHealth.value += -5
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.bloodSPot, function (sprite, otherSprite) {
    playerHealth.value += -0.1
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
function echos () {
    count = 0
    for (let index = 0; index < 10; index++) {
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
    countBloods = 0
    for (let value of bloodList) {
        if (countBloods % 2 == 0) {
            value.destroy(effects.disintegrate, 2000)
            pause(1000)
            bloodList.removeAt(bloodList.indexOf(value))
        }
    }
}
statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 0, function (status) {
    game.over(false, effects.melt)
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 60, function (status) {
    echos()
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 70, function (status) {
    sonicPulse2()
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
            . . 2 . . . . . 2 . . . . . . . 
            . . . . 2 2 2 2 2 . . 2 2 2 2 2 
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
            . . . 2 2 2 2 2 2 2 2 2 2 2 2 . 
            . . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
            . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
            . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
            . 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
            . 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
            . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
            2 . 2 2 2 2 2 2 2 2 2 2 . 2 2 2 
            . . . 2 2 2 2 2 2 2 2 2 2 2 2 2 
            . 2 2 2 . . 2 2 . . . . 2 2 2 2 
            `, SpriteKind.bloodSPot)
        bloodSpot.setPosition(mage.x, mage.y)
        bloodSpot.z = -1
    }
}
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 20, function (status) {
    echos()
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 40, function (status) {
    echos()
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 10, function (status) {
    sonicPulse2()
})
statusbars.onStatusReached(StatusBarKind.EnemyHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 80, function (status) {
    echos()
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
echos()
pause(5000)
immunePhase()
