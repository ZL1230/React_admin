import React, { Component } from 'react'
import {Card,Select,Input,Button,Icon,Table, message} from 'antd'
import {reqProducts,reqSearchProducts,reqUpdateSataus} from '../../api/index'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
//Product的默认子路由组件
const Option=Select.Option
export default class ProductHome extends Component {
    state={
        products:[ ], //商品的数组
        total:0,  //总的数据条数
        loading:false,    //状态
        searchName:'',   //搜索的关键字
        searchType:'productName'    //根据哪个字段来搜索
    }
    //初始化列的方法
    initColumns=()=>{
        return this.columns=[
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              render:(product)=>
                    '￥'+ product.price    //当前指定了对应的属性 
            },
            {
                width:100,
                title: '状态',
                render:(product)=>{
                    const {status,_id}=product
                    const newStatus=status===1?2:1
                    return (
                        <span>
                            <Button onClick={()=>{this.updateStatus(_id,newStatus)}}
                             type='primary'>
                            {status===1?'下架':'上架'}</Button>
                            <span>{status===1?'在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title: '操作',
                render:(product)=>{
                    return (
                        <span>
                            {/* 将product对象 使用state传递给目标路由组件 */}
                            <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                            <LinkButton onClick={()=>{this.props.history.push('/product/addupdate',product)}}>修改</LinkButton>
                        </span>
                    )
                }
            }
          ]
    }
    //更新指定商品的状态
    updateStatus=async(productId,status)=>{
        const result=await reqUpdateSataus(productId,status)
       if(result.status===0){
           message.success('更新商品成功')
           this.getProducts(this.pageNum)
       }
    }
    //获取商品的方法
    getProducts=async(pageNum)=>{
        this.pageNum=pageNum   //保存pageNum，让其他方法可以看到
        this.setState({loading:true})  //显示loading
        const {searchName,searchType} =this.state
        //如果搜索关键字有值，就是搜索分页
        let result
        if(searchName){
            result=  await  reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{  //一般分页请求
             result= await reqProducts(pageNum,PAGE_SIZE)
        }
       this.setState({loading:false})  //请求结束之后 隐藏loading
        if(result.status===0){
            //取出分页数据，更新状态，显示分页列表
            const {total,list}=result.data
            this.setState({total,products:list})
        }
    }
    componentWillMount(){
        this.initColumns()  //调用初始化列的方法
    }
    componentDidMount(){
        this.getProducts(1)   //调用获取商品的方法
    }
    render() {
        //取出状态数据
        const {products,total,loading,searchName,searchType}=this.state
       
        const title=(
            <span>
                <Select value={searchType} style={{width:150}} onChange={value=>this.setState({searchType:value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0 15px'}} value={searchName} onChange={(e)=>{this.setState({searchName:e.target.value})}}></Input>
                <Button type='primary' onClick={()=>{this.getProducts(1)}}>搜索</Button>
            </span>
        )
        const extra=(
           <Button type='primary' onClick={()=>{this.props.history.push('/product/addupdate')}}>
                <Icon type='plus' ></Icon>   添加商品
           </Button>
        )
        return (
          <Card title={title} extra={extra}>
              <Table dataSource={products}
               columns={this.columns} 
               current={this.pageNum}   //让当前页数等于pageNum
               rowKey='_id'
                bordered
                loading={loading}
              pagination={{defaultPageSize:PAGE_SIZE,
                showQuickJumper:true,
                total,
                onChange:(pageNum)=>{this.getProducts(pageNum)},
            }}
              ></Table>
          </Card>
        )
    }
}
