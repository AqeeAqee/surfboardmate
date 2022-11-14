controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        changeSettingIndex(-1)
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        mode = 1
        sdwireless.sdw_mbit_send_value("mode", mode)
        blockSettings.writeNumberArray("SurfBoardMate", settingValues)
        hideSettings()
        scene.setBackgroundImage(picture)
    } else {
        mode = 0
        sdwireless.sdw_mbit_send_value("mode", mode)
        showSettings()
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    pause2 = !(pause2)
})
function updateColors () {
    color.setColor(13, color.__hsv(settingValues[0] * 255 / 360, 255, settingValues[1] * 255 / 100))
    color.setColor(11, color.__hsv(settingValues[0] * 255 / 360, 255, settingValues[2] * 255 / 100))
}
function showSettings () {
    if (curSettingIndex == -1) {
        initSettingArrays()
        updateColors()
        dialogBG = sprites.create(new myDialog(settingNames.length*(28)+15+6).getImage(), 0)
        dialogBG.top = 15 - 12
        for (let index = 0; index <= settingNames.length - 1; index++) {
            settingSpr = textsprite.create(getSettingItemText(settingNames[index], settingValues[index]), 0, 15)
            settingSprs[index] = settingSpr
            settingSpr.left = 10
            settingSpr.top = index * 28 + 15
            settingSpr.setBorder(2, 0, 2)
            settingSpr.setOutline(0, 15)
            settingSpr.setIcon(settingIcons[index])
        }
        changeSettingIndex(1)
    } else {
        for (let textSpr of settingSprs) {
            textSpr.setFlag(SpriteFlag.Invisible, false)
        }
        dialogBG.setFlag(SpriteFlag.Invisible, false)
    }
}
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (mode == 0) {
        changeSettingValue(1)
    }
})
function hideSettings () {
    for (let textSpr2 of settingSprs) {
        textSpr2.setFlag(SpriteFlag.Invisible, true)
    }
    dialogBG.setFlag(SpriteFlag.Invisible, true)
}
function changeSettingIndex (dir: number) {
    if (curSettingIndex != -1) {
        settingSprs[curSettingIndex].setBorder(2, 0, 2)
        settingSprs[curSettingIndex].setOutline(0, 15)
    }
    curSettingIndex += dir
    if (curSettingIndex < 0) {
        curSettingIndex = settingNames.length - 1
    } else if (curSettingIndex > settingNames.length - 1) {
        curSettingIndex = 0
    }
    settingSprs[curSettingIndex].setBorder(2, 9, 2)
    settingSprs[curSettingIndex].setOutline(0, 3)
    scene.centerCameraAt(80, settingSprs[curSettingIndex].y)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        changeSettingValue(-1)
    }
})
function changeSettingValue (delta: number) {
    if (radioSending) {
        return
    }
    radioSending = true
    temp = delta + settingValues[curSettingIndex]
    if (temp < settingMinValues[curSettingIndex]) {
        temp = settingMaxValues[curSettingIndex]
    } else if (temp > settingMaxValues[curSettingIndex]) {
        temp = settingMinValues[curSettingIndex]
    }
    sdwireless.sdw_mbit_send_value(settingNames[curSettingIndex], temp)
    settingValues[curSettingIndex] = temp
    settingSprs[curSettingIndex].setText(getSettingItemText(settingNames[curSettingIndex], temp))
    if (curSettingIndex <= 2) {
        updateColors()
    }
    pause(1)
    radioSending = false
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        changeSettingValue(1)
    }
})
function drawScanline () {
    t += 2
    if (t >= 160) {
        t = 0
        for (let index2 = 0; index2 <= values.length - 1; index2++) {
            values[index2] = 0
            lastValues[index2] = 0
            lastTs[index2] = 0
        }
    }
    picture.drawLine(t, 0, t, 119, 15)
    picture.drawLine(t + 1, 0, t + 1, 119, 15)
    picture.drawLine(t + 2, 0, t + 2, 119, 10)
}
function plotBars () {
    picture.fill(15)
    for (let index22 = 0; index22 <= values.length - 1; index22++) {
        picture.fillRect(80, index22 * 40, values[index22], 20, colors[index22])
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        changeSettingIndex(1)
    }
})
sdwireless.sdw_onmbit_string(function (radioMsg) {
    gotData(radioMsg)
})
function gotData (strData: string) {
    // console.log(strData)
    strValues = strData.split(",")
    if (mode == 0 || pause2) {
        return
    }
    for (let index3 = 0; index3 <= strValues.length - 1; index3++) {
        values[index3] = parseFloat(strValues[index3]) / 50
        if (mode == 1) {
            picture.drawLine(lastTs[index3], 60 - lastValues[index3], t, 60 - values[index3], colors[index3])
        } else {
            plotBars()
        }
        lastValues[index3] = values[index3]
        lastTs[index3] = t
    }
}
function initSettingArrays () {
    settingSprs = []
    settingNames = [
    "HUE",
    "MaxBrightness",
    "MinBrightness",
    "AccThreshold%",
    "AccXThreshold%",
    "AccYThreshold%"
    ]
    // console.log(blockSettings.exists("SurfBoardMate"))
    if (blockSettings.exists("SurfBoardMate") && settingNames.length == blockSettings.readNumberArray("SurfBoardMate").length) {
        settingValues = blockSettings.readNumberArray("SurfBoardMate")
        console.log(settingValues.length)
    } else {
        settingValues = [
        10,
        55,
        5,
        110,
        20,
        80
        ]
    }
    settingMaxValues = [
    360,
    100,
    50,
    200,
    70,
    200
    ]
    settingMinValues = [
    1,
    40,
    1,
    100,
    1,
    10
    ]
    settingIcons = [
    img`
        . . . . b b b b b b b . . . . . 
        . . b b b b b b b b b b b . . . 
        . b b b d d d d d d d b b b . . 
        . b b d d d d d d d d d b b . . 
        b b d d d d d d d d d d d b b . 
        b b d d d d d d d d d d d b b . 
        b b d d d d d d d d d d d b b . 
        b b d d d d d d d d d d d b b . 
        b b d d d d d d d d d d d b b . 
        b b d d d d d d d d d d d b b . 
        b b d d d d d d d d d d d b b . 
        . b b d d d d d d d d d b b . . 
        . b b b d d d d d d d b b b . . 
        . . b b b b b b b b b b b . . . 
        . . . . b b b b b b b . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . d d . . . . . . . . . . . . . 
        d . . . . . . . . . . . . . . . 
        d . . . . . . . . . . . . . . . 
        d . . . . . . . . . . . . . . . 
        d . . . . . d d d d d . . . . . 
        d . . d d d d . . . d d . . . . 
        . d d d . . . . . . . d . . . . 
        . . . . . . . . . . . d . . . . 
        . . . . . . . . . . . d . . . . 
        . . . . . . . . . . d . . . . . 
        . . . . . . . . . d . . . . . . 
        . . . . . . . . d d . . . . . . 
        . . . . . . . d d . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . b b . . . . . . . . . . . . . 
        b . . . . . . . . . . . . . . . 
        b . . . . . . . . . . . . . . . 
        b . . . . . . . . . . . . . . . 
        b . . . . . b b b b b . . . . . 
        b . . b b b b . . . b b . . . . 
        . b b b . . . . . . . b . . . . 
        . . . . . . . . . . . b . . . . 
        . . . . . . . . . . . b . . . . 
        . . . . . . . . . . b . . . . . 
        . . . . . . . . . b . . . . . . 
        . . . . . . . . b b . . . . . . 
        . . . . . . . b b . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . 1 1 1 1 . . . . . . . . 
        . . . 1 1 . . 1 1 1 . . . . . . 
        . . 1 1 . . . . . 1 . . . . . . 
        . . 1 . . . . . . . . . . . . . 
        . . 1 . . . . . . . . . . . . . 
        . . 1 . . . . 1 1 1 1 . . . . . 
        . . 1 . . . . . . . 1 . . . . . 
        . . 1 . . . . . . . 1 . . . . . 
        . . 1 1 . . . . . . 1 . . . . . 
        . . . 1 1 . . . 1 1 1 . . . . . 
        . . . . 1 1 1 1 . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . 1 1 . . 1 1 . . . . . . . 
        1 . 1 . . . . . . 1 . 1 . . . . 
        1 1 . . . . . . . . 1 1 . . . . 
        1 1 1 . . . . . . 1 1 1 . . . . 
        . . . . . . . . . . . . . . . . 
        b b . . . . . . . . . b b . . . 
        . b b b b b b b b b b b . . . . 
        . . . . . . b . . . . . . . . . 
        . . . . . . b . . . . . . . . . 
        . b b . . . b . . . . b b . . . 
        . b b b b b b b b b b b b . . . 
        . b b . . . . . . . . b b . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . 1 . . . . . . 
        . . . . . . . . . . 1 . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . . . . . . . 1 . . . . . 
        b . . . . . . . . 1 . . . . . . 
        . b b . . . . . . . . . . . . b 
        . . b b b b b b b b b b b b b . 
        . . . . b . . . . . . . b . . . 
        . . . b b b . . . . . b b b . . 
        . . . b b b . . . . . b b b . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `
    ]
}
function getSettingItemText (itemName: string, itemValue: number) {
    return "" + itemName + ": " + itemValue + ""
}
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if (mode == 0) {
        changeSettingValue(-1)
    }
})
let strValues: string[] = []
let lastTs: number[] = []
let lastValues: number[] = []
let values: number[] = []
let t = 0
let settingMaxValues: number[] = []
let settingMinValues: number[] = []
let temp = 0
let radioSending = false
let settingIcons: Image[] = []
let settingSprs: TextSprite[] = []
let settingSpr: TextSprite = null
let settingNames: string[] = []
let dialogBG: Sprite = null
let settingValues: number[] = []
let curSettingIndex = 0
let mode = 0
let colors: number[] = []
let picture: Image = null
let pause2 = false
let sim = false
pause2 = false
picture = image.create(160, 120)
scene.setBackgroundImage(picture)
if (!(sim)) {
    sdwireless.sdw_init()
}
sdwireless.sdw_set_radiogp(1)
colors = [
5,
7,
2,
9
]
// 0 = setting
// 1 = polyline
// 2 = bars
mode = 1
curSettingIndex = -1
game.onUpdateInterval(50, function () {
    if (mode == 1 && !(pause2)) {
        drawScanline()
    }
})
game.onUpdateInterval(50, function () {
    if (sim) {
        gotData("" + randint(0, 1024) + "," + randint(-1024, 1024) + "," + randint(0, 1024))
    }
})
