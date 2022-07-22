import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import './AddBanner.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import { createNewBanner } from '../../services/BannerServices';

//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';


//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css';
import { Link } from "react-router-dom";





export default function AddBanner() {



    const [startDate, setStartDate] = useState(new Date());

    const [allValues, setAllValues] = useState({
        name: '',
        description: '',
        status: 0,
        url: '',
        errors: {},
        isLoadingButton: false
    });
    const [valImg, setValImg] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    })
    const [typeCheck, setUserInfo] = useState({
        typeMovie: [],
        response: [],
    });
    let history = useHistory();


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
            toast.error("Maximum 1 poster");
            return;
        }
        if (fileList.length > 0 && fileList[fileList.length - 1].originFileObj) {
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
                    } else {
                        toast.success("Kích thước hình ảnh không phù hợp");
                        return
                    }
                });
            });
            const isJpgOrPng = fileList[fileList.length - 1].type === 'image/jpeg' || fileList[fileList.length - 1].type === 'image/png';
            console.log(isJpgOrPng);
            if (!isJpgOrPng) {
                toast.error("Please choose image");
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



    const handleSaveBanner = async (data) => {

        // console.log('data: ', data)

        setAllValues((prevState) => ({
            ...prevState,
            isLoadingButton: true,
        }))


        if (valImg.fileList.length < 1) {
            toast.error("Please upload image");
            setAllValues((prevState) => ({
                ...prevState,
                isLoadingButton: false,
            }))
            return;
        }

        let result = [];

        await Promise.all(valImg.fileList.map(async (item, index) => {
            // console.log("Check item: ", item.originFileObj);
            let obj = {};
            obj.image = await getBase64(item.originFileObj);
            obj.fileName = item.name;
            result.push(obj);
        }))

        // console.log("Check result: ", result);

        let res = await createNewBanner({
            name: allValues.name,
            description: allValues.description,
            imageBanner: result,
            image: result[0].image,
            fileName: result[0].fileName
        })

        if (res && res.errCode == 0) {
            history.push("/banner-management")
            toast.success("Add new banner success");
        } else {
            toast.error(res.errMessage);
        }

    }




    return (

        <>

            <div id="wrapper">
                {/* Sidebar */}

                <Sidebar />

                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}
                        {/* Container Fluid*/}
                        <div className="container-fluid add-banner-container" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">

                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>
                                    <li className="breadcrumb-item"><Link to={`/banner-management`}>Quản lý banner</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Thêm banner</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-3'></div>
                                <div className="col-6">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">Add new Banner</h5>
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
                                                                        <div style={{ marginTop: 8 }}>Upload</div>
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

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Tên Banner</label>
                                                <input
                                                    type="text"
                                                    className="form-control input-sm"
                                                    name='name'
                                                    placeholder="Enter name"
                                                    onChange={changeHandler}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Mô tả</label>
                                                <textarea
                                                    className="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    name="description"
                                                    rows="5"
                                                    onChange={changeHandler}

                                                ></textarea>

                                            </div>







                                            <Button variant="primary" {...allValues.isLoadingButton && 'disabled'} onClick={handleSaveBanner} >
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
                                                        <span className="visually">Submit</span>
                                                    </>
                                                }
                                            </Button>



                                        </div>
                                    </div>

                                </div>

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
