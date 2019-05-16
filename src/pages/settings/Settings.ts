import { selectDir } from '../../Utils';
import * as fs from 'fs';
import * as path from 'path';
export class Settings {

    constructor() {
        const filename = path.join(getAppDataPath(), "settings.json")
        if (!fs.existsSync(filename)) {
            this.settings = {};
        }
        else {
            const text = fs.readFileSync(filename, 'utf-8');
            this.settings = JSON.parse(text);
        }

    }

    private settings = {};

    get(key: string) {
        return this.settings[key];
    }

    set(key: string, value: string) {
        this.settings[key] = value;
        const appData = getAppDataPath();
        const file = path.join(appData, 'settings.json');
        fs.writeFileSync(file, JSON.stringify(this.settings, null, '  '));
    }

    async setFolder(key: string) {
        const dirname = await selectDir();
        if (dirname) {
            this.set(key, dirname);
        }
    }

    clear() {
        this.settings = {};
        const appData = getAppDataPath();
        const file = path.join(appData, 'settings.json');
        fs.writeFileSync(file, JSON.stringify(this.settings, null, '  '));
    }
}


function getAppDataPath() {
    var result: string;
    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return null;
            result = `${home}/Library/Application Support/`;
            break;
        case 'win32':
            var appdata = process.env.AppData || `${process.env.USERPROFILE}/AppData/Roaming/`;
            result = appdata;
            break;
        default:
            ;
    }
    result = result + 'assets/';
    console.log('配置文件路径', result)
    if (!fs.existsSync(result)) {
        fs.mkdirSync(result);
    }

    return result;
}


export const appSettings = new Settings();