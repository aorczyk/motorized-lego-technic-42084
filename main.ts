let latestCommands: { [key: string]: number } = {}
let mode = 1;

basic.clearScreen()

bluetooth.startUartService()

bluetooth.onBluetoothConnected(function () {
})

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let command = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    let commadParts = command.split("=")

    latestCommands[commadParts[0]] = parseFloat(commadParts[1])
})

basic.forever(function () {
    while (Object.keys(latestCommands).length) {
        let commandName = Object.keys(latestCommands)[0]
        let commandValue = latestCommands[commandName]
        delete latestCommands[commandName];

        if (commandName == "-v") {
            bluetooth.uartWriteLine('vc;import_start;')
            bluetooth.uartWriteLine('vc;init;')
            bluetooth.uartWriteLine('vc;sl;1;-100;100;1;1;0;1;;')
            bluetooth.uartWriteLine('vc;jry;-100;100;1;0;0;')
            bluetooth.uartWriteLine('vc;b;Digit1;1;0;<i class="fa-solid fa-volume-high"></i>;')
            bluetooth.uartWriteLine('vc;b;Digit2;0;0;2;')
            bluetooth.uartWriteLine('vc;b;Digit4;0;0;4;')
            bluetooth.uartWriteLine('vc;oy;0;-30;30;-100;100;10;0;0;')
            bluetooth.uartWriteLine('vc;il;1;')
            bluetooth.uartWriteLine('vc;ir;1;')
            bluetooth.uartWriteLine('vc;sr;1;-30;30;5;1;0;0;;')
            bluetooth.uartWriteLine('vc;ox;1;-30;30;-30;30;5;1;0;')
            bluetooth.uartWriteLine('vc;jrx;-30;30;5;1;0;')
            bluetooth.uartWriteLine('vc;show;sl,sr,jr,br;')
            bluetooth.uartWriteLine('vc;import_end;')
        } else if (commandName == "oy" || commandName == "sl" || commandName == "jry") {
            wuKong.setMotorSpeed(wuKong.MotorList.M1, commandValue)
        } else if (commandName == "ox" || commandName == "sr" || commandName == "jrx") {
            let value = commandValue + 180;
            if (value >= 150 && value <= 210) {
                wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S0, value)
            }
        } else if (commandName == "1") {
            music.playTone(250, 500)
        }
    }
})