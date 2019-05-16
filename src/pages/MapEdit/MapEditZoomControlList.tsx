import { Button, Modal, Input, Icon, Popconfirm, Form } from 'antd';
import { observer } from 'mobx-react';
import React from "react";
import { Texture } from "../../Utils";
import { mapeditData } from "./MapEditData";
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 }
};
@observer
export class MapEditZoomControlList extends React.Component<any, { inputText: string }> {
    input: any;
    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
    }
    private onKeyDown = (event: KeyboardEvent) => {
        console.log(event.keyCode)
        switch (event.keyCode) {
            case 13://enter
                mapeditData.changeSize();
                break;
        }
    }
    render() {
        return (
            <div>
                <div style={{ display: "flex" }}>
                    <Form.Item {...formItemLayout}>
                        <Input
                            id="zoomcontrol"
                            type="text"
                            placeholder='输入倍数'
                            ref={input => this.input = input}
                            style={{ width: 188, marginRight: 10, display: 'block' }}
                        >
                        </Input>
                    </Form.Item>
                    <Button onClick={() => {
                        mapeditData.changeSize()
                    }}>
                        放大/缩小
                    </Button>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                    <Button style={{ marginRight: 10 }} onClick={() => {
                        mapeditData.area_change()
                    }}>
                        区域规划
                </Button>
                    <Button style={{ marginRight: 10 }} onClick={() => {
                        mapeditData.area_steptchange()
                    }}>
                        设置步点区域
                </Button>
                    <Button style={{ marginRight: 10 }} onClick={() => {
                        mapeditData.area_unchange()
                    }}>
                        反选区域
                </Button>
                </div>
                <p style={{ fontSize: 20 }}>{mapeditData.area_world}</p>
            </div>
        )
    }
}