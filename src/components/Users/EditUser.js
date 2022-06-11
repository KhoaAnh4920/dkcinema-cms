import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllRoles, updateUserService, getEditUser } from '../../services/UserService';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import Select from 'react-select';
import './EditUser.scss';
import { useParams } from 'react-router-dom';
import useLocationForm from "./useLocationForm";
import Sidebar from '../../containers/System/Share/Sidebar';
import DatePicker from '../../containers/System/Share/DatePicker';
import { CommonUtils } from '../../utils';
import { testFunction } from './useLocationForm';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';




export default function EditUser() {
    const [allValues, setAllValues] = useState({
        phone: '',
        userName: '',
        email: '',
        password: '',
        listGender: [],
        listRoles: [],
        testCity: { value: 278, label: 'An Giang' },
        selectedGender: '',
        selectedRoles: '',
        id: 1,
        districtCode: {},
        cityCode: {},
        wardCode: {},
        isShowLoading: false,
        errors: {},
    });
    let history = useHistory();
    const { id } = useParams();

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


        async function fetchEditUser() {
            // You can await here
            let dataUser = await getEditUser(id);

            if (dataUser && dataUser.data) {

                // Fetch location //
                const location = await testFunctionParent(dataUser.data.cityCode, dataUser.data.districtCode, dataUser.data.wardCode);


                console.log("Check location: ", location);
                let listGender = buildDataInputSelect([], 'GENDERS');
                let listRoles = [];
                let dataRoles = await getAllRoles();
                let dateToday = moment().format('dddd, MMMM Do, YYYY');


                if (dataRoles)
                    listRoles = buildDataInputSelect(dataRoles.dataRoles, 'ROLES');

                let selectedGender = setDefaultValue(listGender, (dataUser.data.gender) ? 1 : 0);
                let selectedRoles = setDefaultValue(listRoles, dataUser.data.UserRoles.id);



                // const testDis = districtOptions.filter(item => item.value === )

                setAllValues({
                    listRoles,
                    listGender,
                    selectedGender,
                    selectedRoles,
                    phone: dataUser.data.phone,
                    email: dataUser.data.email,
                    userName: dataUser.data.userName,
                    fullName: dataUser.data.fullName,
                    birthday: dataUser.data.birthday,
                    imagePreviewUrl: dataUser.data.avatar,
                    address: dataUser.data.address,
                    id,
                    location: location,
                    dateToday: dateToday
                })
            }
        }

        async function testFunctionParent(cityCode, districtCode, wardCode) {
            const location = await testFunction(cityCode, districtCode, wardCode);

            if (location)
                return location;
            return null;

        }

        fetchEditUser();

    }, []);

    useEffect(() => {


        if (allValues.location && allValues.location.cityOptions) {
            //     cityOptions,
            // districtOptions,
            // wardOptions,
            // selectedCity,
            // selectedDistrict,
            // selectedWard,
            console.log('allValues.location.cityOptions: ', allValues.location.cityOptions);
            state.cityOptions = allValues.location.cityOptions;
            state.districtOptions = allValues.location.districtOptions;
            state.wardOptions = allValues.location.wardOptions;
            state.selectedCity = allValues.location.selectedCity;
            state.selectedDistrict = allValues.location.selectedDistrict;
            state.selectedWard = allValues.location.selectedWard;



            console.log('selectedCity: ', state.selectedCity);

            setAllValues((prevState) => ({
                ...prevState
            }));
        }
    }, [allValues.location])





    const setDefaultValue = (inputData, value) => {
        let result = inputData.filter(item => item.value === value);
        if (result) {
            return result;
        }
    }

    const checkValidateInput = () => {
        let isValid = true;
        let errors = {};
        let arrInput = ['email', 'userName', 'fullName', 'birthday', 'phone', 'selectedGender', 'selectedRoles', 'address']
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



    const handleEditUser = async () => {

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let isValid = checkValidateInput();
        console.log("Check state: ", allValues);
        if (isValid) {
            let formatedDate = new Date(allValues.birthday).getTime(); // convert timestamp //

            let res = await updateUserService({
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
                wardCode: selectedWard.value,
                id: allValues.id,
            })

            if (res && res.errCode == 0) {
                history.push("/users-management")
                toast.success("Cập nhật thành công");
            } else {
                history.push("/users-management")
                toast.error("Cập nhật thất bại");
            }
        }
    }

    const handleOnChangeDatePicker = (date) => {
        console.log(date[0]);
        setAllValues({ ...allValues, birthday: date[0] })
    }


    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
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
                                    <li className="breadcrumb-item active" aria-current="page">Cập nhật người dùng</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                            </div>
                            <div className="row">
                                <div className='col-3'></div>
                                <div className="col-6">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">Edit usser</h5>
                                        </div>
                                        <div className="card-body">

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Email address</label>
                                                <input type="text" readOnly className="form-control input-sm" value={allValues.email} name='email' onChange={changeHandler} placeholder="Enter Email" />
                                                <small id="emailHelp" className="form-text text-muted">We'll never share your
                                                    email with anyone else.</small>

                                                {/* <span className='error-code-input'>{allValues.errors["email"]}</span> */}

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Username</label>
                                                <input type="text" className="form-control input-sm" value={allValues.userName} name='userName' onChange={changeHandler} placeholder="Enter Username" />

                                                {/* <span className='error-code-input'>{allValues.errors["userName"]}</span> */}

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">FullName</label>
                                                <input type="text" value={allValues.fullName} className="form-control input-sm" name='fullName' onChange={changeHandler} placeholder="Fullname" />
                                                {/* <span className='error-code-input'>{allValues.errors["fullName"]}</span> */}

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Phone</label>
                                                <input type="text" value={allValues.phone} className="form-control input-sm" name='phone' onChange={changeHandler} placeholder="Phone" />
                                                {/* <span className='error-code-input'>{allValues.errors["phone"]}</span> */}

                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Birthday</label>
                                                <DatePicker
                                                    onChange={handleOnChangeDatePicker}
                                                    className="form-control"
                                                    value={allValues.birthday}
                                                />
                                                {/* <span className='error-code-input'>{allValues.errors["birthday"]}</span> */}
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
                                                {/* <span className='error-code-input'>{allValues.errors["selectedGender"]}</span> */}

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
                                                {/* <span className='error-code-input'>{allValues.errors["selectedRoles"]}</span> */}

                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">City</label>
                                                {console.log("Check in select: ", selectedCity)}
                                                <Select
                                                    name="cityId"
                                                    key={`cityId_${selectedCity?.value}`}
                                                    isDisabled={cityOptions.length === 0}
                                                    options={cityOptions}
                                                    onChange={(option) => onCitySelect(option)}
                                                    placeholder="City"
                                                    defaultValue={state.selectedCity}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">District</label>
                                                <Select
                                                    name="districtId"
                                                    key={`districtId_${state.selectedDistrict?.value}`}
                                                    isDisabled={state.districtOptions.length === 0}
                                                    options={state.districtOptions}
                                                    onChange={(option) => onDistrictSelect(option)}
                                                    placeholder="District"
                                                    defaultValue={state.selectedDistrict}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Ward</label>
                                                <Select
                                                    name="wardId"
                                                    key={`wardId_${state.selectedWard?.value}`}
                                                    isDisabled={state.wardOptions.length === 0}
                                                    options={state.wardOptions}
                                                    placeholder="Phường/Xã"
                                                    onChange={(option) => onWardSelect(option)}
                                                    defaultValue={state.selectedWard}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Address</label>
                                                <input type="text" className="form-control input-sm" value={allValues.address} name='address' onChange={changeHandler} placeholder="Address" />
                                                {/* <span className='error-code-input'>{allValues.errors["address"]}</span> */}

                                            </div>

                                            {/* <button
                                                type="submit"
                                                onClick={() => handleEditUser()}
                                                className="btn btn-primary btn-submit">Submit</button> */}


                                            <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={() => handleEditUser()}>
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
