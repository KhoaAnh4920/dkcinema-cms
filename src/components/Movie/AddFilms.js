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
import { useForm } from "react-hook-form";





export default function AddFilms() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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


        if (typeCheck.typeMovie.length === 0) {
            toast.error("Vui lòng chọn thể loại phim");
            return;
        }

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));


        let formatedDate = new Date(allValues.releaseTime).getTime(); // convert timestamp //

        let result = [];

        await Promise.all(valImg.fileList.map(async (item, index) => {
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

                                            <form onSubmit={handleSubmit(handleSaveFilms)}>


                                                <div className="form-group horizon-2-input">
                                                    <div className='horizon-input'>
                                                        <label htmlFor="exampleInputEmail1">Tên phim</label>
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"

                                                            name='name'
                                                            placeholder="Nhập tên phim"
                                                            {...register("name", {
                                                                required: true,
                                                                onChange: changeHandler
                                                            })}
                                                        />
                                                    </div>
                                                    <div className='horizon-input'>
                                                        <label htmlFor="exampleInputEmail1">Tên phiên dịch</label>
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"
                                                            name='transName'
                                                            placeholder="Nhập tên phiên dịch"
                                                            onChange={changeHandler}
                                                        />
                                                    </div>

                                                </div>

                                                <div className="form-group horizon-form">
                                                    <div className='horizon-input'>
                                                        <label htmlFor="exampleInputEmail1">Quốc gia</label>
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"
                                                            name='country'
                                                            placeholder="Nhập quốc gia"
                                                            {...register("country", {
                                                                required: true,
                                                                onChange: changeHandler
                                                            })}
                                                        />
                                                    </div>
                                                    <div className='horizon-input'>
                                                        <label htmlFor="exampleInputEmail1">Thời lượng / phút</label>
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"
                                                            name='duration'
                                                            placeholder="Nhập thời lượng"
                                                            {...register("duration", {
                                                                required: true,
                                                                onChange: changeHandler
                                                            })}
                                                        />
                                                    </div>
                                                    <div className='horizon-input'>
                                                        <label htmlFor="exampleInputEmail1">Ngôn ngữ</label>
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"
                                                            name='language'
                                                            placeholder="Nhập ngôn ngữ"
                                                            {...register("language", {
                                                                required: true,
                                                                onChange: changeHandler
                                                            })}
                                                        />
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
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"
                                                            name='director'
                                                            placeholder="Nhập đạo diễn phim"
                                                            {...register("director", {
                                                                required: true,
                                                                onChange: changeHandler
                                                            })}
                                                        />
                                                    </div>
                                                    <div className='horizon-input'>
                                                        <label htmlFor="exampleInputEmail1">Nhà sản xuất</label>
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"
                                                            name='brand'
                                                            placeholder="Nhập nhà sản xuất"
                                                            {...register("brand", {
                                                                required: true,
                                                                onChange: changeHandler
                                                            })}
                                                        />
                                                    </div>
                                                    <div className='horizon-input'>
                                                        <label htmlFor="exampleInputEmail1">Diễn viên</label>
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"
                                                            name='cast'
                                                            placeholder="Nhập diễn viên"
                                                            {...register("cast", {
                                                                required: true,
                                                                onChange: changeHandler
                                                            })}
                                                        />
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
                                                        <input
                                                            type="text"
                                                            className="form-control input-sm"
                                                            name='url'
                                                            placeholder="Nhập url trailer"
                                                            {...register("url", {
                                                                required: true,
                                                                onChange: changeHandler
                                                            })}
                                                        />
                                                    </div>


                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="exampleFormControlTextarea1">Mô tả phim</label>
                                                    <textarea
                                                        className="form-control"
                                                        id="exampleFormControlTextarea1"
                                                        name="description"
                                                        {...register("description", {
                                                            required: true,
                                                            onChange: changeHandler
                                                        })}
                                                        rows="5"></textarea>
                                                </div>




                                                {Object.keys(errors).length !== 0 && (
                                                    <ul className="error-container">
                                                        {errors.name?.type === "required" && <li>Name Theater is required</li>}
                                                        {errors.transName?.type === "required" && <li>TransName is required</li>}
                                                        {errors.country?.type === "required" && <li>Country is required</li>}
                                                        {errors.duration?.type === "required" && <li>Duration is required</li>}
                                                        {errors.language?.type === "required" && <li>Language is required</li>}
                                                        {errors.director?.type === "required" && <li>Director is required</li>}
                                                        {errors.brand?.type === "required" && <li>Brand is required</li>}
                                                        {errors.cast?.type === "required" && <li>Cast is required</li>}
                                                        {errors.url?.type === "required" && <li>Url is required</li>}
                                                        {errors.description?.type === "required" && <li>Description is required</li>}
                                                    </ul>
                                                )}


                                                <Button variant="primary" type='submit' {...allValues.isShowLoading && 'disabled'} >
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


                                            </form>

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
