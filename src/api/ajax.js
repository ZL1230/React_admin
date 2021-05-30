//能发送异步请求的ajax模块
//函数的返回值是promise对象

//统一处理请求异常？
//  优化1：在外边包一个自己创建的promsie对象
//在请求出错时，不reject，而是出现错误提示

//  优化2：异步得到的不是response,而是response.data
//  在请求成功时  :resolve(response.data)

import {message} from 'antd'
import axios from 'axios'
export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject)=>{
        let promise
        //1.执行异步ajax请求
        if(type==='GET'){              //发送GET请求
            promise= axios.get(url,{     //配置对象
                params:data            //指定请求参数
            })
        }else{                         //发送POST请求
           promise= axios.post(url,data)
        }
         //2.如果成功了，调用resolve(value)  promise.then()返回一个promise对象
    promise.then((value)=>{
        resolve(value.data)
    //3.如果失败了，不调用reject(reason),而是提示错误信息
    }).catch((error)=>{
        message.error('请求出错了：'+error.message)
    })
    })
}