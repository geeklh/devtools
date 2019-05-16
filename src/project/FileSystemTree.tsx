import { Card, TreeSelect } from 'antd';
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { appSettings } from '../pages/settings/Settings';

export class FileSystemTree extends React.Component<{ root: string, onSelected: (value: string) => void }, { value: string, treeData: FileSystemData }> {

    constructor(props, state) {
        super(props, state);
        this.state = { value: "", treeData: getTreeData() };
    }

    onChange = (value) => {
        // console.log(value);
        this.setState({ value });
        this.props.onSelected(value);
    }

    render() {
        const paths = this.props.root.split("/");
        let treeData = this.state.treeData;
        while (paths.length > 0) {
            const p = paths.shift();
            treeData = treeData.children.find(item => item.title === p);
        }

        return (
            <Card style={{ width: 340 }} title="文件系统" extra={<a href="#" onClick={() => {
                const treeData = getTreeData();
                this.setState({ treeData })
            }}>刷新</a>}>
                <p>当前路径</p>
                <p>{this.props.root}</p>
                <TreeSelect
                    style={{ width: 300 }}
                    value={this.state.value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData.children}
                    placeholder="Please select"
                    onChange={this.onChange}
                />
            </Card>
        );
    }
}

function getTreeData_1() {
    function visitDir(dirname: string, data: FileSystemData) {
        const files = fs.readdirSync(dirname);
        for (let file of files) {
            if (file.indexOf(".") == 0) {
                continue;
            }
            const fullname = path.join(dirname, file);
            const value = fullname.replace(projectRoot, "").split("\\").join("/");
            const stat = fs.statSync(fullname);

            if (stat.isDirectory()) {
                const item: FileSystemData = {
                    title: file,
                    value: value,
                    key: value,
                    children: []
                };
                data.children.push(item);
                visitDir(fullname, item);
            }
            else if (stat.isFile()) {

                const item: FileSystemData = {
                    title: file,
                    key: fullname,
                    value: fullname,
                    children: []
                };
                data.children.push(item);
            }
        }
    }

    let projectRoot = appSettings.get("project.root");
    const data: FileSystemData = { title: "", key: projectRoot, value: projectRoot, children: [] }
    visitDir(projectRoot, data);
    return data;
}

function getTreeData() {

    // function visitDir(data: FileSystemData) {
    //     for (let file of data.children) {
    //         if (stat.isDirectory()) {
    //             const item: FileSystemData = {
    //                 title: file,
    //                 value: value,
    //                 key: value,
    //                 children: []
    //             };
    //             data.children.push(item);
    //             visitDir(fullname, item);
    //         }
    //         else if (stat.isFile()) {

    //             const item: FileSystemData = {
    //                 title: file,
    //                 key: fullname,
    //                 value: fullname,
    //                 children: []
    //             };
    //             data.children.push(item);
    //         }
    //     }
    // }
    return getTreeData_1();
}


export type FileSystemData = {

    title: string;
    value: string;
    key: string;
    children: FileSystemData[]
}

