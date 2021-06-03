import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from  'react-router-dom'
// import storageUtils from './utils/storageUtils'   //本地缓存
// import memoryUtils from './utils/memoryUtils'     //内存中
import {Provider} from 'react-redux'
import store from './redux/store'


ReactDOM.render(
 <Provider store={store}>  <BrowserRouter>
 <App />
 </BrowserRouter></Provider>,
  document.getElementById('root')
);

