import { Menu, Dropdown, Button } from 'antd';
import { autorun } from 'mobx';
import React from "react";
import { CanvasView } from '../canvas/CanvasView';
import { AnimationRendererBehaviour } from '../canvas/PreviewBehaviour';
import { AnimationFrameWidget } from "./AnimationFrameWidget";
import { animationViewModel } from "./AnimationViewModel";
import { observer } from 'mobx-react';

export class AnimationPreviewWidget extends React.Component {

    render() {

        return (
            <div> <CanvasView width={400} height={400} onInit={(canvas) => {
                const behaviour = new AnimationRendererBehaviour()
                canvas.addBehaviour(behaviour);
                behaviour.offsetX = behaviour.offsetY = 200;
                autorun(() => {
                    behaviour.model = animationViewModel.model;
                    behaviour.index = 0;

                })
            }}></CanvasView>
                <AnimationActionWidget />
                <AnimationFrameWidget />
            </div>
        )
    }
}
@observer
class AnimationActionWidget extends React.Component {

    render() {

        const menuData = animationViewModel.actionAnimationModel.actionList

        const items = menuData.map((item, index) => {
            const key = `${item}`;
            return (

                <Menu.Item key={key}>
                    <a href="#">{key}</a>
                </Menu.Item>
            )
        });

        const menu = (
            <Menu onClick={(v) => {
                const actionName = v.key;
                const model = animationViewModel.actionAnimationModel.models.get(actionName);
                animationViewModel.model = model;
            }}>
                {items}
            </Menu>
        );

        return (
            <div>
                <Dropdown overlay={menu} placement="bottomLeft">
                    <Button>当前动作</Button>
                </Dropdown>
            </div>
        )
    }
}