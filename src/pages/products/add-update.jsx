import React, { Component } from 'react'
import { Card, Icon, Input, Form, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/link-button';
import {  reqCategorys,reqAddProductOrUpdateProduct } from '../../api/index'
import PictureWall from './pictures-wall'
import RichTextEditor from './rich-test-editor'
const Item = Form.Item
const { TextArea } = Input;  //多行输入框
//product的添加和更新的子路由组件
class ProductAddUpdate extends Component {
    state = {
        options: [],
    }
    constructor(props){
        super(props)
        //创建用来保存ref标识的标签对象的容器
        this.pw=React.createRef()
        this.editor=React.createRef()
    }
    //处理一级分类的数组
    initOptions =async(categorys) => {
        //根据categorys数组生成options数组
        const options = categorys.map((c) => {
            return {
                value: c._id,
                label: c.name,
                isLeaf: false  //不是叶子
            }
        })
        //如果是一个二级分类商品的更新
        const {isUpdate,product}=this
        const {pCategoryId} =product
        if(isUpdate&&pCategoryId!=='0'){
            //获取对应的二级分类列表
          const subCategorys=await  this.getCategorys(pCategoryId)
          //生成二级下拉列表的options
          const childOptions=subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true
          }))
        //找到当前商品对应的一级option对象
        const targetOption=options.find((option)=>option.value===pCategoryId)
        //关联到对应的一届options上
        targetOption.children=childOptions
    }
      //更新状态
      this.setState({options})
}
    //获取一级分类列表 或者二级分类列表  二级分类数组有数据
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            //如果一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys)   //利用一级分类数组 调用生成options的数组
            } else {  //二级分类列表
                return categorys   //返回二级列表  当前async函数返回的promise就会成功且value为categorys
            }
        }
    }
    //用于加载下一级列表数据的回调
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[0];
        // 显示loading效果
        targetOption.loading = true;

        //根据选中的分类，请求获取二级分类列表subCategorys
        const subCategorys = await this.getCategorys(targetOption.value)   //value是一级分类的id
              // 隐藏loading效果
              targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {  //当前选中的分类有二级分类
            //生成一个二级列表的options
        const cOptions=subCategorys.map(c=>{
                return {
                    value: c._id,
                    label: c.name,
                    isLeaf: true  //是叶子
                }
            })
            //关联到当前option上
            targetOption.children=cOptions
        } else {  //当前选中的分类没有二级分类
            targetOption.isLeaf=true
        }
        this.setState({
            options: [...this.state.options]   //内部修改，必须解构赋值 否则监听不到 不会重新render
        });
    };
    //验证价格 自定义验证函数
    validatorPrice = (rule, value, callback) => {   //value是字符串类型
        // callback()  //验证通过
        // callback('xxxx')   //验证没通过  并且指定错误信息
        if (value * 1 > 0) {
            callback() //验证通过
        } else {
            callback('价格必须大于0')
        }
    }
    //提交按钮
    submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (error, values) => {
          if (!error) {
    
            // 1. 收集数据, 并封装成product对象
            const {name, desc, price, categoryIds} = values
            let pCategoryId, categoryId
            if (categoryIds.length===1) {
              pCategoryId = '0'
              categoryId = categoryIds[0]
            } else {
              pCategoryId = categoryIds[0]
              categoryId = categoryIds[1]
            }
            const imgs = this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()
    
            const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
    
            // 如果是更新, 需要添加_id
            if(this.isUpdate) {
              product._id = this.product._id
            }
    
            // 2. 调用接口请求函数去添加/更新
            const result = await reqAddProductOrUpdateProduct(product)
    
            // 3. 根据结果提示
            if (result.status===0) {
              message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
              this.props.history.goBack()
            } else {
              message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
            }
          }
        })
      }
    componentDidMount() {
        this.getCategorys('0')
    }
    componentWillMount(){
        //取出携带的state
        const product=this.props.location.state  //如果添加没有值 ，否则有值 
        //保存一个是否更新的标识
        this.isUpdate=!!product
        //保存商品  如果没有就保存一个空对象
        this.product=product||{}  // ||{}空对象防止添加的时候没有值 而报错
    }
    render() {
        //取出是否更新的标识
        const {isUpdate,product} =this
        const {pCategoryId,categoryId,imgs,detail}=product
        // console.log(pCategoryId,categoryId)
        //用来接收级联分类id的数组
        const categoryIds=[]
        //如果当前是更新
        if(isUpdate){
            //商品是一个一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
                // console.log(categoryIds,1111111111)
            }else{  //商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <Icon type='arrow-left' style={{ fontSize: 20 }}></Icon>
                </LinkButton>
                <span>{isUpdate?'修改商品':'添加商品'}</span>
            </span>
        )
        //指定Item布局的配置对象
        const formItemLayOut = {
            labelCol: { span: 2 },   //左侧label的宽度
            wrapperCol: { span: 8 }   //指定右侧包裹的宽度
        }
        //输入框最后面的后缀
        const selectAfter = (
            <span>元</span>
        );

        //获取表单验证
        const { getFieldDecorator } = this.props.form
        return (
            <Card
                title={title}
            >
                <Form {...formItemLayOut}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    { required: true, message: '必须输入商品名称' }
                                ]
                            })(<Input placeholder='请输入商品名称'></Input>)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    { required: true, message: '必须输入商品描述' }
                                ]
                            })(<TextArea placeholder='请输入商品描述' autosize={{ minRows: 2, maxRows: 6 }} ></TextArea>)
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    { required: true, message: '必须输入商品价格' },
                                    { validator: this.validatorPrice }
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter={selectAfter}></Input>)
                        }
                    </Item>
                    <Item label="商品分类">
                    {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    { required: true, message: '必须输入商品分类' },
                                ]
                            })( <Cascader
                            placeholder='请指定商品分类'
                                options={this.state.options}    //需要显示的列表数据
                                loadData={this.loadData}        //指定当选择某个列表项，加载下一级列表的监听回调
                            />)
                        }
                    </Item>
                    <Item label="商品图片">
                        <PictureWall ref={this.pw} imgs={imgs}></PictureWall>
                    </Item>
                    <Item label="商品详情">
                       <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
                    </Item>
                    <Item >
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)
