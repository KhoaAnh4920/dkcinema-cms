import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import Select from 'react-select';
import './EditFilms.scss';
import DatePicker from '../../containers/System/Share/DatePicker';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import { getAllTypeFilms } from '../../services/FilmsServices';
import { updateFilmsService, getDetailFilm, removeImageFilm } from '../../services/FilmsServices';
import { useParams } from 'react-router-dom';
//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';


//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";






export default function EditFilms() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

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
        ImageOfMovie: [],
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
    const [typeCheck, setTypeMovie] = useState({
        typeMovie: [],
        response: [],
    });
    let history = useHistory();
    const { id } = useParams();


    const handleCancel = ({ fileList }) => {
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

                    if (width >= height) {
                        fileList[fileList.length - 1].typeImage = 1; // Hình ngang 
                    } else
                        fileList[fileList.length - 1].typeImage = 2; // Hình dọc
                });
            });
            const isJpgOrPng = fileList[fileList.length - 1].type === 'image/jpeg' || fileList[fileList.length - 1].type === 'image/png';

            if (!isJpgOrPng) {
                toast.error("Please choose image");
                return;
            }
        }



        setValImg((prevState) => ({
            ...prevState,
            fileList
        }));
    }


    const handleRemove = async (e) => {

        if (e.public_id && typeof (e.uid) !== 'string') {
            let res = await removeImageFilm(e.uid);

            if (res && res.errCode === 0) {
                toast.success("Delete image succeed !!!");
                let fileList = valImg.fileList.filter(item => item.uid !== e.uid)

                setValImg((prevState) => ({
                    ...prevState,
                    fileList
                }));
            }

            else
                toast.error(res.errMessage);
        } else {
            setValImg((prevState) => ({
                ...prevState,
            }));
        }

    }

    const buildDataInputSelect = (inputData, type) => {
        let result = [];
        if (type === 'STATUS') {
            result = [
                { value: 0, label: 'Sắp chiếu', isdisabled: true },
                { value: 1, label: 'Khởi chiếu' },
                { value: 2, label: 'Ngừng chiếu' },
            ];
        }
        return result;
    }



    useEffect(() => {
        async function fetchDetailMovie() {
            let dataMovie = await getDetailFilm(id);
            const typeData = await getAllTypeFilms();


            if (dataMovie && dataMovie.data) {

                let result = [];
                dataMovie.data.ImageOfMovie.map((item, index) => {
                    let obj = {};
                    obj.uid = item.id;
                    obj.name = item.public_id;
                    obj.public_id = item.public_id;
                    obj.status = 'done';
                    obj.url = item.url;
                    result.push(obj);
                })

                let checked = [];
                typeData.dataTypeMovie.map((item, index) => {
                    dataMovie.data.MovieOfType.map((x, y) => {
                        if (item.id === x.id) {

                            checked[index] = true;
                        } else {

                            if (checked[index] !== true)
                                checked[index] = false;
                        }
                    })
                })

                let test = [];
                dataMovie.data.MovieOfType.map((item, index) => {
                    test.push(item.id);
                })

                let listStatus = buildDataInputSelect([], 'STATUS');

                let selectedStatus = setDefaultValue(listStatus, dataMovie.data.status);

                let defaultValues = {};
                defaultValues.name = dataMovie.data.name;
                defaultValues.soDienThoai = dataMovie.data.tenRap;
                defaultValues.address = dataMovie.data.address;
                defaultValues.transName = dataMovie.data.transName;
                defaultValues.country = dataMovie.data.country;
                defaultValues.duration = dataMovie.data.duration;
                defaultValues.language = dataMovie.data.language;
                defaultValues.releaseTime = dataMovie.data.releaseTime;
                defaultValues.brand = dataMovie.data.brand;
                defaultValues.director = dataMovie.data.director;
                defaultValues.cast = dataMovie.data.cast;
                defaultValues.status = dataMovie.data.status;
                defaultValues.description = dataMovie.data.description;
                defaultValues.listTypeMovie = typeData.dataTypeMovie;
                defaultValues.url = dataMovie.data.url;



                let formatDate = moment().format("DD/MM/YYYY")
                let now = new Date().toLocaleDateString('vi-VN', { weekday: "long" });
                let dateToday = now + ', ' + formatDate


                setAllValues({
                    MovieOfType: dataMovie.data.MovieOfType,
                    id: id,
                    name: dataMovie.data.name,
                    transName: dataMovie.data.transName,
                    country: dataMovie.data.country,
                    duration: dataMovie.data.duration,
                    language: dataMovie.data.language,
                    releaseTime: dataMovie.data.releaseTime,
                    brand: dataMovie.data.brand,
                    director: dataMovie.data.director,
                    cast: dataMovie.data.cast,
                    listStatus: listStatus,
                    status: dataMovie.data.status,
                    description: dataMovie.data.description,
                    listTypeMovie: typeData.dataTypeMovie,
                    url: dataMovie.data.url,
                    selectedStatus: selectedStatus,
                    checked: checked,
                    dateToday: dateToday
                })

                setValImg((prevState) => ({
                    ...prevState,
                    fileList: result
                }));

                setTypeMovie({
                    typeMovie: test,
                    response: test,
                });

                reset({ ...defaultValues });

            }
        }
        fetchDetailMovie();



    }, []);

    const setDefaultValue = (inputData, value) => {
        let result = inputData.filter(item => item.value === value);
        if (result) {
            return result;
        }
    }

    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;
        setAllValues({ ...stateCopy })

    }



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

    const handleSaveEditFilms = async () => {

        // Lọc check type //
        let arrType = [];

        for (let i = 0; i < allValues.listTypeMovie.length; i++) {
            if (allValues.checked[i]) {
                arrType.push({ id: allValues.listTypeMovie[i].id })
            }
        }

        if (arrType.length === 0) {
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
            if (item.originFileObj) {
                obj.image = await getBase64(item.originFileObj);
                obj.fileName = item.name;
                obj.typeImage = item.typeImage
            } else {
                obj.url = item.url;
                obj.public_id = item.public_id;
            }

            result.push(obj);
        }))

        // console.log('result: ', result)

        let res = await updateFilmsService({
            name: allValues.name,
            transName: allValues.transName,
            country: allValues.country,
            language: allValues.language,
            duration: allValues.duration,
            description: allValues.description,
            brand: allValues.brand,
            director: allValues.director,
            cast: allValues.cast,
            status: allValues.selectedStatus.value,
            typeMovie: arrType,
            poster: result,
            url: allValues.url,
            releaseTime: formatedDate,
            id: allValues.id
        })

        if (res && res.errCode == 0) {
            history.push("/films-management")
            toast.success("Edit films succeed");
        } else {
            history.push("/films-management")
            toast.error(res.errMessage);
        }

    }


    const handleClickCheckbox = (e) => {
        // Destructuring
        const { value, checked } = e.target;
        const { typeMovie } = typeCheck;


        // Case 1 : The user checks the box
        if (checked) {

            let response = allValues.checked.map((item, index) => {
                if (index === +e.target.id) {
                    item = !item;
                    return item;
                }
                return item;

            })

            setTypeMovie({
                typeMovie: [...typeMovie, value],
                response: [...typeMovie, value],
            });

            setAllValues((prevState) => ({
                ...prevState,
                checked: response
            }));
        }

        // Case 2  : The user unchecks the box
        else {
            let response = allValues.checked.map((item, index) => {
                if (index === +e.target.id) {
                    item = !item;
                    return item;
                }
                return item;

            })

            setTypeMovie({
                typeMovie: typeMovie.filter((e) => e !== value),
                response: typeMovie.filter((e) => e !== value),
            });

            setAllValues((prevState) => ({
                ...prevState,
                checked: response
            }));
        }

        // console.log("Check type: ", typeCheck);

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
                                    <li className="breadcrumb-item active" aria-current="page">Cập nhật phim</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-1'></div>
                                <div className="col-10">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">Cập nhật phim</h5>
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
                                                        onRemove={(e) => handleRemove(e)}
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

                                            <form onSubmit={handleSubmit(handleSaveEditFilms)}>


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
                                                            value={allValues.transName}
                                                        />
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
                                                            value={allValues.releaseTime}
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
                                                            {/* <input type="checkbox" className="custom-control-input" checked id="customCheck3" /> */}

                                                            {allValues.listTypeMovie && allValues.listTypeMovie.length > 0 && allValues.MovieOfType &&
                                                                allValues.listTypeMovie.map((item, index) => {

                                                                    return (
                                                                        <div className="custom-control custom-checkbox col-4" key={index}>
                                                                            <input type="checkbox" className="custom-control-input" checked={allValues.checked[index]} onChange={((e) => handleClickCheckbox(e))} name="typeMovie" value={item.id} id={index} />
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
                                                <div className='form-group horizon-2-input'>
                                                    <div className='horizon-input'>
                                                        <label htmlFor="exampleFormControlTextarea1">Trạng thái</label>
                                                        <Select
                                                            className='status-movie-select'
                                                            value={allValues.selectedStatus}
                                                            onChange={handleChangeSelect}
                                                            options={allValues.listStatus}
                                                            placeholder='Select status'
                                                            name='selectedStatus'
                                                            isOptionDisabled={(option) => option.isdisabled} // disable an option
                                                        // styles={this.props.colourStyles}
                                                        />
                                                    </div>
                                                    <div className='horizon-input'></div>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="exampleFormControlTextarea1">Mô tả phim</label>
                                                    <textarea className="form-control" id="exampleFormControlTextarea1" value={allValues.description} name="description" onChange={changeHandler} rows="5"></textarea>
                                                </div>


                                                {Object.keys(errors).length !== 0 && (
                                                    <ul className="error-container">
                                                        {errors.name?.type === "required" && <li>Name Theater is required</li>}

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


                                                <Button variant="primary" type='submit' {...allValues.isShowLoading && 'disabled'}>
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
