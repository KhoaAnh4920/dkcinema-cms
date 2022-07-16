import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Footer from '../../containers/System/Share/Footer';
import Header from '../../containers/System/Share/Header';
import "./AccountProfile.scss";
import useLocationForm from "../Users/useLocationForm";
import DatePicker from '../../containers/System/Share/DatePicker';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { CommonUtils } from '../../utils';
import Swal from 'sweetalert2';
import { userState } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { testFunction } from '../Users/useLocationForm';
import { toast } from 'react-toastify';
import Sidebar from '../../containers/System/Share/Sidebar';
import { getEditUser } from '../../services/UserService';
import { Link } from "react-router-dom";
import { adminLoginSuccess } from '../../redux/userSlice';
import { updateUserService } from '../../services/UserService';





function AccountProfile() {
    const dispatch = useDispatch();
    let selectUser = useSelector(userState);
    const fileUploader = useRef(null);
    const [tabDefault, setTabDefault] = useState({
        isShowTab1: true,
        isShowTab2: false,
    });
    const [allValues, setAllValues] = useState({
        phone: '',
        userName: '',
        email: '',
        fullNameOriginal: '',
        fullName: '',
        address: '',
        listGender: [],
        listRoles: [],
        testCity: { value: 278, label: 'An Giang' },
        selectedGender: '',
        selectedRoles: '',
        districtCode: {},
        cityCode: {},
        wardCode: {},
        address: '',
        selectedMovieTheater: '',
        isShowMovieTheater: true,
        errors: {},
        isShowLoading: false,
        imagePreviewUrl: 'https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png',
        activeTab: 'Tab1'
    });

    const customStyles = {
        input: (provided, state) => ({
            ...provided,
            width: 100,
            height: 20,
            display: 'flex',
            alignItems: 'center',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            marginTop: 2,
        }),
    };

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


    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, birthday: date[0] })
    }


    useEffect(() => {

    }, []);

    const setDefaultValue = (inputData, value) => {
        let result = inputData.filter(item => item.value === value);
        if (result) {
            return result;
        }
    }





    useEffect(() => {
        async function fetchEditUser() {
            const res = await getEditUser(selectUser.adminInfo.id);
            let listGender = buildDataInputSelect([], 'GENDERS');


            // setAllValues((prevState) => ({
            //     ...prevState,
            //     listGender: listGender,
            // }));
            let dataUser = {}
            if (res && res.data) {
                dataUser = res.data
            }


            let selectedGender = setDefaultValue(listGender, (dataUser.gender) ? 1 : 0);

            let location = '';
            if (dataUser.cityCode && dataUser.districtCode && dataUser.wardCode)
                location = await testFunctionParent(dataUser.cityCode, dataUser.districtCode, dataUser.wardCode);

            setAllValues((prevState) => ({
                ...prevState,
                id: dataUser.id,
                fullName: dataUser.fullName,
                fullNameOriginal: dataUser.fullName,
                location: location,
                phone: dataUser.phone,
                email: dataUser.email,
                userName: dataUser.userName,
                imagePreviewUrl: dataUser.avatar,
                address: dataUser.address,
                birthday: dataUser.birthday,
                roleId: dataUser.roleId,
                listGender: listGender,
                selectedGender,
                movietheaterid: selectUser.adminInfo.movietheaterid
            }));

            console.log(allValues);
        }
        async function testFunctionParent(cityCode, districtCode, wardCode) {
            const location = await testFunction(cityCode, districtCode, wardCode);

            if (location)
                return location;
            return null;

        }
        fetchEditUser();

    }, [selectUser]);



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


    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;

        setAllValues({ ...stateCopy })
    }

    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }


    const handleClickSubmit = async () => {
        let allValuesInput = { ...allValues, selectedCity, selectedDistrict, selectedWard };

        // setAllValues({
        //     ...allValues,
        //     isShowLoading: true
        // })
        console.log('allValuesInput: ', allValuesInput)

        let formatedDate = new Date(allValues.birthday).getTime(); // convert timestamp //

        let res = await updateUserService({
            fullName: allValues.fullName,
            birthday: formatedDate,
            phone: allValues.phone,
            gender: allValues.selectedGender.value,
            address: allValues.address,
            avatar: allValues.avatar,
            fileName: allValues.fileName,
            cityCode: selectedCity.value,
            districtCode: selectedDistrict.value,
            wardCode: selectedWard.value,
            roleId: allValues.roleId,
            id: allValues.id
        })

        if (res && res.errCode == 0) {
            // history.push("/users-management")
            toast.success("Cập nhật thành công");
            dispatch(adminLoginSuccess({
                email: allValues.email,
                roleId: allValues.roleId,
                fullName: allValues.fullName,
                avatar: allValues.imagePreviewUrl,
                // externalid: selectUser.adminInfo.externalid,
                phone: allValues.phone,
                // isActive: true,
                id: allValues.id,
                accessToken: selectUser.adminInfo.accessToken,

            }));
        } else {
            // history.push("/users-management")
            toast.error(res.errMessage);
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
                        <div className="col-lg-12 mb-4">

                            <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ padding: '0px 50px' }}>
                                <h5>User Profile</h5>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Profile</li>
                                </ol>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className='profile-main'>

                                <div className='container con-info-u'>
                                    <div className='avatar-user-container'>
                                        <div className='grap-avatar'>
                                            <div className='avatar-main'>
                                                <img className='avatar-user' onClick={handleOpenUploadFile} src={allValues.imagePreviewUrl} />
                                                <input
                                                    id='uploadFile'
                                                    ref={fileUploader}
                                                    accept="image/*"
                                                    hidden type='file'
                                                    onChange={(e) => _handleImageChange(e)}
                                                />
                                            </div>
                                            <button className="btn btn-update-avatar" onClick={handleOpenUploadFile}><i class="fas fa-camera"></i></button>
                                            <div className='name-user'>
                                                <div className='text'>
                                                    <span className='fullname'>{allValues.fullNameOriginal}</span>
                                                    <span className='address-user'>{allValues.email}</span>
                                                    <span className='role-user'>
                                                        {selectUser.adminInfo.roleId === 1 && 'Admin'}
                                                        {selectUser.adminInfo.roleId === 2 && 'Staff Ticket'}
                                                        {selectUser.adminInfo.roleId === 5 && 'Staff Schedule'}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                    <div className='input-form-container'>
                                        <div className='form-main'>

                                            <div className='input-flex' style={{ marginTop: '0px' }}>
                                                <div className='input-content'>
                                                    <label htmlFor="exampleInputEmail1">Username</label>
                                                    <input type="text" className="form-control input-small" onChange={changeHandler} value={allValues.userName} name='userName' placeholder="Email" />
                                                </div>

                                                <div className='input-content'>
                                                    <label htmlFor="exampleInputEmail1">Họ tên</label>
                                                    <input type="text" className="form-control input-small" onChange={changeHandler} value={allValues.fullName} name='fullName' placeholder="Họ tên" />
                                                </div>

                                            </div>
                                            <div className='input-flex'>
                                                <div className='input-content'>
                                                    <label htmlFor="exampleInputEmail1">Số điện thoại</label>
                                                    <input type="text" className="form-control input-small" name='phone' onChange={changeHandler} value={allValues.phone} placeholder="Số điện thoại" />
                                                </div>

                                                <div className='input-content'>
                                                    <label htmlFor="exampleInputEmail1">Giới tính</label>

                                                    <Select
                                                        className='gender-select'
                                                        value={allValues.selectedGender}
                                                        onChange={handleChangeSelect}
                                                        options={allValues.listGender}
                                                        placeholder='Chọn...'
                                                        name='selectedGender'
                                                        styles={customStyles}

                                                    />
                                                </div>
                                                <div className='input-content'>
                                                    <label htmlFor="exampleInputEmail1">Ngày sinh</label>

                                                    <DatePicker
                                                        onChange={handleOnChangeDatePicker}
                                                        className="form-control"
                                                        name="birthday"
                                                        value={allValues.birthday}
                                                    />
                                                </div>

                                            </div>
                                            <div className='input-flex'>
                                                <div className='input-content'>
                                                    <label htmlFor="exampleInputEmail1">Thành phố</label>
                                                    <Select
                                                        className='city-select'
                                                        name="cityId"
                                                        key={`cityId_${selectedCity?.value}`}
                                                        isDisabled={cityOptions.length === 0}
                                                        options={cityOptions}
                                                        onChange={(option) => onCitySelect(option)}
                                                        placeholder="City"
                                                        defaultValue={state.selectedCity}
                                                        styles={customStyles}
                                                    />
                                                </div>

                                                <div className='input-content'>
                                                    <label htmlFor="exampleInputEmail1">Quận</label>
                                                    <Select
                                                        className='district-select'
                                                        name="districtId"
                                                        key={`districtId_${selectedDistrict?.value}`}
                                                        isDisabled={districtOptions.length === 0}
                                                        options={districtOptions}
                                                        onChange={(option) => onDistrictSelect(option)}
                                                        placeholder="District"
                                                        defaultValue={selectedDistrict}
                                                        styles={customStyles}
                                                    />
                                                </div>

                                                <div className='input-content'>
                                                    <label htmlFor="exampleInputEmail1">Phường</label>
                                                    <Select
                                                        className='ward-select'
                                                        name="wardId"
                                                        key={`wardId_${selectedWard?.value}`}
                                                        isDisabled={wardOptions.length === 0}
                                                        options={wardOptions}
                                                        placeholder="Phường/Xã"
                                                        onChange={(option) => onWardSelect(option)}
                                                        defaultValue={selectedWard}
                                                        styles={customStyles}
                                                    />
                                                </div>

                                            </div>
                                            <div className='input-content' style={{ marginTop: '30px' }}>
                                                <label htmlFor="exampleInputEmail1">Địa chỉ</label>
                                                <input type="text" className="form-control input-small" value={allValues.address} onChange={changeHandler} name='address' placeholder="Địa chỉ" />
                                            </div>
                                            <div className='submit-container'>
                                                <Button variant="primary" {...allValues.isShowLoading && 'disabled'} className="btn-update-profile" onClick={handleClickSubmit}  >
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
                                                            <span className="visually">Lưu thay đổi</span>
                                                        </>
                                                    }
                                                </Button>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* Footer */}
                    <Footer />
                    {/* Footer */}
                </div>
            </div >


        </>

    );
}

export default AccountProfile;