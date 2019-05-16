import { Breadcrumb, Button, Col, Modal, Row, Form, Input, Card, Icon , Progress } from 'antd';
import * as React from 'react';
import { mapeditData } from './MapEditData';
import { MapEditPreview } from './MapEditPreview';
import { MapEditExportWidget } from './MapEditExportWidget';
import { MapEditDetailWidget } from './MapEditDetailWidget'
import { MapEditZoomControl } from './MapEditZoomControl';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 }
};
@observer
export default class MapEditPage extends React.Component {
    input: any;
    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
    }


    private onKeyDown = (event: KeyboardEvent) => {
        console.log(event.keyCode)
        switch (event.keyCode) {
            case 13://enter
                mapeditData.canvas_control()
                break;
        }
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown)
    }
    render() {
        const title = (<span style={{ display: "-webkit-inline-box" }} >参数添加: <Icon onClick={() => {
            Modal.info({
                title: "使用说明",
                content: [
                    "填写宽高参数才能进行下一步操作,默认的宽高是3900，您可以选择直接按下 enter  "
                ].map(item => <p>{item}</p>)
            })
        }} type="question-circle" />
        </span>)
        if (mapeditData.canvas_switch == 1) {
            return (
                <Card
                    title={title}
                >
                    <div style={{ display: "flex" }}>
                        <Form.Item {...formItemLayout}>
                            <Input
                                addonBefore="width: "
                                type="text"
                                placeholder='dafault_value : 3900 '
                                ref={input => mapeditData.can_width = input}
                                style={{ width: 300, display: 'block', marginRight: 10 }}
                            >
                            </Input>
                        </Form.Item>
                        <Form.Item {...formItemLayout}>
                            <Input
                                addonBefore="height: "
                                type="text"
                                ref={input => mapeditData.can_height = input}
                                placeholder="dafault_value : 3900 "
                                style={{ width: 300, display: 'block', marginRight: 10 }}
                            >
                            </Input>
                        </Form.Item>
                        <Button type="primary"
                            onClick={() =>
                                mapeditData.canvas_control()
                            }
                        >确定
                 </Button>
                    </div>
                </Card>
            )
        }
        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0', display: "flex" }}>
                    <Breadcrumb.Item>地图编辑</Breadcrumb.Item>
                    <p>当前定义画布属性：宽：{mapeditData.canvas_width} (像素) ， 高:{mapeditData.canvas_height} (像素)</p>
                </Breadcrumb>
                <Row type="flex">
                    <Col span={18}>
                        <MapEditPreview />
                    </Col>
                    <Col span={6}>
                        <MapEditDetailWidget />
                        <MapEditZoomControl />
                        <MapEditExportWidget />
                    </Col>
                </Row>
            </div>
        )
    }
}