import { Button, Form, Input, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { inject } from 'mmlpx';
import { observer } from 'mobx-react';
import React from "react";
import { PngData, PngGeneratorStore, printImage } from "./PngGeneratorStore";

@observer
class PngGeneratorPageForm extends React.Component<FormComponentProps> {


    @inject()
    store: PngGeneratorStore;

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                printImage(values)
                // console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;

        // Only show error after a field is touched.

        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator<PngData>('width', {
                        rules: [{ required: true, message: '请输入宽度' }],
                    })(
                        <InputNumber placeholder="请输入宽度" />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator<PngData>('height', {
                        rules: [{ required: true, message: '请输入高度' }],
                    })(
                        <InputNumber placeholder="请输入高度" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator<PngData>('label', {
                        rules: [{ required: true, message: '请输入标签' }],
                    })(
                        <Input placeholder="请输入标签" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                    >
                        提交
                </Button>
                </Form.Item>
            </Form>


        );


    }
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


export default Form.create()(PngGeneratorPageForm);
