controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == -1) {
        changeSettingIndex(-1)
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    picture.fill(15)
    if (mode == -1) {
        hideSettingScene()
        mode = 0
    } else {
        mode = -1
        initSettingScene()
    }
})
function changeSettingIndex (dir: number) {
    if (curSettingIndex != -1) {
        settingSprs[curSettingIndex].setBorder(0, 6)
    }
    curSettingIndex += dir
    if (curSettingIndex < 0) {
        curSettingIndex = settingNames.length - 1
    } else if (curSettingIndex > settingNames.length - 1) {
        curSettingIndex = 0
    }
    settingSprs[curSettingIndex].setBorder(1, 6)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == -1) {
        changeSettingValue(-1)
    }
})
function changeSettingValue (delta: number) {
    temp = delta + settingValues[curSettingIndex]
    if (temp < settingMinValues[curSettingIndex]) {
        temp = settingMaxValues[curSettingIndex]
    } else if (temp > settingMaxValues[curSettingIndex]) {
        temp = settingMinValues[curSettingIndex]
    }
    settingValues[curSettingIndex] = temp
    settingSprs[curSettingIndex].setText("" + settingNames[curSettingIndex] + ": " + temp)
    sdwireless.sdw_mbit_send_value(settingNames[curSettingIndex], temp)
    pause(11)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == -1) {
        changeSettingValue(1)
    }
})
function hideSettingScene () {
    for (let textSpr of settingSprs) {
        textSpr.setFlag(SpriteFlag.Invisible, true)
    }
}
function drawScanline () {
    t += 2
    if (t >= 160) {
        t = 0
        for (let index = 0; index <= values.length - 1; index++) {
            values[index] = 0
            lastValues[index] = 0
            lastTs[index] = 0
        }
    }
    picture.drawLine(t, 0, t, 119, 15)
    picture.drawLine(t + 1, 0, t + 1, 119, 15)
    picture.drawLine(t + 2, 0, t + 2, 119, 10)
}
function plotBars () {
    picture.fill(15)
    for (let index2 = 0; index2 <= values.length - 1; index2++) {
        picture.fillRect(80, index2 * 40, values[index2], 20, colors[index2])
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == -1) {
        changeSettingIndex(1)
    }
})
sdwireless.sdw_onmbit_string(function (radioMsg) {
    gotData(radioMsg)
})
function initSettingScene () {
    if (curSettingIndex == -1) {
        initSettingArrays()
        for (let index = 0; index <= settingNames.length - 1; index++) {
            settingSpr = textsprite.create("" + settingNames[index] + ": " + settingValues[index])
            settingSprs[index] = settingSpr
            settingSpr.left = 10
            settingSpr.top = index * 20 + 20
        }
        changeSettingIndex(1)
    } else {
        for (let textSpr of settingSprs) {
            textSpr.setFlag(SpriteFlag.Invisible, false)
        }
    }
}
function gotData (strData: string) {
    console.log(strData)
    strValues = strData.split(",")
    if (mode == -1) {
        return
    }
    for (let index3 = 0; index3 <= strValues.length - 1; index3++) {
        values[index3] = parseFloat(strValues[index3]) / 50
        if (mode == 0) {
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
    "b",
    "c",
    "d"
    ]
    settingValues = [
    10,
    1,
    0,
    0
    ]
    settingMaxValues = [
    360,
    4,
    3,
    44
    ]
    settingMinValues = [
    1,
    1,
    2,
    3
    ]
}
let strValues: string[] = []
let settingSpr: TextSprite = null
let lastTs: number[] = []
let lastValues: number[] = []
let values: number[] = []
let t = 0
let settingMaxValues: number[] = []
let settingMinValues: number[] = []
let settingValues: number[] = []
let temp = 0
let settingNames: string[] = []
let settingSprs: TextSprite[] = []
let curSettingIndex = 0
let mode = 0
let colors: number[] = []
let picture: Image = null
let sim = false
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
// -1 = setting
// 0 = polyline
// 1 = bars
mode = 0
curSettingIndex = -1
game.onUpdateInterval(50, function () {
    if (mode == 0) {
        drawScanline()
    }
})
game.onUpdateInterval(50, function () {
    if (sim) {
        gotData("" + randint(0, 1024) + "," + randint(-1024, 1024) + "," + randint(0, 1024))
    }
})
