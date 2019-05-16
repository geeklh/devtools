import { Breadcrumb, Button, Modal, Progress } from 'antd';
import * as React from 'react';
import { checkImage } from '../../ImageProcessor';
import { selectDir } from '../../Utils';
import { appSettings } from './Settings';

export default class SettingPanel extends React.Component {

    render() {
        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                </Breadcrumb>
                {/* <ImageCheckWidget /> */}
                <ClearCacheWidget />
            </div >
        )
    }
}

class ClearCacheWidget extends React.Component {

    render() {
        return (
            <Button onClick={() => {
                appSettings.clear();
                Modal.info({
                    title: "清除成功", content: "重启生效", onOk: () => {
                        process.exit();
                    }
                })
            }}>清除缓存</Button>
        )
    }
}

class ImageCheckWidget extends React.Component<any, { current: number, total: number }> {


    constructor(props, state) {
        super(props, state);
        this.state = { current: 0, total: 0 };
    }


    async onClick() {
        const dir = await selectDir();
        if (dir) {
            const result = await checkImage(dir, (current, total) => {
                this.setState({ current, total })
            });
            const message = result.length == 0
                ? "符合规范"
                : (
                    <div>
                        <p>以下内容不符合规范:</p>
                        {result.map(item => <p>{item}</p>)})
                        </div>
                )
            Modal.info({
                title: "报告结果",
                content: message
            })
        }
    }

    render() {
        const percent = Math.floor((this.state.current / this.state.total * 100))
        return <div> <Progress type="dashboard" percent={percent} />
            <div>
                <Button onClick={() => this.onClick()}>
                    检测图片尺寸是否等于90*90
            </Button>
            </div ></div>
    }

}