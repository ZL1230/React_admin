import React, { Component } from 'react'
import './index.less'
import formateDate from '../../utils/dateUtils'
import  {reqWeather} from '../../api/index'
import {withRouter} from 'react-router-dom'
import LinkButton from '../../components/link-button'
import { Modal } from 'antd';
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'
  class Header extends Component {
    state={
        currentTime:formateDate(Date.now()),   //当前时间字符串
        city:'',  //城市
        weather:'', //天气
        temperature:'', //温度
        timer:''
    }
 
    //退出登录
    logout=()=>{
        //显示确认框
        Modal.confirm({
            title: '确定退出吗', 
            // content: 'Some descriptions',
            onOk:()=> {
             this.props.logout()
              //跳转到到login页面
            //   this.props.history.replace('/login')
            },
        })
    }
    //获取时间
    getTime=()=>{
        //每隔1s获取当前时间，并且更新状态数据 currentTime
       this.timer= setInterval(()=>{
           const currentTime=formateDate(Date.now())
           this.setState({currentTime})
        },1000)
    }

    //清除定时器 当前组件死亡之前
    componentWillUnmount(){
        clearInterval(this.timer)
    }

    //获取天气 
     getWeather=async()=>{
        const{city,weather,temperature}=await reqWeather('410100')
        this.setState({city,weather,temperature})
    }

    // //获取标题
    // getTitle=()=>{
    //     //得到当前请求路径
    //     const path=this.props.location.pathname
    //     let title
    //     menuList.forEach((item)=>{
    //             if(item.key===path){  //如果当前item的key与path一致，那么就取出当前标题title
    //                title= item.title
    //             }else if(item.children){
    //                 //在所有的子item中查找
    //             const cItem=item.children.find(cItem=>
    //                      path.indexOf(cItem.key)===0)
                    
    //                 //如果有值，则匹配到了
    //                 if(cItem){
    //                     title=cItem.title
    //                 }
    //             }
    //     })
    //     return title
    // }

   //第一次render之后执行，再次执行异步操作  
    //（1）发ajax请求 （2启动定时器
    componentDidMount(){
        //获取当前时间
        this.getTime()
        //获取当前天气显示
        this.getWeather('410100')
     }
 
    render() {
        const {city,temperature,weather,currentTime}=this.state
        const username=this.props.user.username
             //获取当前需要显示的标题
        // const title=this.getTitle()
        const title=this.props.headTitle  //react-redux实现
        // console.log(title)
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                   <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        {/* 当前城市 */}
                        <span>城市：{city}</span>  
                        {/* 天气 */}
                        <span>天气：{weather}</span>
                        {/* 温度 */}
                        <span>温度：{temperature}℃</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state=>({headTitle:state.headTitle,user:state.user}),
    {logout}
)(withRouter(Header))