import React from "react";
import { Button, Card, Modal } from 'antd';
import { animationViewModel } from "./AnimationViewModel";
import { title } from "process";
import { SpriteSheetPanel } from "../../spritesheet/SpriteSheetPanel";
export class AnimationExportWidget extends React.Component {

    render() {
        return (
            <Card title="导出">
                <Button onClick={() => { animationViewModel.model.save() }}>保存配置文件</Button>
                <Button onClick={() => {
                    animationViewModel.model.exportTestFrame();
                }}>
                    导出测试序列帧文件
                </Button>
                <Button onClick={() => {
                    Modal.info({ title: "发布面板", content: <SpriteSheetPanel /> })
                }}>
                    发布
                </Button>

            </Card>
        )
    }
}