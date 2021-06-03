import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { reqRoles, reqAddRole,reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
// import memoryUtils from '../../utils/memoryUtils'
import formateDate from '../../utils/dateUtils'
// import storageUtils from '../../utils/storageUtils'
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'
 class Role extends Component {
    state = {
        roles: [],    //所有角色的数组
        role: {},  //选中的role 
        isShowAdd: false,  //标识确认框的显示 隐藏 添加角色
        isShowAuth:false,  //角色权限的显示 隐藏 
    }
    constructor(props){
        super(props)
        this.auth=React.createRef()  //创建一个容器为了拿到子组件里面的东西
    }
    //列的数组  初始化列的数组
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:(create_time)=>formateDate(create_time)
            }, 
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }
        ]
    }
    //更新角色的回调  设置角色的权限
    updateRole=async()=>{
        const {role}=this.state   //旧的role
        //得到最新的menus
        const menus=this.auth.current.getMenus()
        role.menus=menus
        role.auth_name=this.props.user.username   //授权人
        //更新权限的接口
         const result= await reqUpdateRole(role)
         if(result.status===0){
             this.getRoles()
             //如果当前更新的是自己角色的权限,强制退出
             if(role._id===this.props.user.role._id){
               this.props.logout()
                message.error('当前用户修改了权限，重新登录')
             }else{
                 message.success('设置权限成功')
                this.setState({
                    roles:[...this.state.roles]
                })
             }

         }else{
             message.error('设置权限失败')
         }
        this.setState({isShowAuth:false})
    }
    //添加角色 添加角色的确认按钮
    addRole =() => {
        this.form.validateFields(async(err, values) => {
            //进行表单验证，只有通过了，才向下处理
            if (!err) {
                  //收集输入数据
                  const {roleName}=values
                  this.form.resetFields()  //清除表单数据
                //请求添加
                const result = await reqAddRole(roleName)
                if(result.status===0){
                    message.success('添加角色成功')
                    // this.getRoles()   //重新获取角色列表
                    const role=result.data  //拿到新产生的角色
                    //更新roles状态
                //   const roles=[role,...this.state.roles]
                //    this.setState({
                //        roles
                //    })

                //更新roles状态：基于原本状态数据更新
                this.setState(state=>({
                    roles:[role,...state.roles]
                }))
                }else{
                    message.error('添加角色失败')
                }
                //隐藏确认框
                this.setState({
                    isShowAdd: false  //隐藏确认框
                })
            }else{
                message.error('请输入角色名称')
            }
        })
    }

    //获取角色列表的方法
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    componentWillMount() {
        this.initColumn()
    }
    componentDidMount() {
        this.getRoles()   //获取所有角色列表
    }
    onRow = (role) => {  //role是点击当前行的的角色
        return {
            onClick: event => { // 点击行
                // console.log('row onClick()', role)
                this.setState({
                    role   //将选中的角色存起来
                })
            },
        }
    }
    render() {
        const { roles, role, isShowAdd ,isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => { this.setState({ isShowAdd: true }) }}>创建角色</Button>&nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>{this.setState({isShowAuth:true})}}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'  //哪一行被选中
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    dataSource={roles}   //每一行的数据
                    columns={this.columns} //每一列的数据
                    rowSelection={{   //选择功能的配置
                        selectedRowKeys: [role._id],  //指定选中项的 key 数组，需要和 onChange 进行配合
                        type: 'radio',   //配置选择项是单选还是多选
                        onSelect:(role)=>{  //选择某个radio的时候回调
                            this.setState({
                                role   //将选中的角色存起来
                            })
                        }
                    }}
                    onRow={this.onRow}  //点击每一行的事件，可以看出是点击的哪一行
                >
                </Table>
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    //添加分类
                    onOk={this.addRole}
                    onCancel={() => { this.setState({ isShowAdd: false })
                    this.form.resetFields()   //点击取消的时候，清除输入框的内容
                }}
                >
                    {/* 把接收的form存到父组件里面 */}
                    <AddForm setForm={(form) => { this.form = form }}></AddForm>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    //设置角色权限
                    onOk={this.updateRole}
                    onCancel={() => { this.setState({ isShowAuth: false })
                }}
                >
                    {/* 把当前选中的role传给权限子组件 */}
                    <AuthForm role={role} ref={this.auth}></AuthForm>
                </Modal>
            </Card>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {logout}
)(Role)