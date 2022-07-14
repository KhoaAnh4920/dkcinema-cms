import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './ModalAddStaff.scss';
import { CommonUtils } from '../../utils';
import Swal from 'sweetalert2';
import moment from 'moment';
import { getAllRoles, createNewUserService } from '../../services/UserService';
import { getAllMovieTheater, checkMerchantMovieTheater } from '../../services/MovieTheater';
import Select from 'react-select';
import DatePicker from '../../containers/System/Share/DatePicker';
import useLocationForm from "./useLocationForm";



export default function ModalAddStaff(props) {

    // const [isOpen, setOpenModal] = useState(false);
    // const [show, setShow] = useState(false);
    const fileUploader = useRef(null);
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
        selectedMovieTheater: '',
        isShowMovieTheater: true,
        errors: {},
        isShowLoading: false,
        imagePreviewUrl: 'https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png',
        copyListMovieTheater: []
    });

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
        async function fetchDataRoles() {
            // You can await here
            const userRoles = await getAllRoles();

            if (userRoles && userRoles.dataRoles) {

                let filterRole = userRoles.dataRoles.filter(item => item.id !== 1 && item.id !== 2 && item.id !== 4);
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

                let selectedMovieTheater = setDefaultValue(listMovieTheater, props.movieTheaterId);

                setAllValues((prevState) => ({
                    ...prevState,
                    listMovieTheater: listMovieTheater,
                    copyListMovieTheater: listMovieTheater,
                    selectedMovieTheater: selectedMovieTheater
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


    const setDefaultValue = (inputData, value) => {
        let result = inputData.filter(item => item.value === value);
        if (result) {
            return result;
        }
    }

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

        // if (selectedOption && (selectedOption.value === 2 || selectedOption.value === 1))
        //     stateCopy['isShowMovieTheater'] = false;
        // else {
        //     stateCopy['isShowMovieTheater'] = true;
        //     stateCopy['selectedMovieTheater'] = null;
        // }

        // if (stateName === 'selectedRoles' && selectedOption && (selectedOption.value === 2 || selectedOption.value === 3 || selectedOption.value === 5)) {
        //     if (selectedOption.value === 2) {
        //         // check if movie theater has merchant //

        //         let result = [];
        //         await Promise.all(allValues.copyListMovieTheater.map(async (item, index) => {
        //             let data = await checkMerchantMovieTheater({
        //                 movieTheaterId: item.id,
        //                 roleId: 2
        //             })
        //             if (!data) {
        //                 result.push(data);
        //             }
        //         }))

        //         let listMovieTheater = buildDataInputSelect(result);

        //         stateCopy['listMovieTheater'] = listMovieTheater

        //     } else
        //         stateCopy['listMovieTheater'] = allValues.copyListMovieTheater;

        //     stateCopy['isShowMovieTheater'] = false;
        // }

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

    const handleSaveUser = async () => {
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let allValuesInput = { ...allValues, selectedCity, selectedDistrict, selectedWard };
        props.saveNewUser(allValuesInput);

    }


    return (
        <Modal className={'modal-Add-Staff'} isOpen={props.isOpen} toggle={() => toggle()} centered size='xl'>
            <ModalHeader toggle={() => toggle()} className='editdetail'>Add news staff</ModalHeader>
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
                            <input type="text" className="form-control input-small" name='email' onChange={changeHandler} placeholder="Enter Email address" />
                            <input type="text" className="form-control input-small" name='userName' onChange={changeHandler} placeholder="Enter Username" />
                        </div>
                        <div className='input-row'>
                            <input type="password" className="form-control input-small" name='password' onChange={changeHandler} placeholder="Enter Password" />
                            <input type="text" className="form-control input-small" name='fullName' onChange={changeHandler} placeholder="Enter FullName" />
                            <input type="text" className="form-control input-small" name='phone' onChange={changeHandler} placeholder="Enter Phone" />
                            <DatePicker
                                onChange={handleOnChangeDatePicker}
                                className="form-control"
                                value={allValues.birthday}
                                placeholder="Enter dob"
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
                                    defaultValue={selectedCity}
                                />
                                <Select
                                    className='district-select'
                                    name="districtId"
                                    key={`districtId_${selectedDistrict?.value}`}
                                    isDisabled={districtOptions.length === 0}
                                    options={districtOptions}
                                    onChange={(option) => onDistrictSelect(option)}
                                    placeholder="District"
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
                            <input type="text" className="form-control input-small" name='address' onChange={changeHandler} placeholder="Enter Address" />
                            <Select
                                className='movieTheater-select'
                                value={allValues.selectedMovieTheater}
                                onChange={handleChangeSelect}
                                options={allValues.listMovieTheater}
                                isDisabled={true}
                                placeholder='Select movie theater'
                                name='selectedMovieTheater'

                            // styles={this.props.colourStyles}
                            />
                        </div>

                    </div>
                </div>
            </ModalBody>
            <ModalFooter className='modal-footer-container'>
                {/* <Button color="primary" className='btn btn-save-edit' onClick={() => handleSaveUser()}>Save</Button> */}

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


            </ModalFooter>
        </Modal>
    )
}
