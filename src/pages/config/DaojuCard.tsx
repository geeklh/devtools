import { Button, Icon, Input, Table } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import Highlighter from 'react-highlight-words';
import { DaojuConfig } from '../../../../sanguo/src/config/item/DaojuConfig';
import { TEXTCOLOR } from '../../../../sanguo/src/view/common/TextColor';
import { store } from '../Store';




@observer
export class DaojuCard extends React.Component {

    state = {
        searchText: ''
    };

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    searchInput: any;

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
        </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
        </Button>
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })

    render() {

        const columns = daojuColumn.map(item => {
            if (item.dataIndex === 'id') {
                return Object.assign({}, item, this.getColumnSearchProps("id"))
            }
            else if (item.dataIndex === 'name') {
                return Object.assign({}, item, this.getColumnSearchProps("name"))
            }
            else {
                return item;
            }
        });



        return (
            <Table columns={columns} dataSource={store.daoju.map(data => {
                data['key'] = data.id;
                return data;
            })} />
        )
    }
}




type TableColumnProps<T> = Table<T>['columns'];

const daojuColumn: TableColumnProps<DaojuConfig> = [{
    title: "ID",
    dataIndex: 'id' as 'id',
    width: 100,
}, {
    title: '名称',
    dataIndex: 'name' as 'name',
    width: 150,
}, {
    title: '描述',
    dataIndex: 'comment' as 'comment',
    width: 200
}, {
    title: '品质',
    dataIndex: 'quality' as 'quality',
    render(text) {
        const color = "#" + TEXTCOLOR[text].toString(16)
        // const
        return (<div style={{ backgroundColor: color, width: 30, height: 30 }}>
            {/* <span style={{ color: "white" }}>{text}</span> */}
        </div >)
    }
},
{
    title: "图标",
    dataIndex: 'icon' as 'icon',
    render(text) {
        return <img src={`${store.urlRoot}/2d/assets/image/icon/item/item${text}.png`}></img>
    }
}
];

