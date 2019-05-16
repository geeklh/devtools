import { Button, Card, Menu, Modal, Input } from 'antd';
import { observer } from 'mobx-react';
import React from "react";
import { Texture } from "../../Utils";
import { animationData } from "./AnimationData";

@observer
export class AnimationFrameDetailWidget extends React.Component<any, { inputText: string }> {

    input: any;


    getInputValue() {
        const inpVal = this.input.input.value;
        const current = animationData.currentFrame;
        current.frameName = inpVal;
        this.input.input.value = "";
        if (this.input.state) {
            this.input.setState({ value: "" });
        }
    }

    render() {
        const texture = animationData.currentFrame;

        const menuItems = animationData.resources.map(item => {
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

        const current = animationData.currentFrame;


        return (
            <div>
                <Card
                    title={`${texture.textureName}`}
                // extra={<a href="#">More</a>}
                >
                    <Button onClick={() => {
                        animationData.removeAndUsePreviewFrame()
                    }}

                        disabled={animationData.currentIndex === 0}

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
                                    animationData.useFrame(index);
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
                </Card>
            </div>
        )
    }
}


class SelectResourcePanel extends React.Component<{ onSelect: (index: number) => void }> {

    render() {
        const imSrc = animationData.imageSrc;
        console.log(imSrc,"检测数据情况")
        return (
        <div>
            <div>
                {animationData.resources.map((item, index) =>
                    <ResourceItemRenderer item={item} index={index} onClick={() => {
                        this.props.onSelect(index);
                        // 现在存在的问题就是下面这个值只是在这里面可以打印出来，出了这个函数就会报错
                        console.log(item.bitmapData.src)
                    }}
                    />
                )}
            </div>
            <div>
            <img
                src={imSrc.bitmapData.src}
            >
            </img>
            </div>
        </div>
        
        )
    }
}

class ResourceItemRenderer extends React.Component<{ item: Texture, index: number, onClick: () => void }> {
    render() {
        return (
            <div style={{width:580}}>
                <div style={{ float: "left", margin: 10, borderStyle: "solid" }}>
                    {/* <img
                        style={{ width: 150, height: 150 }}
                        src={this.props.item.bitmapData.src}
                        onClick={() => {
                            this.props.onClick();
                        }}
                    >
                    </img> */}
                    <p>{this.props.item.name}</p>
                </div>
            </div>
            
        )
    }
}