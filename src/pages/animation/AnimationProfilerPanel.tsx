import { Card, Icon, Modal, Progress } from 'antd';
import { observer } from 'mobx-react';
import React from "react";
import { animationViewModel } from './AnimationViewModel';

@observer
export class AnimationProfilerPanel extends React.Component {

    render() {
        // 总数
        const total = animationViewModel.model.resources.length;
        const used = animationViewModel.textureUsed;

        const percent = Math.floor((used / total * 100))
        const title = (<span style={{ display: "-webkit-inline-box" }} >内存报告: <Icon onClick={() => {
            Modal.info({
                title: "使用说明",
                content: [
                    "这个数值越低越好"
                ].map(item => <p>{item}</p>)
            })
        }} type="question-circle" />
        </span>)
        return (
            <Card
                title={title}
            // extra={<a href="#">More</a>}
            // actions={[<Icon type="question-circle" />]}
            >
                <Progress type="dashboard" percent={percent} />
                <p>使用帧:{used}</p>
                <p>总共帧:{total}</p>
            </Card>
        )
    }
}