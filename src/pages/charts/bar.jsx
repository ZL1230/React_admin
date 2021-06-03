import React, { Component } from 'react'
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react'
export default class Bar extends Component {
    state={
        sales:[5, 20, 36, 10, 10, 20],//销量的数据
        stores:[2,4,7,10,20,4]  //库存的数据
    }
    //更新数据
    update=()=>{
        this.setState((state)=>({
            sales:state.sales.map((item)=>{
                return item+1
            }),
            // stores:state.stores.map((store)=>{
            //     return store+1
            // })
            stores:state.stores.reduce((pre,store)=>{
                pre.push(store-1)
                return pre
            },[])
        }))
    }
    getOption=(sales,stores)=>{
        // 返回柱状图的配置对象
        return  {
            title: {
                text: '商品管理'
            },
            tooltip: {},
            legend: {
                data:['已售','库存']
            },
            xAxis: {
                data: ["家用电机","手机","洗衣机","图书","服装","玩具"]
            },
            yAxis: {},
            series: [{
                name: '已售',
                type: 'bar',
                data:sales
            },{
                name:'库存',
                type:'bar',
                data:stores
            }]
        };
    }
    render() {
        const {sales,stores}=this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='柱状图一'>
                    <ReactEcharts option={this.getOption(sales,stores)}></ReactEcharts>
                </Card>
            </div>
        )
    }
}
