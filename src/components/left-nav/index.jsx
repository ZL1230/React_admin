import React, { Component } from 'react'
import './index.less'
import logo from '../../assets/images/n.jpg'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon} from 'antd';
import menuList from '../../config/menuConfig.js'
// import memoryUtils from '../../utils/memoryUtils'
import {setHeadTitle} from '../../redux/actions'
import {connect} from 'react-redux'
const SubMenu = Menu.SubMenu;
 class LeftNav extends Component {
   //判断当前登录用户对item是否有权限
  hasAuth=(item)=>{
    const {key,isPublic}=item  //key是权限路径  isPublic是否为公开权限
     const menus=this.props.user.role.menus  //当前登录人的权限
    const username=this.props.user.username
    //1.如果当前用户是admin
    if(username==='admin'||isPublic||menus.indexOf(key)!==-1){
        return true
    }else if(item.children){ //4.如果当前用户有此item的某个子item的权限
       return  !!item.children.find((child)=>menus.indexOf(child.key)!==-1)
    } 
    return false
    //2.如果当前item是公开的
    //3.当前用户由此item的权限：key有没有在menus中
  }
    //根据menu数组生成对应的标签数组   map+递归调用
  /*   getMenuNodes=(menuList)=>{
        return menuList.map((item)=>{
                //    {
                //         title:'商品',  菜单标题名称
                //         key:'/products',
                //         icon:'appstore',
                //         children:[       //子菜单列表  可能有 可能没有
                //   } 
               if(!item.children){
                   return (
                          <Menu.Item key={item.key}>
                            <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                   )
               }else{
                   return (
                    <SubMenu
                    key={item.key}
                    title={
                      <span>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                      </span>
                    }
                  >
                  {
                      this.getMenuNodes(item.children)
                  }
                  </SubMenu> 
                   )
               }
            }
        )
    } */
     //根据menu数组生成对应的标签数组   reduce+递归调用
    getMenuNodes=((menuList)=>{
      // console.log(this.props.headTitle,this.prop)
               //得到当前请求的路由路径  但是left-nav不是路由组件 没有location属性  用withRouter将一般组件拥有路由组件的属性
       const path=this.props.location.pathname
        return menuList.reduce(((pre,item)=>{
          //如果当前用户有item对应的权限,需要添加显示对应的菜单项
          if(this.hasAuth(item)){
                //向pre 添加<Menu.Item/>
            //向pre 添加<SubMneu />
            if(!item.children){
              //判断item是否为当前对应的item
              if(item.key===path||path.indexOf(item.key)===0){
                //更新redux中headerTitld的状态
                this.props.setHeadTitle(item.title)
              }
              pre.push(( <Menu.Item key={item.key}>
                {/* 利用redux的方法 disptach重而改变redux中state的值 */}
                  <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}> 
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                  </Link>
              </Menu.Item>))
          }else{
              //查找一个与当前请求路径匹配的自Item
              const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
              //如果存在，说明当前item的列表需要打开
             if(cItem){
              this.openKey=item.key
             }
              pre.push((
                  <SubMenu
                  key={item.key} 
                  title={
                    <span>
                      <Icon type={item.icon}/>
                      <span>{item.title}</span>
                    </span>
                  }
                >
                {
                    this.getMenuNodes(item.children)
                }
                </SubMenu> 
              ))
          }
          }
                return pre
        }),[])
    })
    //在第一次render()之前执行一次 为第一次render()准备数据(同步的)
    componentWillMount(){
        this.menuNodes= this.getMenuNodes(menuList)
    }
    render() {
            //得到当前请求的路由路径  但是left-nav不是路由组件 没有location属性  用withRouter将一般组件拥有路由组件的属性
       let  path=this.props.location.pathname
    //    console.log('render()',path)
    if(path.indexOf('/product')===0){  //当前请求的是商品或其子路由界面
          path='/product'
    }
            //得到需要打开菜单项的key
           const openKey=this.openKey
        //    console.log('openKey',openKey)
        return (
           <div>
             <header className="left-nav">
                <Link  to='/' className='left-nav-header'>
                    <img alt='logo' src={logo}></img>
                    <h1>商品后台</h1>
                </Link>
            </header>

            <Menu
        selectedKeys={[path]}  //指定哪一个菜单选中 根据对应的路径 这个是动态的
        defaultOpenKeys={[openKey]}  //指定展开哪一个菜单
          mode="inline"
        //    主题色
          theme="dark" >     
            {
              this.menuNodes
            }
        </Menu>
           </div>
        )
    }
}
//withRouter高阶组件
//包装非路由组件 产生一个新的路由组件
//新的组件向非路由组件传递3个属性：history/location/match
export default connect(
    state=>({user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))   //将一般组件拥有路由组件的属性
