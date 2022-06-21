import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { createNewMovieTheater, getAllMovieTheater } from '../../services/MovieTheater';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import Select from 'react-select';
import './AddMovieTheater.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import useLocationForm from "../Users/useLocationForm";
import { getUserByRole } from '../../services/UserService';
//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import "antd/dist/antd.css";


export default function AddMovieTheater() {
    const [startDate, setStartDate] = useState(new Date());
    const [allValues, setAllValues] = useState({
        soDienThoai: '',
        tenRap: '',
        address: '',
        errors: {},
        listUser: [],
        selectedUser: '',
        isShowLoading: false
    });
    const [valImg, setValImg] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    })
    let history = useHistory();
    const { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit } =
        useLocationForm(true);

    const {
        cityOptions,
        districtOptions,
        wardOptions,
        selectedCity,
        selectedDistrict,
        selectedWard,
    } = state;


    const buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {

            inputData.map((item, index) => {
                let object = {};

                object.label = item.fullName;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;
        setAllValues({ ...stateCopy })

        console.log("Check state: ", allValues);
    }


    useEffect(() => {
        async function fetchDataUser() {
            // You can await here

            const userData = await getUserByRole(2);
            const movieTheaterData = await getAllMovieTheater();


            console.log("userData: ", userData.data);
            console.log("movieTheaterData: ", movieTheaterData.movie);

            if (userData && userData.data) {
                let isFounded = userData.data.filter(o1 => !movieTheaterData.movie.some(o2 => o1.id === o2.userId));
                console.log("Check: ", isFounded);

                let listUser = buildDataInputSelect(isFounded);

                setAllValues((prevState) => ({
                    ...prevState,
                    listUser: listUser,
                }));

            }
        }
        fetchDataUser();

        // let dateToday = moment().format('dddd, MMMM Do, YYYY');
        // let listGender = buildDataInputSelect([], 'GENDERS');

        // setAllValues((prevState) => ({
        //     ...prevState,
        //     listGender: listGender,
        //     dateToday: dateToday
        // }));


    }, []);

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


    const handleSaveMovieTheater = async () => {

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let result = [];

        await Promise.all(valImg.fileList.map(async (item, index) => {
            console.log("Check item: ", item.originFileObj);
            let obj = {};
            obj.image = await getBase64(item.originFileObj);
            obj.fileName = item.name;
            result.push(obj);
        }))

        let res = await createNewMovieTheater({
            tenRap: allValues.tenRap,
            soDienThoai: allValues.soDienThoai,
            address: allValues.address,
            cityCode: selectedCity.value,
            districtCode: selectedDistrict.value,
            wardCode: selectedWard.value,
            userId: allValues.selectedUser.value,
            listImage: result,
        })

        if (res && res.errCode == 0) {
            history.push("/movieTheater-management")
            toast.success("Add new movie theater success");
        } else {
            history.push("/movieTheater-management")
            toast.error("Add fail");
        }
    }


    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, birthday: date[0] })
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
        setValImg((prevState) => ({
            ...prevState,
            fileList
        }));
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
                                    <li className="breadcrumb-item"><a href="./">Home</a></li>
                                    <li className="breadcrumb-item">Quản lý người dùng</li>
                                    <li className="breadcrumb-item active" aria-current="page">Thêm người dùng</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-3'></div>
                                <div className="col-6">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">Add new MovieTheater</h5>
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
                                                <label htmlFor="exampleInputEmail1">Tên rạp chiếu</label>
                                                <input type="text" className="form-control input-sm" name='tenRap' onChange={changeHandler} placeholder="Enter name" />

                                                {/* <span className='error-code-input'>{allValues.errors["tenRap"]}</span> */}

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Số điện thoại</label>
                                                <input type="text" className="form-control input-sm" name='soDienThoai' onChange={changeHandler} placeholder="Enter phone" />
                                                {/* <span className='error-code-input'>{allValues.errors["password"]}</span> */}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Quản lý rạp</label>
                                                <Select
                                                    className='gender-select'
                                                    value={allValues.selectedUser}
                                                    onChange={handleChangeSelect}
                                                    options={allValues.listUser}
                                                    placeholder='Select manage'
                                                    name='selectedGender'
                                                // styles={this.props.colourStyles}
                                                />
                                                {/* <span className='error-code-input'>{allValues.errors["selectedGender"]}</span> */}

                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">City</label>
                                                <Select
                                                    name="cityId"
                                                    key={`cityId_${selectedCity?.value}`}
                                                    isDisabled={cityOptions.length === 0}
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
                                                    isDisabled={districtOptions.length === 0}
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
                                                    isDisabled={wardOptions.length === 0}
                                                    options={wardOptions}
                                                    placeholder="Phường/Xã"
                                                    onChange={(option) => onWardSelect(option)}
                                                    defaultValue={selectedWard}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Address</label>
                                                <input type="text" className="form-control input-sm" name='address' onChange={changeHandler} placeholder="Address" />
                                                {/* <span className='error-code-input'>{allValues.errors["address"]}</span> */}

                                            </div>


                                            {/* <button
                                                type="submit"
                                                onClick={() => handleSaveMovieTheater()}
                                                className="btn btn-primary btn-submit">Submit</button> */}

                                            <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={() => handleSaveMovieTheater()}>
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
