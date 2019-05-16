import { Button, Card, Input, Menu, Modal } from 'antd';
import { observer } from 'mobx-react';
import React from "react";
import { Texture } from "../../Utils";
import { animationViewModel } from "./AnimationViewModel";

@observer
export class AnimationFrameDetailWidget extends React.Component<any, { inputText: string }> {

    input: any;

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
    }


    private onKeyDown = (event: KeyboardEvent) => {
        console.log(event.keyCode)
        switch (event.keyCode) {
            case 80://p
                animationViewModel.removeAndUsePreviewFrame()
                break;
        }
    }


    getInputValue() {
        const inpVal = this.input.input.value;
        const current = animationViewModel.currentFrame;
        current.frameName = inpVal;
        this.input.input.value = "";
        if (this.input.state) {
            this.input.setState({ value: "" });
        }
        const texture = animationViewModel.currentFrame;
    }


    private scaleInput: any;
    getScaleInputValue() {
        const inpVal = this.scaleInput.input.value;
        let model = animationViewModel.model;
        model.scale = parseFloat(inpVal);
        // this.scaleInput.input.value = "";
        // if (this.scaleInput.state) {
        //     this.scaleInput.setState({ value: "" });
        // }
    }

    render() {
        const texture = animationViewModel.currentFrame;

        const menuItems = animationViewModel.model.resources.map(item => {
            return <Menu.Item key={item.name}>{item.name}</Menu.Item>
        })

        const menu = (
            <Menu onClick={(e) => {
                console.info('Click on left button.');
                console.log('click left button', e);
            }}>
                {menuItems}
            </Menu>
        );


        if (!texture) {
            return (
                <Card
                    title="当前帧"
                // extra={<a href="#">More</a>}
                >

                    <p>空</p>
                </Card>
            )
        }

        const current = animationViewModel.currentFrame;


        return (
            <div>
                <Card
                    title={`${texture.textureName}`}
                // extra={<a href="#">More</a>}
                >
                    <Button onClick={() => {
                        animationViewModel.removeAndUsePreviewFrame()
                    }}

                        disabled={animationViewModel.currentIndex === 0}

                    >使用上一帧</Button><br /><br />
                    <Button onClick={() => {
                        let index = -1;
                        const content = <SelectResourcePanel onSelect={(i) => {
                            index = i;
                        }} />
                        Modal.info({
                            width: 1200,
                            title: "请选择一张图片",
                            content,
                            onOk: () => {
                                if (index >= 0) {
                                    animationViewModel.useFrame(index);
                                }
                            }
                        })


                    }}>使用指定帧</Button><br /><br />
                    <p></p>
                    <Input
                        addonBefore="帧标签: "
                        type="text"
                        ref={input => this.input = input}
                        placeholder={current.frameName}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                        onBlur={() => this.getInputValue()}
                    >
                    </Input>
                    <Input
                        addonBefore="缩放 "
                        type="text"
                        ref={input => this.scaleInput = input}
                        placeholder={"1"}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                        onBlur={() => this.getScaleInputValue()}
                    >
                    </Input>
                </Card>
            </div>
        )
    }
}


class SelectResourcePanel extends React.Component<{ onSelect: (index: number) => void }, { selectedItem: Texture }> {


    constructor(props, state) {
        super(props, state);
        this.state = { selectedItem: null };
    }

    render() {
        return (
            <div style={{ display: 'inline-flex' }}>
                <div style={{ height: 700, width: 630, overflowY: 'auto' }}>
                    {animationViewModel.model.resources.map((item, index) =>
                        <ResourceItemRenderer item={item} index={index} onClick={() => {
                            this.props.onSelect(index);
                            this.setState({ selectedItem: item })
                        }}
                        />
                    )}
                </div>
                <div style={{ height: 300, width: 300, overflowY: "auto", margin: "170px 0 0 70px" }}>
                    <p>当前动画名称:{this.state.selectedItem ? this.state.selectedItem.name : ""}</p>
                    <img
                        style={{ width: 300, height: 300 }}
                        src={this.state.selectedItem ? this.state.selectedItem.bitmapData.src : ""}
                    ></img>

                </div>
            </div>
        )
    }
}

class ResourceItemRenderer extends React.Component<{ item: Texture, index: number, onClick: () => void }> {
    render() {
        return (
            <div style={{ float: "left", marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderStyle: "solid" }} onClick={() => {
                this.props.onClick();
            }}>
                <a href="#">  {this.props.item.name}</a>
            </div>
        )
    }
}