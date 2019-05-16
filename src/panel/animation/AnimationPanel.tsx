import { Button, Row, Col, Breadcrumb } from 'antd';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { selectDir } from '../../Utils';
import { animationData } from './AnimationData';
import { AnimationPreviewWidget } from './AnimationPreviewWidget';
import { AnimationFrameWidget } from './AnimationFrameWidget';
import { AnimationFrameDetailWidget } from './AnimationFrameDetailWidget';
import { AnimationProfilerPanel } from './AnimationProfilerPanel';
import { AnimationExportWidget } from './AnimationExportWidget';
export class AnimationPanel extends React.Component {


    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown)
    }


    private onKeyDown = (event: KeyboardEvent) => {
        console.log(event.keyCode)
        switch (event.keyCode) {
            case 37://left
                animationData.previousFrame()
                break;
            case 38://up
                break;
            case 39://right
                animationData.nextFrame()
                break;
            case 40://down
                break;
            case 192://`
                if (animationData.isPlaying) {
                    animationData.stop();
                }
                else {
                    animationData.play()
                }
                break;
        }
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown)
    }

    async onClick() {
        const dir = await selectDir();
        const files = fs.readdirSync(dir).map(item => path.join(dir, item)).filter((item) => item.indexOf('.png') >= 0)
        await animationData.init(files, dir);
    }

    async checkMove() {
        animationData.nextFrame();
    }

    render() {
        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>动画面板</Breadcrumb.Item>

                </Breadcrumb>
                <Row>
                    <Button onClick={() => {
                        this.onClick();
                    }}>选择资源</Button>
                    <Button onClick={() => {
                        this.checkMove();
                    }}>播放下一帧</Button>
                    <Button onClick={() => {
                        animationData.play();
                    }}>播放</Button>
                    <Button onClick={() => {
                        animationData.stop();
                    }}>停止</Button>
                    <Button onClick={() => {
                        animationData.openFolder();
                    }}>
                        打开文件夹
                        </Button>
                </Row>
                <Row type="flex">
                    <Col span={18}>
                        <AnimationPreviewWidget />
                        <AnimationFrameWidget />
                    </Col>
                    <Col span={6}>
                        <AnimationFrameDetailWidget />
                        <AnimationProfilerPanel />
                        <AnimationExportWidget />
                    </Col>
                </Row>
            </div>
        )
    }
}