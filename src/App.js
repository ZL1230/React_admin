
import React, {Component} from 'react'
import { Route, Switch} from 'react-router-dom'

import Login from './pages/login'
import Admin from './pages/admin'

/*
应用的根组件
 */
export default class App extends Component {


  render () {
    return (
        <Switch> {/*只匹配其中一个*/}
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
    )
  }
}