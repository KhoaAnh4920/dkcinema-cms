import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { editMovieTheater } from '../../services/MovieTheater';
import { getAllMovieTheater, getEditMovieTheater } from '../../services/MovieTheater';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import Select from 'react-select';
import './EditMovieTheater.scss';
import { removeImageMovieTheater } from '../../services/MovieTheater';
import DatePicker from '../../containers/System/Share/DatePicker';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import useLocationForm from "../Users/useLocationForm";
import { getUserByRole } from '../../services/UserService';
import { testFunction } from '../Users/useLocationForm';
//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";





export default function EditMovieTheater() {
    const [startDate, setStartDate] = useState(new Date());
    const [allValues, setAllValues] = useState({
        soDienThoai: '',
        tenRap: '',
        address: '',
        errors: {},
        // listUser: [],
        // selectedUser: '',
        isShowLoading: false,
        id: 1
    });
    const [valImg, setValImg] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    })
    let history = useHistory();
    let { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit } =
        useLocationForm(false);


    let {
        cityOptions,
        districtOptions,
        wardOptions,
        selectedCity,
        selectedDistrict,
        selectedWard,
    } = state;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const { id } = useParams();


    //Uploaded url
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }



    useEffect(() => {
        async function fetchDataMovieTheater() {
            // You can await here

            //  const userData = await getUserByRole(2);
            const movieTheaterData = await getAllMovieTheater();
            const movieTheaterEdit = await getEditMovieTheater(id);

            if (movieTheaterEdit && movieTheaterEdit.data) {
                const location = await testFunctionParent(movieTheaterEdit.data.cityCode, movieTheaterEdit.data.districtCode, movieTheaterEdit.data.wardCode);

                // let isFounded = userData.data.filter(function (o1) {

                //     return !movieTheaterData.movie.some(function (o2) {
                //         if (o1.id !== movieTheaterEdit.data.userId)
                //             return o1.id === o2.userId;
                //     });
                // });

                //let listUser = buildDataInputSelect(isFounded);
                //  let selectedUser = setDefaultValue(listUser, movieTheaterEdit.data.userId);

                let result = [];
                if (movieTheaterEdit.data.MovieTheaterImage && movieTheaterEdit.data.MovieTheaterImage.id) {

                    movieTheaterEdit.data.MovieTheaterImage.map((item, index) => {
                        let obj = {};
                        obj.uid = item.id;
                        obj.name = item.public_id;
                        obj.public_id = item.public_id;
                        obj.status = 'done';
                        obj.url = item.url;
                        result.push(obj);
                    })
                }

                let defaultValues = {};
                defaultValues.tenRap = movieTheaterEdit.data.tenRap;
                defaultValues.soDienThoai = movieTheaterEdit.data.tenRap;
                defaultValues.address = movieTheaterEdit.data.address;

                setAllValues((prevState) => ({
                    ...prevState,
                    tenRap: movieTheaterEdit.data.tenRap,
                    soDienThoai: movieTheaterEdit.data.soDienThoai,
                    address: movieTheaterEdit.data.address,
                    // listUser: listUser,
                    location: location,
                    // selectedUser: selectedUser,
                    id: id
                }));

                setValImg((prevState) => ({
                    ...prevState,
                    fileList: result
                }));

                reset({ ...defaultValues });

            }



            async function testFunctionParent(cityCode, districtCode, wardCode) {
                const location = await testFunction(cityCode, districtCode, wardCode);

                if (location)
                    return location;
                return null;

            }
        }
        fetchDataMovieTheater();

        // let dateToday = moment().format('dddd, MMMM Do, YYYY');
        // let listGender = buildDataInputSelect([], 'GENDERS');

        // setAllValues((prevState) => ({
        //     ...prevState,
        //     listGender: listGender,
        //     dateToday: dateToday
        // }));


    }, []);

    useEffect(() => {


        if (allValues.location && allValues.location.cityOptions) {

            state.cityOptions = allValues.location.cityOptions;
            state.districtOptions = allValues.location.districtOptions;
            state.wardOptions = allValues.location.wardOptions;
            state.selectedCity = allValues.location.selectedCity;
            state.selectedDistrict = allValues.location.selectedDistrict;
            state.selectedWard = allValues.location.selectedWard;


            setAllValues((prevState) => ({
                ...prevState
            }));
        }
    }, [allValues.location])

    const checkValidateInput = () => {
        let isValid = true;
        let errors = {};
        let arrInput = ['email', 'password', 'tenRap', 'fullName', 'birthday', 'phone', 'selectedGender', 'selectedRoles', 'address']
        for (let i = 0; i < arrInput.length; i++) {
            // this.state[arrInput[i]] == this.state.email or this.state.password
            if (!allValues[arrInput[i]]) {
                isValid = false;
                errors[arrInput[i]] = "Cannot be empty";
            }
        }

        if (!isValid) {
            Swal.fire({
                title: 'Missing data?',
                text: "Vui lòng điền đầy đủ thông tin!",
                icon: 'warning',
            })

            setAllValues((prevState) => ({
                ...prevState,
                errors: errors,
                isShowLoading: false
            }));
        }
        return isValid;
    }


    const handleSaveEditMovieTheater = async () => {

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let result = [];

        await Promise.all(valImg.fileList.map(async (item, index) => {
            let obj = {};
            if (item.originFileObj) {
                console.log("Check item: ", item.originFileObj);
                obj.image = await getBase64(item.originFileObj);
                obj.fileName = item.name;
            } else {
                obj.url = item.url;
                obj.public_id = item.public_id;
            }

            result.push(obj);
        }))

        console.log("Chec res: ", result);


        let res = await editMovieTheater({
            tenRap: allValues.tenRap,
            soDienThoai: allValues.soDienThoai,
            address: allValues.address,
            cityCode: selectedCity.value,
            districtCode: selectedDistrict.value,
            wardCode: selectedWard.value,
            // userId: allValues.selectedUser.value,
            cityCode: selectedCity.value,
            districtCode: selectedDistrict.value,
            wardCode: selectedWard.value,
            id: allValues.id,
            listImage: result,
        })

        if (res && res.errCode == 0) {
            history.push("/movieTheater-management")
            toast.success("Update movie theater success");
        } else {
            history.push("/movieTheater-management")
            toast.error("Update fail");
        }

    }


    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, birthday: date[0] })
    }

    const _handleImageChange = async (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        /*------------ Duck ------------*/
        if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            Swal.fire({
                title: 'Missing data?',
                text: "Sai định dạng ảnh!",
                icon: 'warning',
            })
        }
        /*------------ Duck ------------*/

        else if (file) {
            let base64 = await CommonUtils.getBase64(file);
            reader.onloadend = () => {
                setAllValues({
                    ...allValues,
                    file: file,
                    imagePreviewUrl: reader.result,
                    avatar: base64,
                    fileName: file.name
                })
            }

            reader.readAsDataURL(file)
        }


    }

    const setDefaultValue = (inputData, value) => {
        let result = inputData.filter(item => item.value === value);
        if (result) {
            return result;
        }
    }

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
        if (fileList.length > 0 && fileList[fileList.length - 1].originFileObj) {
            const isJpgOrPng = fileList[fileList.length - 1].type === 'image/jpeg' || fileList[fileList.length - 1].type === 'image/png';
            console.log(isJpgOrPng);
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

        console.log('item remove: ', e);

        let res = await removeImageMovieTheater(e.uid);
        // setValImg((prevState) => ({
        //     ...prevState,
        //     fileList
        // }));
    }





    return (

        <>

            <div id="wrapper">
                {/* Sidebar */}

                <Sidebar />

                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column edit-movie-theater">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}
                        {/* Container Fluid*/}
                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">

                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>
                                    <li className="breadcrumb-item"><Link to={`/movieTheater-management`}>Quản lý rạp</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Cập nhật rạp</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-3'></div>
                                <div className="col-6">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">Edit MovieTheater</h5>
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
                                            <form onSubmit={handleSubmit(handleSaveEditMovieTheater)}>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Tên rạp chiếu</label>
                                                    <input type="text"
                                                        className="form-control input-sm"
                                                        name='tenRap'
                                                        // value={allValues.tenRap}
                                                        placeholder="Enter name"
                                                        {...register("tenRap", {
                                                            required: true,
                                                            onChange: changeHandler
                                                        })}
                                                    />



                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputPassword1">Số điện thoại</label>
                                                    <input
                                                        type="text"
                                                        className="form-control input-sm"
                                                        name='soDienThoai'

                                                        placeholder="Enter phone"
                                                        {...register("soDienThoai", {
                                                            required: true,
                                                            onChange: changeHandler
                                                        })}
                                                    />

                                                </div>


                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">City</label>
                                                    <Select
                                                        name="cityId"
                                                        key={`cityId_${selectedCity?.value}`}
                                                        isDisabled={true}
                                                        options={cityOptions}
                                                        onChange={(option) => onCitySelect(option)}
                                                        placeholder="City"
                                                        defaultValue={selectedCity}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">District</label>
                                                    <Select
                                                        name="districtId"
                                                        key={`districtId_${selectedDistrict?.value}`}
                                                        isDisabled={true}
                                                        options={districtOptions}
                                                        onChange={(option) => onDistrictSelect(option)}
                                                        placeholder="District"
                                                        defaultValue={selectedDistrict}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Ward</label>
                                                    <Select
                                                        name="wardId"
                                                        key={`wardId_${selectedWard?.value}`}
                                                        isDisabled={true}
                                                        options={wardOptions}
                                                        placeholder="Phường/Xã"
                                                        onChange={(option) => onWardSelect(option)}
                                                        defaultValue={selectedWard}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control input-sm"
                                                        name='address'

                                                        placeholder="Address"
                                                        {...register("address", {
                                                            required: true,
                                                            onChange: changeHandler
                                                        })}
                                                    />

                                                </div>


                                                {Object.keys(errors).length !== 0 && (
                                                    <ul className="error-container">
                                                        {errors.tenRap?.type === "required" && <li>Name Theater is required</li>}
                                                        {errors.soDienThoai?.type === "required" && <li>Phone number is required</li>}
                                                        {errors.address?.type === "required" && <li>Address is required</li>}
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
