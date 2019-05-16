import React from "react";
import { Table, InputNumber } from 'antd';
import { animationViewModel } from "./AnimationViewModel";

type TableColumnProps<T> = Table<T>['columns'];
const columns: TableColumnProps<AnimationRenameInfo> = [{
    title: "from",
    dataIndex: 'from' as 'from',
    width: 100,
}, {
    title: 'to',
    dataIndex: 'to' as 'to',
    width: 150,
},
];

export type AnimationRenameInfo = {
    from: string,
    to: string
}


export class AnimationRenamePanel extends React.Component<{ onChange: (exp: AnimationRenameInfo[]) => void }, { first: number }> {

    constructor(props, state) {
        super(props, state);
        this.state = { first: 0 }
    }

    private getItem() {
        const resources = animationViewModel.model.resources;

        const items = resources.map((r, index) => {
            const from = r.name;
            let to = (index + this.state.first).toString();
            while (to.length < 6) {
                to = "0" + to;
            }
            to += ".png";
            return { from, to }
        })
        return items;
    }

    render() {

        const items = this.getItem();

        return (
            <div>
                <InputNumber onChange={(e: number) => {
                    this.setState({ first: e });
                    this.props.onChange(items);
                }} />
                <Table columns={columns} dataSource={items} />
            </div>
        )
    }
}
