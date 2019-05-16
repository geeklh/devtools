import React from "react";
import { observer } from 'mobx-react';
import { Button, Card, Modal , Icon } from 'antd';
import { mapeditData } from "./MapEditData";
import { MapEditZoomControlList} from "./MapEditZoomControlList"

@observer
export class MapEditZoomControl extends React.Component {


    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
    }
    private onKeyDown = (event: KeyboardEvent) => {
        console.log(event.keyCode)
        switch (event.keyCode) {
            case 37://left
                break;
            case 38://up
                break;
            case 39://right
                break;
            case 40://down
                break;
            case 192://`
                break;
        }
    }


    render() {
        const title = (<span style={{ display: "-webkit-inline-box" }} >缩放控制: <Icon onClick={() => {
            Modal.info({
                title: "使用说明",
                content: [
                    "内容区域"
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
            <MapEditZoomControlList />
            </Card>
        )
    }
}