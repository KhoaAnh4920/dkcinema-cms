import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import './AddNews.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import { createNewPost } from '../../services/NewsServices';
import { userState } from "../../redux/userSlice";
import { useSelector } from "react-redux";

//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';


//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css';
import { Link } from "react-router-dom";
import MyEditor from './MyEditor';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";




const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tiêu đề"),
    description: yup
        .string()
        .required("Vui lòng nhập mô tả")

});


export default function AddNews() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });

    let selectUser = useSelector(userState);
    const [startDate, setStartDate] = useState(new Date());

    const [allValues, setAllValues] = useState({
        name: '',
        description: '',
        status: 1,
        url: '',
        content: '',
        typeNews: null,
        errors: {},
        isLoadingButton: false
    });
    const [valImg, setValImg] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    })

    const [adminInfo, setAdminInfo] = useState({
        id: 1,
    })


    let history = useHistory();

    useEffect(() => {

        setAdminInfo({
            id: (selectUser.adminInfo) ? selectUser.adminInfo.id : '',
        });


    }, [selectUser]);


    const handleCancel = () => {

        setValImg((prevState) => ({
            ...prevState,
            previewVisible: false
        }));
    }

    //Image Preview
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setValImg((prevState) => ({
            ...prevState,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        }));

    };

    const handleChangeImage = ({ fileList }) => {

        console.log(fileList);
        if (fileList.length > 1) {
            toast.error("Chỉ được chọn một ảnh");
            return;
        }
        if (fileList.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(fileList[fileList.length - 1].originFileObj);
            reader.addEventListener('load', event => {
                const _loadedImageUrl = event.target.result;
                const image = document.createElement('img');
                image.src = _loadedImageUrl;
                image.addEventListener('load', () => {
                    const { width, height } = image;
                    // set image width and height to your state here
                    console.log(width, height);
                    if (width >= height) {
                        fileList[fileList.length - 1].typeImage = 1; // Hình ngang 
                    } else
                        fileList[fileList.length - 1].typeImage = 2; // Hình dọc
                });
            });
            const isJpgOrPng = fileList[fileList.length - 1].type === 'image/jpeg' || fileList[fileList.length - 1].type === 'image/png';
            console.log(isJpgOrPng);
            if (!isJpgOrPng) {
                toast.error("Hãy chọn ảnh !!");
                return;
            }
        }


        console.log(fileList);
        setValImg((prevState) => ({
            ...prevState,
            fileList
        }));
    }

    const beforeUpload = file => {
        console.log("file:", file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', event => {
            const _loadedImageUrl = event.target.result;
            const image = document.createElement('img');
            image.src = _loadedImageUrl;
            image.addEventListener('load', () => {
                const { width, height } = image;
                // set image width and height to your state here
                console.log(width, height);
            });
        });
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        console.log(isJpgOrPng);
        return isJpgOrPng;
    };






    useEffect(() => {


    }, []);




    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    //Uploaded url
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }



    const handleSavePost = async () => {


        if (!allValues.content || !allValues.typeNews) {
            toast.error("Hãy điền đầy đủ thông tin");
            return;
        }

        setAllValues((prevState) => ({
            ...prevState,
            isLoadingButton: true,
        }))


        if (valImg.fileList.length < 1) {
            toast.error("Hãy chọn ảnh");
            return;
        }

        let result = [];

        await Promise.all(valImg.fileList.map(async (item, index) => {
            console.log("Check item: ", item.originFileObj);
            let obj = {};
            obj.image = await getBase64(item.originFileObj);
            obj.fileName = item.name;
            result.push(obj);
        }))


        let res = await createNewPost({
            title: allValues.name,
            noiDung: allValues.content,
            tomTat: allValues.description,
            userId: adminInfo.id,
            type: allValues.typeNews,
            thumbnail: result[0].image,
            fileName: result[0].fileName

        })

        if (res && res.errCode == 0) {
            history.push("/news-management")
            toast.success("Thêm bài viết mới thành công");
        } else {
            toast.error(res.errMessage);
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target;


        setAllValues((prevState) => ({
            ...prevState,
            typeNews: +value
        }));

    }

    const handleChangeCKEdittor = (data) => {


        setAllValues({ ...allValues, content: data })
    }




    return (

        <>

            <div id="wrapper" className='add-post-main'>
                {/* Sidebar */}

                <Sidebar />

                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}
                        {/* Container Fluid*/}
                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">

                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>
                                    <li className="breadcrumb-item"><Link to={`/news-management`}>Quản lý bài viết</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Thêm bài viết</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-2'></div>
                                <div className="col-8">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">Thêm bài viết mới</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="MainDiv">
                                                <div className="container">

                                                    <Upload
                                                        beforeUpload={() => {
                                                            /* update state here */
                                                            return false;
                                                        }}
                                                        action={""}
                                                        listType="picture-card"
                                                        fileList={valImg.fileList}
                                                        onPreview={handlePreview}
                                                        onChange={handleChangeImage}
                                                    >
                                                        {
                                                            valImg.fileList.length >= 8 ? null :
                                                                <>
                                                                    <div>
                                                                        <PlusOutlined />
                                                                        <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                                                    </div>
                                                                </>}
                                                    </Upload>
                                                    <Modal
                                                        visible={valImg.previewVisible}
                                                        title={valImg.previewTitle}
                                                        footer={null}
                                                        onCancel={handleCancel}
                                                    >
                                                        <img alt="example" style={{ width: '100%' }} src={valImg.previewImage} />
                                                    </Modal>
                                                </div>
                                            </div>
                                            <form onSubmit={handleSubmit(handleSavePost)}>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Tiêu đề</label>
                                                    <input
                                                        type="text"
                                                        className="form-control input-sm"
                                                        placeholder="Enter title"
                                                        {...register("name", {
                                                            required: true,
                                                            onChange: changeHandler
                                                        })}
                                                    />

                                                    {/* <span className='error-code-input'>{allValues.errors["tenRap"]}</span> */}

                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Thể loại</label>
                                                    <div className="col-sm-9 radio-type-post">
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio1" name="typeNews" value={1} onChange={(e) => handleChange(e)} className="custom-control-input" />
                                                            <label className="custom-control-label" htmlFor="customRadio1">Review phim</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio2" name="typeNews" value={2} onChange={(e) => handleChange(e)} className="custom-control-input" />
                                                            <label className="custom-control-label" htmlFor="customRadio2">Giới thiệu phim</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" name="typeNews" id="customRadioDisabled1" value={3} onChange={(e) => handleChange(e)} className="custom-control-input" />
                                                            <label className="custom-control-label" htmlFor="customRadioDisabled1">Khuyến mãi</label>
                                                        </div>
                                                    </div>

                                                    {/* <span className='error-code-input'>{allValues.errors["tenRap"]}</span> */}

                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Tóm tắt</label>
                                                    <textarea className="form-control"
                                                        id="exampleFormControlTextarea1"
                                                        name="description"
                                                        {...register("description", {
                                                            required: true,
                                                            onChange: changeHandler
                                                        })}
                                                        rows="3"></textarea>
                                                    {/* <span className='error-code-input'>{allValues.errors["address"]}</span> */}

                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Nội dung</label>
                                                    <MyEditor handleChangeCKEdittor={handleChangeCKEdittor} />
                                                    {/* <textarea className="form-control" id="exampleFormControlTextarea1" value={allValues.description} name="description" onChange={changeHandler} rows="5"></textarea> */}
                                                    {/* <span className='error-code-input'>{allValues.errors["address"]}</span> */}

                                                </div>


                                                {Object.keys(errors).length !== 0 &&
                                                    <ul className="error-container">
                                                        {errors.name && errors.name.message &&
                                                            <li>{errors.name.message}</li>
                                                        }
                                                        {errors.description && errors.description.message &&
                                                            <li>{errors.description.message}</li>
                                                        }
                                                    </ul>
                                                }

                                                <Button variant="primary" type='submit' {...allValues.isLoadingButton && 'disabled'}>
                                                    {allValues.isLoadingButton &&
                                                        <>
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                            <span className="visually" style={{ marginLeft: '10px' }}>Loading...</span>
                                                        </>

                                                    }
                                                    {!allValues.isLoadingButton &&
                                                        <>
                                                            <span className="visually">Thêm</span>
                                                        </>
                                                    }
                                                </Button>

                                            </form>

                                        </div>
                                    </div>

                                </div>
                                <div className='col-2'></div>

                            </div>

                        </div>
                        {/*-Container Fluid*/}
                    </div>
                    {/* Footer */}
                    <Footer />
                    {/* Footer */}
                </div>
            </div>
        </>
    );
}
