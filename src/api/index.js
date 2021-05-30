import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

//包含应用中所有接口请求函数的模块，每个函数的返回值都是promise
// const BASE='http://localhost:xxxx' 
//1.登录的方法

// export function reqLogin(username,password){
//     return ajax('login',{username,password},'POST')
// }

// export const reqLogin=(username,password)=>{return ajax('login',{username,password},'POST')}
export const reqLogin=(username,password)=> ajax('/login',{username,password},'POST')


//2.添加/更新用户的接口 
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')


//3.查询天气的接口 jsonp
export const reqWeather=(city)=>{

    return new Promise((resolve,reject)=>{
        const url=`https://restapi.amap.com/v3/weather/weatherInfo?key=415e6bd79a6275825d0891f821766054&city=${city}&extensions=base&output=JSON`
        //发送jsonp请求
        jsonp(url,{},(error,data)=>{
            // console.log("jsonp",error,data)
            //如果成功了
            if(!error&&data.status==='1'){
                //取出需要的数据
                const {city,weather,temperature}=data.lives[0]
                resolve({city,weather,temperature})
            //   console.log(city,weather,temperature)
            }else{
            //失败了
                message.error('获取天气信息失败')
            }
        })
    })
  
}
// reqWeather('410100')

//4.获取分类一级、二级分类的列表
// export const reqCategorys=(parentId)=>ajax('/manage/category/list',{parentId:parentId})
export const reqCategorys=(parentId)=>ajax('/manage/category/list',{parentId})

// 5.添加分类
export const reqAddCategory=(categoryName,parentId)=>ajax('/manage/category/add',{categoryName,parentId},"POST")

//6.更新分类
export const reqUpdateCategory=({categoryId,categoryName})=>ajax('/manage/category/update',{categoryId,categoryName},"POST")

//7.获取商品分页列表的方法
export const reqProducts=(pageNum,pageSize)=>ajax('/manage/product/list',{pageNum,pageSize})

//8.搜索商品分页列表
//搜索的类型   productName/productDesc
export const reqSearchProducts=({pageSize,pageNum,searchName,searchType})=>ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

//9.获取id一个分类
export const reqCategory=(categoryId)=>ajax('/manage/category/info',{categoryId})

//10.更新商品的上架，下架
export const reqUpdateSataus=(productId,status)=>ajax('/manage/product/updateStatus',{productId,status},'POST')

//11.删除上传图片的接口
export const reqDeleteImg=(name)=>ajax('/manage/img/delete',{name},'POST')

//12.添加/修改商品
export const reqAddProductOrUpdateProduct=(product)=>ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')

//12.获取所有角色的列表
export  const reqRoles=()=>ajax('/manage/role/list')

//13.添加角色的方法
export const reqAddRole=(roleName)=>ajax('/manage/role/add',{roleName},"POST")
//14 .更新角色权限的方法
export const reqUpdateRole=(role)=>ajax('/manage/role/update',role,'POST')

//15.获取所有用户的方法
export const reqUsers=()=>ajax('/manage/user/list',"GET")

//16.删除指定用户的方法
export const reqDeleteUser=(userId)=>ajax('/manage/user/delete',{userId},'POST')



