import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './ModalAddUsers.scss';
import { CommonUtils } from '../../utils';
import Swal from 'sweetalert2';
import moment from 'moment';
import { getAllRoles, createNewUserService } from '../../services/UserService';
import Select from 'react-select';
import DatePicker from '../../containers/System/Share/DatePicker';
import useLocationForm from "./useLocationForm";
import { testFunction } from './useLocationForm';
import { getAllMovieTheater } from '../../services/MovieTheater';
import { useForm } from "react-hook-form";




export default function ModalEditUsers(props) {

    // const [isOpen, setOpenModal] = useState(false);
    // const [show, setShow] = useState(false);
    const fileUploader = useRef(null);
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
        selectedMovieTheater: '',
        districtCode: {},
        cityCode: {},
        wardCode: {},
        address: '',
        isShowLoading: false,
        isShowMovieTheater: true,
        errors: {},
        imagePreviewUrl: 'https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png'
    });

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
    } = useForm();


    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

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
            } else {
                inputData.map((item, index) => {
                    let object = {};

                    object.label = item.tenRap;
                    object.value = item.id;
                    result.push(object);
                })
            }

        }
        return result;
    }



    useEffect(() => {
        async function fetchEditUser() {
            if (props.dataUser) {
                let dataUser = props.dataUser;
                let location = [];
                if (dataUser.cityCode && dataUser.districtCode && dataUser.wardCode) {
                    location = await testFunctionParent(dataUser.cityCode, dataUser.districtCode, dataUser.wardCode);
                }
                // const location = await testFunctionParent(dataUser.cityCode, dataUser.districtCode, dataUser.wardCode);
                let listGender = buildDataInputSelect([], 'GENDERS');
                let listRoles = [];
                let listMovieTheater = [];
                let dataRoles = await getAllRoles();
                let dataMovieTheater = await getAllMovieTheater();
                let dateToday = moment().format('dddd, MMMM Do, YYYY');
                if (dataRoles)
                    listRoles = buildDataInputSelect(dataRoles.dataRoles, 'ROLES');
                if (dataMovieTheater)
                    listMovieTheater = buildDataInputSelect(dataMovieTheater.movie);

                let selectedGender = setDefaultValue(listGender, (dataUser.gender) ? 1 : 0);
                let selectedRoles = setDefaultValue(listRoles, dataUser.UserRoles.id);

                let selectedMovieTheater = '';
                let isShowMovieTheater = true;
                if (((dataUser.UserMovieTheater && dataUser.UserMovieTheater.id) || dataUser.UserRoles.id === 2 || dataUser.UserRoles.id === 3)) {
                    selectedMovieTheater = setDefaultValue(listMovieTheater, dataUser.UserMovieTheater.id);
                    isShowMovieTheater = false;
                }



                setAllValues({
                    listRoles,
                    listGender,
                    listMovieTheater,
                    selectedGender,
                    selectedRoles,
                    selectedMovieTheater,
                    phone: dataUser.phone,
                    email: dataUser.email,
                    userName: dataUser.userName,
                    fullName: dataUser.fullName,
                    birthday: dataUser.birthday,
                    imagePreviewUrl: dataUser.avatar,
                    address: dataUser.address,
                    location: location,
                    dateToday: dateToday,
                    isShowMovieTheater
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



    const toggle = () => {
        props.toggleFromParentEditUser();
    }

    const handleOpenUploadFile = () => {
        fileUploader.current.click();
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

    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };



        stateCopy[stateName] = selectedOption;

        // if (stateName === 'selectedRoles' && selectedOption && (selectedOption.value === 2 || selectedOption.value === 3 ))
        //     stateCopy['isShowMovieTheater'] = false;
        // else if (stateName !== 'selectedMovieTheater') {
        //     stateCopy['isShowMovieTheater'] = true;
        //     stateCopy['selectedMovieTheater'] = null;
        // }

        setAllValues({ ...stateCopy })

    }

    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, birthday: date[0] })
    }

    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const handleSaveEditUser = async () => {
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let allValuesInput = { ...allValues, selectedCity, selectedDistrict, selectedWard };
        props.saveEditUser(allValuesInput);

        // let isValid = this.checkValidateInput();
        // if (isValid) {

        //     this.props.saveEditPlaylist(this.state);

        // }

    }


    return (
        <Modal className={'modal-edit-playlist-user'} isOpen={props.isOpen} toggle={() => toggle()} centered size='xl'>
            <ModalHeader toggle={() => toggle()} className='editdetail'>Sửa thông tin người dùng</ModalHeader>
            <form onSubmit={handleSubmit(handleSaveEditUser)}>
                <ModalBody className='modal-body-container'>
                    <div className='modal-playlist-body'>
                        <div className='image-edit-playlist'>
                            <img className='image-playlist' onClick={handleOpenUploadFile} src={allValues.imagePreviewUrl} />
                            <input
                                id='uploadFile'
                                ref={fileUploader}
                                accept="image/*"
                                hidden type='file'
                                onChange={(e) => _handleImageChange(e)}
                            />
                        </div>
                        <div className='input-container'>
                            <div className='input-flex'>
                                <input
                                    type="email"
                                    className="form-control input-small"
                                    name='email' readOnly value={allValues.email}

                                    placeholder="Enter Email address" />
                                <input type="text" className="form-control input-small" name='userName' readOnly value={allValues.userName} placeholder="Enter Username" />
                            </div>
                            <div className='input-row'>
                                <input
                                    type="text"
                                    className="form-control input-small"
                                    name='fullName'

                                    placeholder="Nhập họ và tên"
                                    {...register("fullName", {
                                        required: true,
                                        onChange: changeHandler
                                    })}
                                />
                                <input
                                    type="text"
                                    className="form-control input-small"
                                    name='phone'

                                    placeholder="Nhập số điện thoại"
                                    {...register("phone", {
                                        required: true,
                                        onChange: changeHandler
                                    })}
                                />
                                <DatePicker
                                    onChange={handleOnChangeDatePicker}
                                    className="form-control"
                                    value={allValues.birthday}
                                    placeholder="Nhập ngày sinh"
                                />
                                <div className='input-flex'>
                                    <Select
                                        className='gender-select'
                                        value={allValues.selectedGender}
                                        onChange={handleChangeSelect}
                                        options={allValues.listGender}
                                        placeholder='Select gender'
                                        name='selectedGender'
                                    // styles={this.props.colourStyles}
                                    />
                                    <Select
                                        className='role-select'
                                        value={allValues.selectedRoles}
                                        onChange={handleChangeSelect}
                                        options={allValues.listRoles}
                                        isDisabled={true}
                                        placeholder='Select roles'
                                        name='selectedRoles'
                                    // styles={this.props.colourStyles}
                                    />
                                </div>
                                <div className='input-flex'>
                                    <Select
                                        className='city-select'
                                        name="cityId"
                                        key={`cityId_${selectedCity?.value}`}
                                        isDisabled={cityOptions.length === 0}
                                        options={cityOptions}
                                        onChange={(option) => onCitySelect(option)}
                                        placeholder="City"
                                        defaultValue={state.selectedCity}
                                    />
                                    <Select
                                        className='district-select'
                                        name="districtId"
                                        key={`districtId_${state.selectedDistrict?.value}`}
                                        isDisabled={state.districtOptions.length === 0}
                                        options={state.districtOptions}
                                        onChange={(option) => onDistrictSelect(option)}
                                        placeholder="District"
                                        defaultValue={state.selectedDistrict}
                                    />
                                    <Select
                                        className='ward-select'
                                        name="wardId"
                                        key={`wardId_${state.selectedWard?.value}`}
                                        isDisabled={state.wardOptions.length === 0}
                                        options={state.wardOptions}
                                        placeholder="Phường/Xã"
                                        onChange={(option) => onWardSelect(option)}
                                        defaultValue={state.selectedWard}
                                    />
                                </div>
                                <input
                                    type="text"
                                    className="form-control input-small"
                                    name='address'
                                    value={allValues.address}
                                    onChange={changeHandler}
                                    placeholder="Nhập địa chỉ" />
                                <Select
                                    className='movieTheater-select'
                                    value={allValues.selectedMovieTheater}
                                    onChange={handleChangeSelect}
                                    options={allValues.listMovieTheater}
                                    isDisabled={true}

                                    placeholder='Chọn rạp chiếu'
                                    name='selectedMovieTheater'
                                // styles={this.props.colourStyles}
                                />
                            </div>

                            {Object.keys(errors).length !== 0 && (
                                <ul className="error-container">
                                    {errors.userName?.type === "required" && <li>User Name is required</li>}
                                    {errors.password?.type === "required" && (
                                        <li>Password is required</li>
                                    )}
                                    {errors.password?.type === "minLength" && (
                                        <li>Password must be 6 characters long</li>
                                    )}
                                    {errors.email?.type === "required" && <li>Email is required</li>}
                                    {errors.email?.type === "pattern" && <li>Invalid Email Address</li>}
                                    {errors.fullName?.type === "required" && <li>Full Name is required</li>}
                                    {errors.phone?.type === "required" && <li>Phone is required</li>}
                                </ul>
                            )}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className='modal-footer-container'>
                    {/* <Button color="primary" className='btn btn-save-edit' onClick={() => handleSaveEditUser()}>Save</Button> */}

                    <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={() => handleSaveEditUser()}>
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


                </ModalFooter>
            </form>
        </Modal>
    )
}
