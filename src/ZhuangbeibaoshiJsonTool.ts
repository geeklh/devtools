import * as path from 'path';
import * as fs from 'fs';


let zhuangbeibaoshiJsonPath = '../../sanguo/resource/2d/config/forge/zhuangbeibaoshi.json';
let jsonContent = fs.readFileSync(zhuangbeibaoshiJsonPath, 'utf-8');
let jsonData = JSON.parse(jsonContent);

let sheetJsData = jsonData.SheetJS;

for (let key in sheetJsData) {

    let posResult: {
        [key: string]: any[]
    } = {};

    //便利从 pos0 到pos9 的所有string数组
    for (let i = 0; i < 10; i++) {
        let datas: string[] = sheetJsData[key][`pos${i}`];
        // datas类型为
        // [
        //     "102:9708",
        //     "102:18538",
        //     "102:23290"
        //   ]

        let result: any = {};
        for (let str of datas) {
            let arr = str.split(':');
            let posKey = arr[0]; // 103
            let posValue = arr[1]; ///103 对应的值
            if (!result[posKey]) {
                result[posKey] = [];
            }
            result[posKey].push(posValue);
        }
        posResult[`pos${i}`] = result;
    }

    for (let posKey in posResult) {
        sheetJsData[key][posKey] = posResult[posKey];
    }
}


let resultStr = JSON.stringify(jsonData);

fs.writeFileSync("./result111.json", resultStr);



