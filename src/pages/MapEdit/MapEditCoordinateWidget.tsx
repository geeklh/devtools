import { Button, Modal, Input, Icon, Popconfirm, Table } from 'antd';
import { observer, Provider } from 'mobx-react';
import React, { Component } from "react";
import { Texture } from "../../Utils";
import { mapeditData, MapEditData } from "./MapEditData";
import { keys } from 'mobx';


const rowSelection = {
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
    }),
};
@observer
export class MapEditCoordinateWidget extends React.Component {
    columns = [{
        title: 'x_step',
        dataIndex: 'x',
        width: 50,
        editable: true,
    },
    {
        title: 'y_step',
        dataIndex: 'y',
        width: 50,
        editable: true
    },
    {
        title: 'operation',
        dataIndex: 'action',
        width: 50,
        render: (text, record) => {
            return (
                <Popconfirm title="确认删除？" onConfirm={() => mapeditData.remove(record)}>
                    <a>删除</a>
                </Popconfirm>
            )
        }

    }];


    render() {
        const rowSelection = {
            selectedRowKeys: mapeditData.selectedRowKeys,
            onChange: mapeditData.onSelectChange,
            // onChange(selectedRowKeys, selectedRows) {
            //     console.log(`selectedRowKeys: ${selectedRowKeys} `, 'selectedRows: ', selectedRows, mapeditData.onSelectChange, "页面查看数据");
            // }

        };
        return (
            <Table
                dataSource={mapeditData.stepPoint.slice()}
                columns={this.columns}
                rowSelection={rowSelection}
                pagination={false}
                size='small'
                style={{ overflowY: 'auto', overflowX: 'auto', height: 200, marginTop: 10 }}
            />
        )
    }
}