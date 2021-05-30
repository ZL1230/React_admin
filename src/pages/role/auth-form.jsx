import React, { PureComponent } from 'react'
import { Input, Form, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree;
//添加分类的form组件
export default class AuthForm extends PureComponent {
    constructor(props){
        super(props)
        const menus=this.props.role.menus     //根据传入角色的menus生成初始状态
        this.state={
            checkedKeys:menus   //先初始化默认role里面的选中状态 如果后面有选中 重新更新checkedKeys
        }
    }
    static propTypes = {
        role: PropTypes.object,   //从父组件接收到的role
    }
    //定义一个方法 给父组件传递收集的信息
    getMenus=()=>{
        return this.state.checkedKeys
    }

    //树形控件选中时候的回调  cheeckedKetys所有选中时的数组
    onCheck=(checkedKeys, info)=>{   
        this.setState({checkedKeys:checkedKeys})   //重新更新选中的状态
    }

    //定义生成树形结构的方法
    getTreeNodes=(menuList)=>{
     return menuList.reduce((pre,item)=>{
          pre.push(
            <TreeNode title={item.title} key={item.key} >
                {/* 如果当前的节点有子节点，就继续递归 */}
                {item.children?this.getTreeNodes(item.children):null}  
            </TreeNode>
          )
          return pre
      },[])
    }

    componentWillMount(){  //调用生成树形结构的方法
        this.treeNodes=this.getTreeNodes(menuList)
    }

    //根据新传入的role来更新checkedKeys状态(当组件接收到新的属性时自动调用)
    componentWillReceiveProps(nextProps){
        const menus=nextProps.role.menus
        this.setState({checkedKeys:menus})   //不会触发render更新
        // this.state.checkedKeys=menus   //不推荐
    }
    render() {
        const formItemLatout = {
            labelCol: { span: 4 },  //左侧label的宽度
            wrapperCol: { span: 15 } //右侧包裹的宽度
        }
        const { role } = this.props
        const {checkedKeys}=this.state
        return (
            <Form>
                <Item label='角色名称' {...formItemLatout}>
                    <Input value={role.name} disabled></Input>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}   //当前点击行的role的权限   选中状态的数组
                    onCheck={this.onCheck}   //当前分支选中的事件
                > 
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                        {/* <TreeNode title="parent 1-0" key="0-0-0">
                            <TreeNode title="leaf" key="0-0-0-0"  />
                            <TreeNode title="leaf" key="0-0-0-1" />
                        </TreeNode>
                        <TreeNode title="parent 1-1" key="0-0-1">
                            <TreeNode  key="0-0-1-0" />
                        </TreeNode> */}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}


