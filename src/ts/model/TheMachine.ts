var exec = require('child_process').exec;

class TheMachine {
    actImg:string;

    constructor() {

    }

    watchAct() {
        if (this.actImg) {
            this.watch(this.actImg);
        }
    }

    watch(path:string) {
        path = path.replace("/", "\\");
        console.log(this, "watch:", path);
        exec('"C:\\Program Files\\CELSYS\\CLIP STUDIO\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe" ' + path, function (error, stdout, stderr) {
            if (stdout) {
                console.log('stdout: ' + stdout);
            }
            if (stderr) {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('Exec error: ' + error);
            }
        });
    }
}