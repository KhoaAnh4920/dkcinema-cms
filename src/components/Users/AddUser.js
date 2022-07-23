import React, { useState, useEffect } from 'react';
import AdminMenu from '../../containers/System/Share/AdminMenu';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllRoles, createNewUserService } from '../../services/UserService';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import Select from 'react-select';
import './AddUser.scss';
import useLocationForm from "./useLocationForm";
import DatePicker from '../../containers/System/Share/DatePicker';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";



export default function AddUser() {
    const [startDate, setStartDate] = useState(new Date());
    const [allValues, setAllValues] = useState({
        phone: '',
        userName: '',
        email: '',
        password: '',
        userName: '',
        address: '',
        listGender: [],
        listRoles: [],
        selectedGender: '',
        selectedRoles: '',
        errors: {},
        isShowLoading: false
    });
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


    const buildDataInputSelect = (inputData, type) => {
        let result = [];
        if (type === 'GENDERS') {
            result = [
                { value: 1, label: 'Nam' },
                { value: 0, label: 'Nữ' },
            ];
        }
        if (inputData && inputData.length > 0) {
            if (type === 'ROLES') {
                inputData.map((item, index) => {
                    let object = {};

                    object.label = item.rolesName;
                    object.value = item.id;
                    result.push(object);
                })
            }

        }
        return result;
    }

    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;
        setAllValues({ ...stateCopy })
    }


    useEffect(() => {
        async function fetchDataRoles() {
            // You can await here
            const userRoles = await getAllRoles();

            if (userRoles && userRoles.dataRoles) {
                let listRoles = buildDataInputSelect(userRoles.dataRoles, 'ROLES');

                setAllValues((prevState) => ({
                    ...prevState,
                    listRoles: listRoles
                }));
            }
        }
        fetchDataRoles();

        let dateToday = moment().format('dddd, MMMM Do, YYYY');
        let listGender = buildDataInputSelect([], 'GENDERS');

        setAllValues((prevState) => ({
            ...prevState,
            listGender: listGender,
            dateToday: dateToday
        }));


    }, []);

    const checkValidateInput = () => {
        let isValid = true;
        let errors = {};
        let arrInput = ['email', 'password', 'userName', 'fullName', 'birthday', 'phone', 'selectedGender', 'selectedRoles', 'address']
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


    const handleSaveUser = async () => {


        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let isValid = checkValidateInput();
        console.log("Check state: ", allValues);
        if (isValid) {
            let formatedDate = new Date(allValues.birthday).getTime(); // convert timestamp //
            console.log("Check formatedDate: ", formatedDate);

            let res = await createNewUserService({
                email: allValues.email,
                password: allValues.password,
                fullName: allValues.fullName,
                birthday: formatedDate,
                phone: allValues.phone,
                gender: allValues.selectedGender.value,
                roleId: allValues.selectedRoles.value,
                userName: allValues.userName,
                address: allValues.address,
                avatar: allValues.avatar,
                fileName: allValues.fileName,
                cityCode: selectedCity.value,
                districtCode: selectedDistrict.value,
                wardCode: selectedWard.value
            })

            if (res && res.errCode == 0) {
                history.push("/users-management")
                toast.success("Thêm người dùng mới thành công");
            } else {
                history.push("/users-management")
                toast.error("Thêm thất bại");
            }
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
                                            <h5 className="m-0 font-weight-bold text-primary">Thêm người dùng mới</h5>
                                        </div>
                                        <div className="card-body">

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Email address</label>
                                                <input
                                                    type="text"
                                                    className="form-control input-sm"
                                                    name='email'
                                                    onChange={changeHandler}
                                                    placeholder="Enter Email" />
                                                <small id="emailHelp" className="form-text text-muted">We'll never share your
                                                    email with anyone else.</small>

                                                <span className='error-code-input'>{allValues.errors["email"]}</span>

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Username</label>
                                                <input type="text" className="form-control input-sm" name='userName' onChange={changeHandler} placeholder="Enter Username" />

                                                <span className='error-code-input'>{allValues.errors["userName"]}</span>

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Password</label>
                                                <input type="password" className="form-control input-sm" name='password' onChange={changeHandler} placeholder="Password" />
                                                <span className='error-code-input'>{allValues.errors["password"]}</span>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">FullName</label>
                                                <input type="text" className="form-control input-sm" name='fullName' onChange={changeHandler} placeholder="Fullname" />
                                                <span className='error-code-input'>{allValues.errors["fullName"]}</span>

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Phone</label>
                                                <input type="text" className="form-control input-sm" name='phone' onChange={changeHandler} placeholder="Phone" />
                                                <span className='error-code-input'>{allValues.errors["phone"]}</span>

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Birthday</label>
                                                <DatePicker
                                                    onChange={handleOnChangeDatePicker}
                                                    className="form-control"
                                                    value={allValues.birthday}
                                                />
                                                <span className='error-code-input'>{allValues.errors["birthday"]}</span>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Avatar</label>
                                                <div className="custom-file">
                                                    <input type="file"
                                                        className="custom-file-input"
                                                        onChange={(e) => _handleImageChange(e)}
                                                        id="customFile" />
                                                    <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                                                </div>
                                                <div className="imgPreview">
                                                    {allValues.imagePreviewUrl && <img src={allValues.imagePreviewUrl} />}
                                                    {!allValues.imagePreviewUrl && <div className="previewText">Please select an Image for Preview</div>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Gender</label>
                                                <Select
                                                    className='gender-select'
                                                    value={allValues.selectedGender}
                                                    onChange={handleChangeSelect}
                                                    options={allValues.listGender}
                                                    placeholder='Select gender'
                                                    name='selectedGender'
                                                // styles={this.props.colourStyles}
                                                />
                                                <span className='error-code-input'>{allValues.errors["selectedGender"]}</span>

                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Roles</label>
                                                <Select
                                                    value={allValues.selectedRoles}
                                                    onChange={handleChangeSelect}
                                                    options={allValues.listRoles}
                                                    placeholder='Select roles'
                                                    name='selectedRoles'
                                                // styles={this.props.colourStyles}
                                                />
                                                <span className='error-code-input'>{allValues.errors["selectedRoles"]}</span>

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
                                                <span className='error-code-input'>{allValues.errors["address"]}</span>

                                            </div>


                                            {/* <button
                                                type="submit"
                                                onClick={() => handleSaveUser()}
                                                className="btn btn-primary btn-submit">Submit</button> */}

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Address</label>
                                                <input type="text" className="form-control input-sm" name='address' onChange={changeHandler} placeholder="Address" />
                                                <span className='error-code-input'>{allValues.errors["address"]}</span>

                                            </div>

                                            <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={() => handleSaveUser()}>
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
