import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import Select from 'react-select';
import './AddFilms.scss';
import DatePicker from '../../containers/System/Share/DatePicker';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import { getAllTypeFilms } from '../../services/FilmsServices';
import { createNewFilmsService } from '../../services/FilmsServices';

//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';


//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css';
import { Link } from "react-router-dom";






export default function AddFilms() {
    const [startDate, setStartDate] = useState(new Date());

    const [allValues, setAllValues] = useState({
        name: '',
        transName: '',
        country: '',
        language: '',
        duration: '',
        description: '',
        brand: '',
        director: '',
        cast: '',
        status: 0,
        typeMovie: [],
        url: '',
        releaseTime: 0,
        errors: {},
        isShowLoading: false
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
        if (fileList.length > 2) {
            toast.error("Maximum 2 poster");
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


    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }



    useEffect(() => {

        async function fetchDataTypeMovie() {
            // You can await here
            let dateToday = moment().format('dddd, MMMM Do, YYYY');
            const typeData = await getAllTypeFilms();


            if (typeData && typeData.dataTypeMovie) {

                setAllValues((prevState) => ({
                    ...prevState,
                    dateToday: dateToday,
                    listTypeMovie: typeData.dataTypeMovie
                }));
            }
        }

        let test = youtube_parser('https://youtu.be/UBgPypHGAqE');

        console.log('Link cắt: ', test);

        fetchDataTypeMovie();
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

    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, releaseTime: date[0] })
    }

    const handleSaveFilms = async () => {

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));


        let formatedDate = new Date(allValues.releaseTime).getTime(); // convert timestamp //

        let result = [];

        await Promise.all(valImg.fileList.map(async (item, index) => {
            console.log("Check item: ", item.originFileObj);
            let obj = {};
            obj.image = await getBase64(item.originFileObj);
            obj.fileName = item.name;
            obj.typeImage = item.typeImage
            result.push(obj);
        }))

        let res = await createNewFilmsService({
            name: allValues.name,
            transName: allValues.transName,
            country: allValues.country,
            language: allValues.language,
            duration: allValues.duration,
            description: allValues.description,
            brand: allValues.brand,
            director: allValues.director,
            cast: allValues.cast,
            status: 0,
            typeMovie: typeCheck.typeMovie,
            poster: result,
            url: allValues.url,
            releaseTime: formatedDate,
        })

        if (res && res.errCode == 0) {
            history.push("/films-management")
            toast.success("Add new films succeed");
        } else {
            history.push("/films-management")
            toast.error("Add new films fail");
        }

    }


    const handleClickCheckbox = (e) => {
        // Destructuring
        const { value, checked } = e.target;
        const { typeMovie } = typeCheck;

        console.log(`${value} is ${checked}`);

        // Case 1 : The user checks the box
        if (checked) {
            setUserInfo({
                typeMovie: [...typeMovie, value],
                response: [...typeMovie, value],
            });
            console.log(typeCheck);
        }

        // Case 2  : The user unchecks the box
        else {
            setUserInfo({
                typeMovie: typeMovie.filter((e) => e !== value),
                response: typeMovie.filter((e) => e !== value),
            });
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
                                    <li className="breadcrumb-item"><Link to={`/films-management`}>Quản lý Phim</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Thêm phim</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-1'></div>
                                <div className="col-10">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">Thêm phim mới</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="MainDiv">
                                                <div className="container">

                                                    <Upload
                                                        action={""}
                                                        listType="picture-card"
                                                        fileList={valImg.fileList}
                                                        onPreview={handlePreview}
                                                        beforeUpload={() => {
                                                            /* update state here */
                                                            return false;
                                                        }}
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

                                            <div className="form-group horizon-2-input">
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Tên phim</label>
                                                    <input type="text" className="form-control input-sm" onChange={changeHandler} value={allValues.name} name='name' placeholder="Nhập tên phim" />
                                                </div>
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Tên phiên dịch</label>
                                                    <input type="text" className="form-control input-sm" onChange={changeHandler} value={allValues.transName} name='transName' placeholder="Nhập tên phiên dịch" />
                                                </div>

                                            </div>

                                            <div className="form-group horizon-form">
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Quốc gia</label>
                                                    <input type="text" className="form-control input-sm" name='country' onChange={changeHandler} value={allValues.country} placeholder="Nhập quốc gia" />
                                                </div>
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Thời lượng / phút</label>
                                                    <input type="text" className="form-control input-sm" value={allValues.duration} name='duration' onChange={changeHandler} placeholder="Nhập thời lượng" />
                                                </div>
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Ngôn ngữ</label>
                                                    <input type="text" className="form-control input-sm" value={allValues.language} name='language' onChange={changeHandler} placeholder="Nhập ngôn ngữ" />
                                                </div>
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Ngày công chiếu</label>
                                                    <DatePicker
                                                        onChange={handleOnChangeDatePicker}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group horizon-2-input">
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Đạo diễn</label>
                                                    <input type="text" className="form-control input-sm" value={allValues.director} name='director' onChange={changeHandler} placeholder="Nhập đạo diễn phim" />
                                                </div>
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Nhà sản xuất</label>
                                                    <input type="text" className="form-control input-sm" value={allValues.brand} name='brand' onChange={changeHandler} placeholder="Nhập nhà sản xuất" />
                                                </div>
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Diễn viên</label>
                                                    <input type="text" className="form-control input-sm" value={allValues.cast} name='cast' onChange={changeHandler} placeholder="Nhập diễn viên" />
                                                </div>


                                            </div>
                                            <div className="form-group horizon-2-input">
                                                <div className='horizon-checkbox'>
                                                    <label htmlFor="exampleInputEmail1">Thể loại</label>
                                                    <div className='row' style={{ marginLeft: '0px' }}>
                                                        {allValues.listTypeMovie && allValues.listTypeMovie.length > 0 &&
                                                            allValues.listTypeMovie.map((item, index) => {

                                                                return (
                                                                    <div className="custom-control custom-checkbox col-4" key={index} >
                                                                        <input type="checkbox" className="custom-control-input" name="typeMovie" onChange={((e) => handleClickCheckbox(e))} value={item.id} id={index} />
                                                                        <label className="custom-control-label" for={index}>{item.name}</label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>

                                                </div>
                                                <div className='horizon-input'>
                                                    <label htmlFor="exampleInputEmail1">Trailer</label>
                                                    <input type="text" className="form-control input-sm" value={allValues.url} name='url' onChange={changeHandler} placeholder="Nhập url trailer" />
                                                </div>


                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleFormControlTextarea1">Mô tả phim</label>
                                                <textarea className="form-control" id="exampleFormControlTextarea1" value={allValues.description} name="description" onChange={changeHandler} rows="5"></textarea>
                                            </div>


                                            <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={() => handleSaveFilms()} >
                                                {allValues.isShowLoading &&
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
                                                {!allValues.isShowLoading &&
                                                    <>
                                                        <span className="visually">Submit</span>
                                                    </>
                                                }
                                            </Button>

                                        </div>
                                    </div>

                                </div>
                                <div className='col-1'></div>

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
