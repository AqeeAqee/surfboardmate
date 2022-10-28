controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if (mode == 0) {
        changeSettingValue(-1)
    }
})
sdwireless.sdw_onmbit_string(function (radioMsg) {
    gotData(radioMsg)
})
function updateColors () {
    color.setColor(13, color.__hsv(settingValues[0] * 255 / 360, 255, settingValues[1] * 255 / 100))
    color.setColor(11, color.__hsv(settingValues[0] * 255 / 360, 255, settingValues[2] * 255 / 100))
}
function showSettings () {
    if (curSettingIndex == -1) {
        initSettingArrays()
        updateColors()
        for (let index = 0; index <= settingNames.length - 1; index++) {
            settingSpr = textsprite.create(getSettingItemText(settingNames[index], settingValues[index]), 12, 9)
            settingSprs[index] = settingSpr
            settingSpr.left = 2
            settingSpr.top = index * 28 + 20
            settingSpr.setBorder(2, 15, 2)
            settingSpr.setOutline(0, 15)
            settingSpr.setIcon(settingIcons[index])
        }
        changeSettingIndex(1)
    } else {
        for (let textSpr of settingSprs) {
            textSpr.setFlag(SpriteFlag.Invisible, false)
        }
    }
}
function hideSettings () {
    for (let textSpr2 of settingSprs) {
        textSpr2.setFlag(SpriteFlag.Invisible, true)
    }
}
function changeSettingIndex (dir: number) {
    if (curSettingIndex != -1) {
        settingSprs[curSettingIndex].setBorder(2, 15, 2)
        settingSprs[curSettingIndex].setOutline(0, 15)
    }
    curSettingIndex += dir
    if (curSettingIndex < 0) {
        curSettingIndex = settingNames.length - 1
    } else if (curSettingIndex > settingNames.length - 1) {
        curSettingIndex = 0
    }
    settingSprs[curSettingIndex].setBorder(2, 3, 2)
    settingSprs[curSettingIndex].setOutline(0, 3)
    scene.centerCameraAt(80, settingSprs[curSettingIndex].y)
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        changeSettingIndex(-1)
    }
})
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (mode == 0) {
        changeSettingValue(1)
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
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        changeSettingValue(-1)
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
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        changeSettingValue(1)
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    scene.setBackgroundImage(img`
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        `)
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
function gotData (strData: string) {
    console.log(strData)
    strValues = strData.split(",")
    if (mode == 0) {
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
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == 0) {
        changeSettingIndex(1)
    }
})
function initSettingArrays () {
    settingSprs = []
    settingNames = [
    "HUE",
    "Max Brightness",
    "Min Brightness",
    "Acc Threshold %",
    "Acc X Threshold %",
    "Acc Y Threshold %"
    ]
    if (blockSettings.exists("SurfBoardMate")) {
        settingValues = blockSettings.readNumberArray("SurfBoardMate")
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
    1,
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
    return "" + itemName + " : " + itemValue + ""
}
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
let settingValues: number[] = []
let curSettingIndex = 0
let mode = 0
let colors: number[] = []
let sim = 0
let picture: Image = null
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
    if (mode == 1) {
        drawScanline()
    }
})
game.onUpdateInterval(50, function () {
    if (sim) {
        gotData("" + randint(0, 1024) + "," + randint(-1024, 1024) + "," + randint(0, 1024))
    }
})
