import { Button, Modal, Input , Icon , Popconfirm , Form } from 'antd';
import { observer  } from 'mobx-react';
import React from "react";
import { Texture } from "../../Utils";
import { mapeditData } from "./MapEditData";
const formItemLayout  = {
    labelCol: { span : 4},
    wrapperCol: { span: 8}
};
@observer
export class MapEditAddListWidget extends React.Component<any, { inputText: string }> {
    input: any;
    render() {
        return (
            <div>
                <div style={{display:"flex"}}>
                    <Form.Item {...formItemLayout}>
                        <Input
                        id="inputX"
                        addonBefore="x: "
                        type="text"
                        placeholder='input x_value'
                        ref={input => this.input = input}
                        style={{ width: 188, display: 'block' }}
                        >
                        </Input>
                    </Form.Item>
                    <Form.Item {...formItemLayout}>
                        <Input
                        id="inputY"
                        addonBefore="y: "
                        type="text"
                        ref={input => this.input = input}
                        placeholder="input y_value"
                        style={{ width: 188, display: 'block' }}
                        >
                        </Input>
                    </Form.Item>
                </div>
                <Button type="primary" 
                 onClick={() =>
                    mapeditData.add()
                    }
                 >添加
                 </Button>
                <Popconfirm title="确认删除?" onConfirm={() => mapeditData.removeSelect()}>
                    <Button type="danger">删除选中</Button>
                </Popconfirm>
            </div>
        )
    }
}