import { Upload, Icon, Modal, message } from 'antd';
import React from 'react'
import PropTypes from 'prop-types'
import {reqDeleteImg} from '../../api/index'
import {BASE_IMG_URL} from '../../utils/constants'


//用于图片上传的组件
export default class PicturesWall extends React.Component {
  //接受默认修改的图片显示
  static propTypes={
    imgs:PropTypes.array
  }
  state = {
    previewVisible: false, // 标识是否显示大图预览Modal
    previewImage: '', // 大图的url
    fileList: [
      /*{
        uid: '-1', // 每个file都有自己唯一的id
        name: 'xxx.png', // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
      },*/
    ],
  }
  constructor(props){
    super(props)
    let fileList=[]
    //如果传入了img，就将这个img赋值给fileList图片数组
   const {imgs}=this.props
   if(imgs&&imgs.length>0){
      fileList=imgs.map((img,index)=>({
        uid:-index,  //每一个file都有一个唯一的id
        name:img, //图片文件名
        status:'done',
        url:BASE_IMG_URL+img
      }))
   }
    //初始化状态
    this.state={
      previewVisible: false,  //标识是否显示大图预览 Modal
      previewImage: '',    //大图的地址
      fileList   //所有已上传图片的数组
    }
  }

 //隐藏Modal
  handleCancel = () => this.setState({ previewVisible: false });  

  handlePreview = async file => {
      //显示指定file对应的大图
 

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  //获取所有已上传图片文件名的数组
  getImgs=()=>{
      return this.state.fileList.map(file=>file.name)
  }

  //fileList所有已上传图片文件对象的数组
  //file 当前操作的图片文件（上传/删除）
  handleChange = async({ file,fileList }) => {
      //一旦上传成功，将当前上传的file的信息修正（name,url）
      if(file.status==='done'){
          const result=file.response 
          if(result.status===0){
              message.success('上传图片成功！')
              const {name,url}=result.data
              file=fileList[fileList.length-1]
              file.name=name
              file.url=url
          }else{
              message.error('上传图片失败')
          }
      }else if(file.status==='removed'){  //删除图片完成
         const result=await reqDeleteImg(file.name)
         if(result.status===0){
           message.success('删除图片成功！')
         }else{
           message.error('删除图片失败！')
         }
      }
      this.setState({    //在操作（上传/删除）过程中更新fileList状态
      fileList 
    })};

  render() {
    const { previewVisible, previewImage, fileList } = this.state; 
    const uploadButton = (   //上传的按钮
      <div>
        <Icon type="plus" />
        <div >Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"   //上传图片的接口地址
          accept='image/*'  //指定上传的为任意类型的图片
          listType="picture-card"  //上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
          name='image'            //发到后台的文件参数名  请求参数名
          fileList={fileList}    //所有已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}