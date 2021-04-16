// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level1":
            case "level1":return tiles.createTilemap(hex`0a0008000101010101010101010101010101010101010101010102010101010201010101010101010101010101010101010101010101010102010101010201010101010101010101010101010101010101010101`, img`
. . . . . . . . . . 
. . . . . . . . . . 
. . 2 . . . . 2 . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . 2 . . . . 2 . . 
. . . . . . . . . . 
. . . . . . . . . . 
`, [myTiles.transparency16,sprites.dungeon.floorDark2,sprites.dungeon.floorLight0], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
