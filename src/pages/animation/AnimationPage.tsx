import { Breadcrumb, Button, Card, Col, Modal, Row } from 'antd';
import * as React from 'react';
import { FileSystemTree } from '../../project/FileSystemTree';
import { AnimationAnchorWidget } from './AnimationAnchorWidget';
import { AnimationExportWidget } from './AnimationExportWidget';
import { AnimationFrameDetailWidget } from './AnimationFrameDetailWidget';
import { AnimationPreviewWidget } from './AnimationPreviewWidget';
import { AnimationProfilerPanel } from './AnimationProfilerPanel';
import { AnimationRenameInfo, AnimationRenamePanel } from './AnimationRenamePanel';
import { animationViewModel } from './AnimationViewModel';
import { shell } from 'electron';
import { appSettings } from '../settings/Settings';
export default class AnimationPage extends React.Component {

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
    }


    private onKeyDown = (event: KeyboardEvent) => {
        console.log(event.keyCode)
        switch (event.keyCode) {
            case 37://left
                animationViewModel.previousFrame()
                break;
            case 38://up
                break;
            case 39://right
                animationViewModel.nextFrame()
                break;
            case 40://down
                break;
            case 192://`
                if (animationViewModel.isPlaying) {
                    animationViewModel.stop();
                }
                else {
                    animationViewModel.play()
                }
                break;
        }
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown)
    }

    render() {

        const rename = () => {
            let exp: AnimationRenameInfo[]
            Modal.info({
                title: "重命名",
                content: <AnimationRenamePanel onChange={(e) => {
                    exp = e;
                }}
                />,
                onOk: () => {
                    animationViewModel.model.rename(exp);
                }
            });

        };

        const buttons = [
            { name: "设置中心点", onClick: () => Modal.info({ title: "设置中心点", width: document.body.clientWidth, content: <AnimationAnchorWidget /> }) },
            { name: "播放下一帧", onClick: () => animationViewModel.nextFrame() },
            { name: "播放", onClick: () => animationViewModel.play() },
            { name: "停止", onClick: () => animationViewModel.stop() },
            {
                name: "重命名", onClick: rename
            }
        ]

        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>动画面板</Breadcrumb.Item>

                </Breadcrumb>
                <Row>
                    {buttons.map((item) => <Button onClick={item.onClick} key={item.name}>{item.name}</Button>)}
                </Row>
                <Row type="flex">
                    <Col span={8}>
                        <FileSystemTree root="三国资源整理/Z-战斗场景/程序用战斗模型mc汇总/武将源文件"
                            onSelected={(dirname) => {
                                animationViewModel.selectedDirname = dirname;
                                animationViewModel.init(dirname)
                            }}
                        />
                        <Card style={{ width: 340 }} title="文件夹设置">
                            <Button>创建新动画</Button>
                            <Button onClick={() => {
                                animationViewModel.createActionAnimation();
                            }}>创建多动作动画</Button>
                            <Button onClick={() => {
                                animationViewModel.copyAll();
                            }}>拷贝全部动画</Button>
                            <Button onClick={() => {
                                animationViewModel.openFolder();
                            }}>打开当前文件夹</Button>
                            <Button onClick={() => {
                                animationViewModel.release2();
                            }}>
                                导出
                            </Button>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <AnimationPreviewWidget />
                    </Col>
                    <Col span={4}>
                        <AnimationFrameDetailWidget />
                        <AnimationProfilerPanel />
                        <AnimationExportWidget />
                    </Col>
                </Row>
            </div>
        )
    }
}