controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mode == -1) {
    	
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
function hideSettingScene () {
	
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
sdwireless.sdw_onmbit_string(function (radioMsg) {
    gotData(radioMsg)
})
function initSettingScene () {
    if (curSettingIndex == -1) {
        settingTextSprs = []
        for (let index = 0; index <= settingNames.length - -1; index++) {
            settingTextSpr = textsprite.create(settingNames[index])
            settingTextSprs[index] = settingTextSpr
            settingTextSpr.setPosition(10, index * 30 + 20)
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
let strValues: string[] = []
let settingTextSpr: TextSprite = null
let settingTextSprs: TextSprite[] = []
let lastTs: number[] = []
let lastValues: number[] = []
let values: number[] = []
let t = 0
let settingNames: string[] = []
let curSettingIndex = 0
let mode = 0
let colors: number[] = []
let picture: Image = null
let sim = true
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
settingNames = ["a", "b", "c"]
let settingDefaults = [0, 1, 0]
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
