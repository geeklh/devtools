import { Button, Card, Modal, Input , Icon } from 'antd';
import { observer } from 'mobx-react';
import React from "react";
import { Texture } from "../../Utils";
import { mapeditData } from "./MapEditData";
import { MapEditAddListWidget } from "./MapEditAddListWidget"
import { MapEditCoordinateWidget } from "./MapEditCoordinateWidget"

@observer
export class MapEditDetailWidget extends React.Component<any, { inputText: string }> {

    render() {
        const title = (<span style={{ display: "-webkit-inline-box" }} >位点设置: <Icon onClick={() => {
            Modal.info({
                title: "使用说明",
                content: [
                    "需要载入资源才能进行下一步操作"
                ].map(item => <p>{item}</p>)
            })
        }} type="question-circle" />
        </span>)
        if (!mapeditData.texture) {
            return (
                <Card
                    title={title}
                >

                    <p>空</p>
                </Card>
            )
        }
        return (
            <Card title={title}>
            <MapEditAddListWidget />
            <MapEditCoordinateWidget />
            </Card>
        )
    }
}
