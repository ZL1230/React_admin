import React, { Component } from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Category from '../category'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie' 
import Home from '../home'
import Role from '../role'
import User from '../user'
import Order from '../order';
import Product from '../products/product';
const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        // console.log(this.props.location.pathname)
        const user=memoryUtils.user
        //如果内存中没有存储user ->当前没有登录
        if(!user || !user._id){
            //自动跳转到登录(在render()中)
            return <Redirect to='/login' />
        }
        return (
             <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    {/* <Header>Header</Header> */}
                    <Header></Header>
                    <Content style={{margin:20,backgroundColor:'#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/charts/bar' component={Bar}></Route>
                            <Route path='/charts/line' component={Line}></Route>
                            <Route path='/charts/pie' component={Pie}></Route>
                            <Route path='/order' component={Order}></Route>
                            <Redirect to='/home'></Redirect>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center',color:'pink',fontSize:'20px'}}>zzzl专属定制,咨询加v:zl2641541344</Footer>
                </Layout>
             </Layout>
        )
    }
}
