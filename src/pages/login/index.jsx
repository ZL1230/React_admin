import React, {Component} from 'react'
import {
  Form,
  Icon,
  Input,
  Button,
  message,
} from 'antd'
import './index.less'
import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'     //保存user到内存
import storageUtils from '../../utils/storageUtils'
import {Redirect} from 'react-router-dom'
// import logo from '../../assets/images/logo.png'

const Item = Form.Item // 不能写在import之前
/*
登陆的路由组件
 */
class Login extends Component {

 handleSubmit = (event) => {

    // 阻止事件的默认行为
    event.preventDefault()
    // 得到form对象
    // const form = this.props.form

    // // 获取表单项的输入数据
    // const values = form.getFieldsValue()
    // console.log('handleSubmit()', values)

    //对所有表单字段进行验证
    this.props.form.validateFields(async(err, values) => {
      //校验成功
      if (!err) {
            // console.log('提交登录的ajax请求 ', values);
          const {username,password}=values
            console.log(username,password)
          // reqLogin(username,password).then(response=>{console.log(response.data)}).catch((err)=>{console.log(err)})

          //这里不需要自己处理错误，已经封装好了
          // try {
          //   const res=await reqLogin(username,password)
          //   console.log(res.data)
          // }catch(error){
          // alert('请求出错了',error.message)
          // }

             const result=await reqLogin(username,password)
            //  const result=response.data     //{status:0,data:user}      {status:1,msg}
             if(result.status===0){   //登录成功
                message.success('登录成功')

                //跳转之前保存user(内存)
                const user=result.data
                memoryUtils.user=user

                //同时还得缓存起来(本地)
                storageUtils.saveUser(user)

                //跳转到管理界面  所有路由组件都有history属性
                this.props.history.replace('/')
             }else {      //登录失败
                  message.error(result.msg)
             }
            
      }else{
        console.log('校验失败')
      }
    });
  }
  /*
  对密码进行自定义验证  自定义校验
  */
  validatePwd = (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
    if(!value) {
      callback('密码必须输入')
    } else if (value.length<4) {
      callback('密码长度不能小于4位')
    } else if (value.length>12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  }
  render () {

      //判断用户是否登录 如果用户登录了自动跳转管理界面
      const user=memoryUtils.user
      if(user && user._id){
          // this.props.history.replace('/') 也可以
          return <Redirect to='/'></Redirect>
      }


    // 得到具强大功能的form对象
    const form = this.props.form
    const { getFieldDecorator } = form;
    return (
      <div className="login">
        <header className="login-header">
          {/* <img src={logo} alt="logo"/> */}
          <h1>React 商品后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {
                getFieldDecorator('username', { // 配置对象: 属性名是特定的一些名称
                  // 声明式验证: 直接使用别人定义好的验证规则进行验证
                  rules: [
                    { required: true, whitespace: true, message: '用户名必须输入' },
                    { min: 4, message: '用户名至少4位' },
                    { max: 12, message: '用户名最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                  ],
                  initialValue: 'admin', // 初始值
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
            </Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin
/*
1. 前台表单验证
2. 收集表单输入数据
 */

//async和awais
//1.作用？
//简化promise对象的使用：不再使用then()来指定成功/失败的回调函数  以同步编码（没有回调函数了）方式实现异步流程

//2.哪里写await
// 在返回promsie的表达式的左侧写await：不想要promsie，想要promsie异步执行成功的value数据

//3.哪里写async
//在promsie所在的函数前面写async


