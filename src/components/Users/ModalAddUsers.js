import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './ModalAddUsers.scss';
import { CommonUtils } from '../../utils';
import Swal from 'sweetalert2';
import moment from 'moment';
import { getAllRoles, createNewUserService } from '../../services/UserService';
import { getAllMovieTheater, checkMerchantMovieTheater } from '../../services/MovieTheater';
import Select from 'react-select';
import DatePicker from '../../containers/System/Share/DatePicker';
import useLocationForm from "./useLocationForm";
import { useForm } from "react-hook-form";





export default function ModalAddUsers(props) {

    const fileUploader = useRef(null);
    const [allValues, setAllValues] = useState({
        phone: '',
        userName: '',
        email: '',
        password: '',
        userName: '',
        birthday: null,
        address: '',
        listGender: [],
        listRoles: [],
        selectedGender: { value: 1, label: 'Nam' },
        selectedRoles: '',
        selectedMovieTheater: '',
        isShowMovieTheater: true,
        errors: {},
        isShowLoading: false,
        imagePreviewUrl: 'https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png',
        copyListMovieTheater: []
    });

    const { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit } =
        useLocationForm(false);

    const {
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
        async function fetchDataRoles() {
            // You can await here
            const userRoles = await getAllRoles();

            if (userRoles && userRoles.dataRoles) {

                let filterRole = userRoles.dataRoles.filter(item => item.id !== 1);
                let listRoles = buildDataInputSelect(filterRole, 'ROLES');

                setAllValues((prevState) => ({
                    ...prevState,
                    listRoles: listRoles
                }));
            }
        }
        async function fetchDataMovieTheater() {
            // You can await here
            const userMovieTheater = await getAllMovieTheater();

            if (userMovieTheater && userMovieTheater.movie) {
                let listMovieTheater = buildDataInputSelect(userMovieTheater.movie);

                setAllValues((prevState) => ({
                    ...prevState,
                    listMovieTheater: listMovieTheater,
                    copyListMovieTheater: listMovieTheater
                }));
            }
        }
        fetchDataRoles();
        fetchDataMovieTheater()

        let dateToday = moment().format('dddd, MMMM Do, YYYY');
        let listGender = buildDataInputSelect([], 'GENDERS');

        setAllValues((prevState) => ({
            ...prevState,
            listGender: listGender,
            dateToday: dateToday
        }));


    }, []);



    const toggle = () => {
        props.toggleFromParent();
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


        if (stateName === 'selectedRoles' && selectedOption && (selectedOption.value === 2 || selectedOption.value === 3 || selectedOption.value === 5)) {
            if (selectedOption.value === 2) {
                // check if movie theater has merchant //

                let result = [];
                await Promise.all(allValues.copyListMovieTheater.map(async (item, index) => {

                    //   console.log(item)
                    let data = await checkMerchantMovieTheater({
                        movieTheaterId: item.value,
                        roleId: 2
                    })
                    //   console.log('data: ', data);
                    if (data && data.data) {
                        result.push(data.data);
                    }
                }))

                //  console.log('result: ', result);

                let listMovieTheater = buildDataInputSelect(result);

                stateCopy['listMovieTheater'] = listMovieTheater

            } else
                stateCopy['listMovieTheater'] = allValues.copyListMovieTheater;

            stateCopy['isShowMovieTheater'] = false;
        }

        else if (stateName !== 'selectedMovieTheater') {
            stateCopy['isShowMovieTheater'] = true;
            stateCopy['selectedMovieTheater'] = null;
        }



        setAllValues({ ...stateCopy })

    }

    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, birthday: date[0] })
    }

    const changeHandler = e => {
        //   console.log(e.target.value);
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const handleSaveUser = async (data) => {

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let allValuesInput = { ...allValues, selectedCity, selectedDistrict, selectedWard, email: data.email, fullName: data.fullName, password: data.password, phone: data.phone, userName: data.userName };
        //   console.log('allValuesInput: ', allValuesInput)

        // if (!allValuesInput.selectedRoles)
        //     errors.selectedRoles.type = "required"
        props.saveNewUser(allValuesInput);

    }


    return (
        <Modal className={'modal-edit-playlist-user'} isOpen={props.isOpen} toggle={() => toggle()} centered size='xl'>
            <ModalHeader toggle={() => toggle()} className='editdetail'>Thêm người dùng mới</ModalHeader>
            <form onSubmit={handleSubmit(handleSaveUser)}>
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
                                    type="text"
                                    className="form-control input-small"
                                    name='email'
                                    onChange={changeHandler}
                                    {...register("email", {
                                        required: true,
                                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    })}
                                    placeholder="Nhập email" />
                                <input
                                    type="text"
                                    className="form-control input-small"
                                    name='userName'
                                    onChange={changeHandler}
                                    placeholder="Tên đăng nhập"
                                    {...register("userName", {
                                        required: true,
                                    })}
                                />
                            </div>
                            <div className='input-row'>
                                <input type="password"
                                    className="form-control input-small"
                                    name='password'
                                    onChange={changeHandler}
                                    placeholder="Nhập mật khẩu"
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                    })}
                                />
                                <input type="text" className="form-control input-small"
                                    name='fullName'
                                    id='fullName'
                                    onChange={changeHandler}
                                    placeholder="Nhập họ và tên"
                                    {...register("fullName", {
                                        required: true,
                                    })}
                                />
                                <input type="text"
                                    className="form-control input-small"
                                    name='phone'
                                    onChange={changeHandler}
                                    placeholder="Nhập số điện thoại"
                                    {...register("phone", {
                                        required: true,
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
                                        placeholder='Chọn giới tính'
                                        name='selectedGender'
                                    // styles={this.props.colourStyles}
                                    />
                                    <Select
                                        className='role-select'
                                        value={allValues.selectedRoles}
                                        onChange={handleChangeSelect}
                                        options={allValues.listRoles}
                                        placeholder='Chọn phân quyền'
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
                                        placeholder="Tỉnh"
                                        defaultValue={selectedCity}
                                    />
                                    <Select
                                        className='district-select'
                                        name="districtId"
                                        key={`districtId_${selectedDistrict?.value}`}
                                        isDisabled={districtOptions.length === 0}
                                        options={districtOptions}
                                        onChange={(option) => onDistrictSelect(option)}
                                        placeholder="Quận/Huyện"
                                        defaultValue={selectedDistrict}
                                    />
                                    <Select
                                        className='ward-select'
                                        name="wardId"
                                        key={`wardId_${selectedWard?.value}`}
                                        isDisabled={wardOptions.length === 0}
                                        options={wardOptions}
                                        placeholder="Phường/Xã"
                                        onChange={(option) => onWardSelect(option)}
                                        defaultValue={selectedWard}
                                    />
                                </div>
                                <input
                                    type="text"
                                    className="form-control input-small"
                                    name='address' onChange={changeHandler}
                                    placeholder="Nhập địa chỉ" />
                                <Select
                                    className='movieTheater-select'
                                    value={allValues.selectedMovieTheater}
                                    onChange={handleChangeSelect}
                                    options={allValues.listMovieTheater}
                                    placeholder='Chọn rạp chiếu'
                                    name='selectedMovieTheater'
                                    isDisabled={allValues.isShowMovieTheater}
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
                    {/* <Button color="primary" className='btn btn-save-edit' onClick={() => handleSaveUser()}>Save</Button> */}


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
                                <span className="visually">Thêm</span>
                            </>
                        }
                    </Button>


                </ModalFooter>
            </form>
        </Modal>
    )
}
