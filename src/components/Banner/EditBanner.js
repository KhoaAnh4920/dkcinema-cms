import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import './EditBanner.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import { editBanner, getDetailBanner } from '../../services/BannerServices';

//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';


//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';





export default function EditBanner() {
    const { id } = useParams();

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


    async function fetchDataBanner() {
        // You can await here

        let dataDetailBanner = await getDetailBanner(id);

        console.log('dataDetailBanner: ', dataDetailBanner);

        if (dataDetailBanner && dataDetailBanner.data) {

            let dataBanner = dataDetailBanner.data;
            let result = [];
            let obj = {};
            obj.uid = dataBanner.id;
            obj.name = dataBanner.public_id_image;
            obj.public_id = dataBanner.public_id_image;
            obj.status = 'done';
            obj.url = dataBanner.url;
            result.push(obj)

            setValImg((prevState) => ({
                ...prevState,
                fileList: result
            }));

            setAllValues((prevState) => ({
                ...prevState,
                name: dataBanner.name,
                description: dataBanner.description
            }));

        }

        // let listFood = [];

        // if (dataRes && dataRes.dataFood) {
        //     listFood = dataRes.dataFood.map(item => {
        //         item.nameType = item.TypeOfFood.name;
        //         item.amount = 0;
        //         dataDetailCombo.data[0].ComboInFood.map(y => {
        //             if (y.id === item.id && item.amount === 0) {
        //                 item.amount = y.Combo_Food.amount;
        //                 return;
        //             }
        //         })
        //         return item;
        //     })
        // }


        // setAllValues((prevState) => ({
        //     ...prevState,
        //     isShowLoading: false,
        //     listFood: listFood,
        //     dataDetailCombo: (dataDetailCombo && dataDetailCombo.data && dataDetailCombo.data[0]) ? dataDetailCombo.data[0] : [],
        //     name: dataDetailCombo.data[0].name || '',
        //     price: dataDetailCombo.data[0].price || ''
        // }))

    }


    useEffect(() => {
        fetchDataBanner()

    }, []);

    // const checkValidateInput = () => {
    //     let isValid = true;
    //     let errors = {};
    //     let arrInput = ['email', 'password', 'userName', 'fullName', 'birthday', 'phone', 'selectedGender', 'selectedRoles', 'address']
    //     for (let i = 0; i < arrInput.length; i++) {
    //         // this.state[arrInput[i]] == this.state.email or this.state.password
    //         if (!allValues[arrInput[i]]) {
    //             isValid = false;
    //             errors[arrInput[i]] = "Cannot be empty";
    //         }
    //     }

    //     if (!isValid) {
    //         Swal.fire({
    //             title: 'Missing data?',
    //             text: "Vui lòng điền đầy đủ thông tin!",
    //             icon: 'warning',
    //         })

    //         setAllValues((prevState) => ({
    //             ...prevState,
    //             errors: errors,
    //             isShowLoading: false
    //         }));
    //     }
    //     return isValid;
    // }


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



    const handleEditBanner = async () => {



        if (valImg.fileList && valImg.fileList[0] && valImg.fileList[0].originFileObj) {
            setAllValues((prevState) => ({
                ...prevState,
                isLoadingButton: true,
            }))

            let result = [];
            await Promise.all(valImg.fileList.map(async (item, index) => {

                let obj = {};
                obj.image = await getBase64(item.originFileObj);
                obj.fileName = item.name;
                result.push(obj);

            }))
            let res = await editBanner({
                id: id,
                name: allValues.name,
                description: allValues.description,
                url: result[0].image,
                fileName: result[0].fileName
            })
            if (res && res.errCode == 0) {
                history.push("/banner-management")
                toast.success("Update banner success");
            } else {
                toast.error(res.errMessage);
            }


        } else {

            let res = await editBanner({
                id: id,
                name: allValues.name,
                description: allValues.description
            })

            if (res && res.errCode == 0) {
                history.push("/banner-management")
                toast.success("Update banner success");
            } else {
                toast.error(res.errMessage);
            }
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
                        <div className="container-fluid" id="container-wrapper">
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
                                                <input type="text" className="form-control input-sm" name='name' onChange={changeHandler} value={allValues.name} placeholder="Enter name" />

                                                {/* <span className='error-code-input'>{allValues.errors["tenRap"]}</span> */}

                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Mô tả</label>
                                                <textarea className="form-control" id="exampleFormControlTextarea1" value={allValues.description} name="description" onChange={changeHandler} rows="5"></textarea>
                                                {/* <span className='error-code-input'>{allValues.errors["address"]}</span> */}

                                            </div>


                                            {/* <button
                                                type="submit"
                                                onClick={() => handleSaveMovieTheater()}
                                                className="btn btn-primary btn-submit">Submit</button> */}

                                            <Button variant="primary" {...allValues.isLoadingButton && 'disabled'} onClick={() => handleEditBanner()}>
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
