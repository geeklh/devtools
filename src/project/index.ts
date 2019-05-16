import cors from 'koa2-cors';
import { Modal } from 'antd';
import * as fs from 'fs';
import Koa from 'koa';
import s from 'koa-static';
import * as path from 'path';
import { appSettings } from '../pages/settings/Settings';
import { selectDir } from '../Utils';


export async function runStaticServer() {
    let dirname = appSettings.get("project.root")
    if (!dirname) {
        const dirname = await selectDir();
        if (!dirname) {
            return;
        }
        if (!fs.existsSync(path.join(dirname, ".svn"))) {
            Modal.error({
                "title": '错误', content: "当前文件夹不是项目文件夹,请选择SVN根目录", onOk: () => {
                    runStaticServer();
                }
            });
            return;
        }
        appSettings.set("project.root", dirname);
    }

    const app = new Koa();
    app.use(s(dirname, {}));
    app.use(cors({
        origin: function (ctx) {
            return "*"; // 允许来自所有域名请求
        },
        // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        // maxAge: 5,
        // credentials: true,
        // allowMethods: ['GET', 'POST', 'DELETE'],
        // allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }));
    app.listen(50000);
}