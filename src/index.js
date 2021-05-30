import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from  'react-router-dom'
import storageUtils from './utils/storageUtils'   //本地缓存
import memoryUtils from './utils/memoryUtils'     //内存中

//读取local中保存user,保存到内存中
memoryUtils.user=storageUtils.getUser()

ReactDOM.render(
   <BrowserRouter>
    <App />
    </BrowserRouter>,
  document.getElementById('root')
);

