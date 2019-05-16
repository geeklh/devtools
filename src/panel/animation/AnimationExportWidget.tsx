import React from "react";
import { Button, Card } from 'antd';
import { animationData } from "./AnimationData";
export class AnimationExportWidget extends React.Component {

    render() {
        return (
            <Card title="导出">
                <Button onClick={() => { animationData.save() }}>保存配置文件</Button>
                <Button onClick={() => {
                    animationData.exportTestFrame();
                }}>

                    导出测试序列帧文件
                </Button>

            </Card>
        )
    }
}