import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { createNewRoom } from '../../services/RoomService';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import './AddRoom.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
//Image upload modules
import Select from 'react-select';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";
import { Link } from "react-router-dom";




export default function AddRoom() {
    const [allValues, setAllValues] = useState({
        name: '',
        movieTheaterId: '',
        errors: {},
        listAlpha: [],
        listSeet: [],
        isShowLoading: false,
        numberOfColumn: '',
        numberOfRow: '',
        numberSeet: '',
    });
    let history = useHistory();
    let selectUser = useSelector(userState);

    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


    const buildDataInputSelect = (inputData) => {
        let result = [];
        alphabet.map((item, index) => {
            if (index < inputData) {
                let obj = {};

                obj.label = item;
                obj.value = index;
                result.push(obj);
            }
        })


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


    }, []);

    useEffect(() => {

        setAllValues((prevState) => ({
            ...prevState,
            movieTheaterId: selectUser.adminInfo.movieTheaterId
        }));


    }, [selectUser]);

    const checkValidateInput = () => {
        let isValid = true;
        let errors = {};
        let arrInput = ['email', 'password', 'name', 'fullName', 'birthday', 'phone', 'selectedGender', 'selectedRoles', 'address']
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



    const changeHandler = (e, type) => {
        if (type) {
            let listAlpha = buildDataInputSelect(e.target.value);
            console.log("Check listAlpha: ", listAlpha);

            setAllValues({ ...allValues, [e.target.name]: e.target.value, listAlpha: listAlpha, selectedColumn: { label: 'A', value: 0 } })
        }
        else
            setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }


    const handleAddSeet = () => {
        if (+allValues.numberSeet > +allValues.numberOfRow) {
            toast.error("The number of seats exceeds the limit");
            return;
        }

        let objSeet = {};
        let posOfColumn = allValues.selectedColumn.value;
        let posOfRow = [];
        let listSeet = allValues.listSeet;
        for (let i = 0; i < +allValues.numberSeet; i++) {
            let obj = {};
            obj.pos = i;
            obj.typeId = 1;
            posOfRow.push(obj);
        }
        objSeet.posOfColumn = posOfColumn;
        objSeet.posOfRow = posOfRow;

        console.log("objSeet: ", objSeet);
        listSeet.push(objSeet);
        setAllValues((prevState) => ({
            ...prevState,
            listSeet,
            selectedColumn: allValues.listAlpha[posOfColumn + 1]
        }));
    }

    const handleDeleteDiagam = () => {
        setAllValues({
            listAlpha: [],
            listSeet: [],
            isShowLoading: false,
            numberOfColumn: '',
            numberOfRow: '',
            numberSeet: ''
        })
    }

    const handleSaveRoom = async () => {
        console.log("allValues: ", allValues);
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));
        let res = await createNewRoom({
            numberOfColumn: +allValues.numberOfColumn,
            numberOfRow: +allValues.numberOfRow,
            name: allValues.name,
            movieTheaterId: allValues.movieTheaterId,
            seets: allValues.listSeet
        })

        if (res && res.errCode == 0) {
            history.push("/room-management")
            toast.success("Add new room succeed");
        } else {
            history.push("/room-management")
            toast.error("Add new room fail");
        }


    }

    const handleClickSeet = (item1, item2) => {

        let listSeet = JSON.parse(JSON.stringify(allValues.listSeet));


        console.log("item1: ", item1);


        let objIndexList = listSeet.findIndex((obj => obj.posOfColumn == item1.posOfColumn));


        let objIndexDetail = listSeet[objIndexList].posOfRow.findIndex((obj => obj.pos === item2.pos));



        if (listSeet[objIndexList].posOfRow[objIndexDetail].typeId === 1) {
            listSeet[objIndexList].posOfRow[objIndexDetail].typeId = 2;
            let obj = {};

            obj.posOfColumn = listSeet[objIndexList].posOfColumn;
            obj.posOfRow = listSeet[objIndexList].posOfRow[objIndexDetail];


            setAllValues((prevState) => ({
                ...prevState,
                listSeet: listSeet,
            }));

        } else {

            listSeet[objIndexList].posOfRow[objIndexDetail].typeId = 1;


            setAllValues((prevState) => ({
                ...prevState,
                listSeet: listSeet,
            }));

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
                                    <li className="breadcrumb-item"><Link to={`/room-management`}>Quản lý phòng chiếu</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Thêm phòng chiếu</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-1'></div>
                                <div className="col-10">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">Add new Room</h5>
                                        </div>
                                        <div className="card-body">

                                            <div className='room-container'>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Tên phòng chiếu</label>
                                                    <input type="text" className="form-control input-sm" name='name' onChange={(e) => changeHandler(e)} placeholder="Enter name" />

                                                    {/* <span className='error-code-input'>{allValues.errors["name"]}</span> */}

                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputPassword1">Số lượng hàng</label>
                                                    <input type="text" className="form-control input-sm" value={allValues.numberOfColumn} readOnly={(allValues.listSeet.length > 0) ? true : false} name='numberOfColumn' onChange={(e) => changeHandler(e, 'column')} placeholder="Enter column" />

                                                    {/* <span className='error-code-input'>{allValues.errors["password"]}</span> */}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputPassword1">Số lượng cột</label>
                                                    <input type="text" className="form-control input-sm" value={allValues.numberOfRow} readOnly={(allValues.listSeet.length > 0) ? true : false} name='numberOfRow' onChange={(e) => changeHandler(e)} placeholder="Enter phone" />
                                                    {/* <span className='error-code-input'>{allValues.errors["password"]}</span> */}
                                                </div>
                                            </div>

                                            <div className='seet-container'>
                                                <div className='title-main'>Thiết kế sơ đồ phòng chiếu</div>
                                                <div className='row'>
                                                    <div className='room-seet col-9'>
                                                        { /* EXAMPLE MAP INTERGRATE*/}

                                                        <div className='row_chair col-lg-12'>
                                                            <div className='chair'>
                                                                {allValues.listSeet && allValues.listSeet.length > 0 &&
                                                                    allValues.listSeet.map((item, index) => {
                                                                        return (
                                                                            <div className='one_row' key={index}>
                                                                                <p className='name-column'>{alphabet[item.posOfColumn]}</p>
                                                                                {
                                                                                    item.posOfRow.map((item2, index2) => {
                                                                                        if (item2.typeId === 2)
                                                                                            return (<p className='seet-item active' key={index2} onClick={() => handleClickSeet(item, item2)}>{item2.pos + 1}</p>);
                                                                                        else
                                                                                            return (<p className='seet-item' key={index2} onClick={() => handleClickSeet(item, item2)}>{item2.pos + 1}</p>);
                                                                                    })
                                                                                }
                                                                                <p className='name-column'>{alphabet[item.posOfColumn]}</p>
                                                                            </div>
                                                                        )
                                                                    })

                                                                }


                                                            </div>

                                                        </div>
                                                        <div className='sreen-room'>
                                                            <div className='text'>
                                                                <p>Màn hình</p>
                                                                <p className='line'></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='room-info col-3'>
                                                        <div className="form-group">
                                                            <label htmlFor="exampleInputEmail1">Tên hàng ghế</label>
                                                            {/* <input type="text" className="form-control input-sm" name='nameSeet' placeholder="Enter name" /> */}
                                                            <Select
                                                                className='gender-select'
                                                                value={allValues.selectedColumn}
                                                                isDisabled={true}
                                                                // value={allValues.selectedAlpha}
                                                                onChange={handleChangeSelect}
                                                                options={allValues.listAlpha}
                                                                placeholder='Select name column'
                                                                name='selectedColumn'
                                                            // styles={this.props.colourStyles}
                                                            />

                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="exampleInputEmail1">Số lượng ghế</label>
                                                            <input type="number" max={allValues.numberOfRow} value={allValues.numberSeet} min={1} className="form-control input-sm" onChange={(e) => changeHandler(e)} name='numberSeet' placeholder="Enter number" />

                                                        </div>
                                                        <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={handleAddSeet}>
                                                            <span className="visually">Thêm hàng ghế</span>
                                                        </Button>

                                                        <div className='info-seet-container'>
                                                            <div className='seet-default'>
                                                                <p className='color-default'></p>
                                                                <p className='name-seet'>Ghế thường</p>
                                                            </div>

                                                            <div className='seet-vip'>
                                                                <p className='color-vip'></p>
                                                                <p className='name-seet'>Ghế Vip</p>
                                                            </div>

                                                        </div>

                                                        <div className='button-sumit-seet-container'>
                                                            <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={handleSaveRoom}>
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
                                                                        <span className="visually">Lưu sơ đồ</span>
                                                                    </>
                                                                }
                                                            </Button>
                                                            <Button variant="primary" {...allValues.isShowLoading && 'disabled'} className="delete-diagram-seet" onClick={handleDeleteDiagam}>
                                                                <span className="visually">Xóa sơ đồ</span>
                                                            </Button>
                                                        </div>

                                                        {/* <div className="form-group">
                                                    <label htmlFor="exampleInputPassword1">Số lượng hàng</label>
                                                    <input type="text" className="form-control input-sm" name='soDienThoai' onChange={changeHandler} placeholder="Enter phone" />
                                                    
                                                </div> */}
                                                    </div>
                                                </div>
                                            </div>





                                            {/* <button
                                                type="submit"
                                                onClick={() => handleSaveMovieTheater()}
                                                className="btn btn-primary btn-submit">Submit</button> */}

                                            {/* <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={() => handleSaveMovieTheater()}>
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
                                            </Button> */}

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
