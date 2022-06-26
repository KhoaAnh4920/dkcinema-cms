import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { createNewRoom, getAllRoom } from '../../services/RoomService';
import { getAllFilmsByStatus } from '../../services/FilmsServices';
import { getAllSchedule, createNewScheduleService } from '../../services/ScheduleServices';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import './AddSchedule.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import DatePicker from '../../containers/System/Share/DatePicker';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
//Image upload modules
import Select from 'react-select';
import { TimePicker } from 'antd';
import addScheduleImage from '../../assets/add-schedule-image.png';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";






export default function AddSchedule() {
    const [allValues, setAllValues] = useState({
        isShowLoading: false,
        dateSchedule: new Date(),
        premiereDate: new Date().fp_incr(1),
        movieTheaterId: '',
        listRoom: [],
        listMovie: [],
        selectedRoom: {},
        listSchedule: [],
        startTime: '',
        endTime: '',
        selectedMovie: {}
    });
    let history = useHistory();
    let selectUser = useSelector(userState);





    const buildDataInputSelect = (inputData, type) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};

                object.label = item.name;
                object.value = item.id;
                if (type && type === 'MOVIE')
                    object.duration = item.duration
                result.push(object);
            })

        }
        return result;
    }

    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;

        let formatedDate = new Date(allValues.dateSchedule).getTime(); // convert timestamp //

        let obj = {};
        obj.date = formatedDate;
        obj.roomId = stateCopy[stateName].value

        if (stateName === 'selectedRoom') {
            let dataRes = await getAllSchedule(obj);
            console.log("Check res: ", dataRes);
            stateCopy['listSchedule'] = dataRes.data.reverse();
        }



        setAllValues({ ...stateCopy })
    }

    const onChange = (time, timeString) => {


        if (Object.keys(allValues.selectedMovie).length === 0) {
            toast.error("Please select movie first !!");
            return;
        }

        // Tính giờ kết thúc //


        let addEndTime = moment(time, 'DD-MM-YYYY hh:mm:ss').add(allValues.selectedMovie.duration, 'minutes');

        setAllValues((prevState) => ({
            ...prevState,
            startTime: time._d,
            endTime: addEndTime._d
        }))

        console.log("Check allvalues: ", allValues.startTime);


    };

    async function fetchDataRoom(movieTheaterId) {
        // You can await here
        const roomData = await getAllRoom(movieTheaterId);

        let listRoom = buildDataInputSelect(roomData.room);

        if (roomData && roomData.room) {
            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: false,
                dataRoom: roomData.room,
                listRoom: listRoom,
                selectedRoom: listRoom[0] || {}
            }));
        }
    }

    async function fetchDataMovie(status) {
        // You can await here
        const dataMovie = await getAllFilmsByStatus(status);

        console.log("Check phim: ", dataMovie);

        let listMovie = buildDataInputSelect(dataMovie.data, 'MOVIE');

        if (dataMovie && dataMovie.data) {
            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: false,
                listMovie: listMovie
            }));
        }
    }

    async function fetchDataSchedule(data) {
        // You can await here
        let dataRes = await getAllSchedule(data);
        setAllValues((prevState) => ({
            ...prevState,
            listSchedule: dataRes.data.reverse(),
        }))
    }

    const fetchAllData = async (movieTheaterId) => {
        let roomData = await getAllRoom(movieTheaterId);

        if (roomData && roomData.room && roomData.room.length > 0) {
            let t = moment();
            let formatedDate = new Date(t._d).getTime(); // convert timestamp //
            let obj = {};
            obj.date = formatedDate;
            obj.roomId = roomData.room[0].id;

            let listSchedule = await getAllSchedule(obj);
            let listRoom = buildDataInputSelect(roomData.room);

            console.log("listSchedule: ", listSchedule);

            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: false,
                dataRoom: roomData.room,
                listRoom: listRoom,
                selectedRoom: listRoom[0] || {},
                listSchedule: listSchedule.data.reverse(),
            }));
        }

    }


    useEffect(() => {
        let dateToday = moment().format('dddd, MMMM Do, YYYY');

        // Call API get room by movieTheaterId //
        // if (allValues.movieTheaterId !== '') {
        //     fetchDataRoom(allValues.movieTheaterId)
        // }
        fetchDataMovie(1);


        setAllValues((prevState) => ({
            ...prevState,
            dateToday: dateToday
        }))
    }, []);


    useEffect(() => {

        // fetchDataRoom(selectUser.adminInfo.movieTheaterId);



        fetchAllData(selectUser.adminInfo.movieTheaterId)

        // fetchDataSchedule(obj);

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



    const customStyles = {
        // control: base => ({
        //     ...base,
        //     height: 30,
        //     minHeight: 30,
        // }),
        // dropdownIndicator: (styles) => ({
        //     ...styles,
        //     paddingTop: 5,
        //     paddingBottom: 10,
        // }),
        // clearIndicator: (styles) => ({
        //     ...styles,
        //     paddingTop: 7,
        //     paddingBottom: 7,
        // }),
    };




    const handleSubmitSchedule = async () => {

        console.log("Check allvalue: ", allValues);

        let formatedPremiereDate = new Date(allValues.premiereDate).getTime(); // convert timestamp //
        let formatedStartTime = new Date(allValues.startTime).getTime(); // convert timestamp //
        let formatedEndTime = new Date(allValues.endTime).getTime(); // convert timestamp //
        console.log("Check formatedPremiereDate: ", formatedPremiereDate);
        console.log("Check formatedStartTime: ", formatedStartTime);
        console.log("Check formatedEndTime: ", formatedEndTime);


        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));
        let res = await createNewScheduleService({
            movieId: allValues.selectedMovie.value,
            roomId: allValues.selectedRoom.value,
            premiereDate: formatedPremiereDate,
            startTime: formatedStartTime,
            endTime: formatedEndTime
        })

        if (res && res.errCode === 0) {
            toast.success("Add new schedule succeed");
            let formatedDate = new Date(allValues.dateSchedule).getTime(); // convert timestamp //

            let obj = {};
            obj.date = formatedDate;
            obj.roomId = allValues.selectedRoom.value
            let dataRes = await getAllSchedule(obj);
            console.log(dataRes);
            setAllValues((prevState) => ({
                ...prevState,
                startTime: '',
                endTime: '',
                listSchedule: dataRes.data.reverse()
            }))
        } else {
            toast.error(res.errMessage)
        }

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: false
        }));
    }


    const handleOnChangeListSchedule = async (date) => {
        let formatedDate = new Date(date[0]).getTime(); // convert timestamp //

        let obj = {};
        obj.date = formatedDate;
        obj.roomId = allValues.selectedRoom.value;
        let dataRes = await getAllSchedule(obj);


        setAllValues({ ...allValues, dateSchedule: date[0], listSchedule: dataRes.data.reverse() })

    }

    const handleOnChangePremiereTime = async (date) => {
        setAllValues({ ...allValues, premiereDate: date[0], })
    }

    const handleClearData = () => {
        setAllValues((prevState) => ({
            ...prevState,
            startTime: '',
            endTime: '',
            selectedMovie: {}
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
                                    <li className="breadcrumb-item">Quản lý lịch chiếu</li>
                                    <li className="breadcrumb-item active" aria-current="page">Thêm lịch chiếu</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-1'></div>
                                <div className="col-10">
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <h5 className="m-0 font-weight-bold text-primary">Schedule Management</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className='schedule-management'>
                                                <div className='row main-row'>
                                                    <div className='list-schedule col-5'>
                                                        <div className='content-schedule-top'>
                                                            <div className='title-list'>
                                                                <p>List Schedule</p>
                                                            </div>
                                                            <DatePicker
                                                                onChange={handleOnChangeListSchedule}
                                                                className="form-control"
                                                                // minDate="today"
                                                                value={allValues.dateSchedule}
                                                            />
                                                            <Select
                                                                className='room-select'
                                                                value={allValues.selectedRoom}
                                                                onChange={handleChangeSelect}
                                                                options={allValues.listRoom}
                                                                placeholder='Select room'
                                                                name='selectedRoom'
                                                                styles={customStyles}
                                                            // styles={this.props.colourStyles}
                                                            />
                                                        </div>
                                                        <div className='content-schedule-bottom'>
                                                            {allValues && allValues.listSchedule && allValues.listSchedule.length > 0 &&
                                                                allValues.listSchedule.map((item, index) => {
                                                                    return (
                                                                        <div className='data-movie-content' key={index}>
                                                                            <div className='movie-content'>
                                                                                <div className='time-schedule'>
                                                                                    <div className='time-start'>{moment(item.startTime).format("HH:mm")}</div>
                                                                                    <div className='dash-time'>
                                                                                        <div className='dash-left'></div>
                                                                                        <div className='dash-right'></div>
                                                                                    </div>
                                                                                    <div className='time-end'>{moment(item.endTime).format("HH:mm")}</div>
                                                                                </div>
                                                                                <div className='movie-name'>
                                                                                    <p>{item.ShowtimeMovie.name}</p>
                                                                                </div>
                                                                            </div>
                                                                            {index < (allValues.listSchedule.length - 1) &&
                                                                                <div className='waiting-time-content'>
                                                                                    <p>Thời gian chờ: 15 phút</p>
                                                                                </div>
                                                                            }

                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {allValues && allValues.listSchedule && allValues.listSchedule.length === 0 &&
                                                                <div className='data-movie-content'>
                                                                    <div className='movie-content'>
                                                                        <p>No data...</p>
                                                                    </div>
                                                                </div>
                                                            }



                                                        </div>
                                                    </div>
                                                    <div className='form-schedule-container col-7'>
                                                        <div className='title-input-content'>
                                                            <div className='title-update'>
                                                                <div className='row'>
                                                                    <div className='image-content col-4'>
                                                                        <img src={addScheduleImage} className="scheduleImage" />

                                                                    </div>
                                                                    <div className='text-title col-8'>
                                                                        <p className='text'>Update Schedule</p>
                                                                        <p>Please complete all information</p>
                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>
                                                        <div className='form-input-content'>
                                                            <div className="form-group row">
                                                                <label htmlFor="exampleInputEmail1" className='col-4'>Tên phim</label>
                                                                <Select
                                                                    className='movie-select col-8'
                                                                    value={allValues.selectedMovie}
                                                                    onChange={handleChangeSelect}
                                                                    options={allValues.listMovie}
                                                                    placeholder='Select movie'
                                                                    name='selectedMovie'
                                                                    styles={customStyles}
                                                                // styles={this.props.colourStyles}
                                                                />
                                                                {/* <span className='error-code-input'>{allValues.errors["fullName"]}</span> */}

                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="exampleInputEmail1" className='col-4'>Phòng chiếu</label>
                                                                <Select
                                                                    className='movie-select col-8'
                                                                    value={allValues.selectedRoom}
                                                                    onChange={handleChangeSelect}
                                                                    options={allValues.listRoom}
                                                                    placeholder='Select Room'
                                                                    name='selectedRoom'
                                                                    isDisabled
                                                                    styles={customStyles}
                                                                // styles={this.props.colourStyles}
                                                                />
                                                                {/* <span className='error-code-input'>{allValues.errors["fullName"]}</span> */}

                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="exampleInputEmail1" className='col-4'>Ngày chiếu</label>
                                                                <DatePicker
                                                                    onChange={handleOnChangePremiereTime}
                                                                    className="form-control col-8"
                                                                    minDate={new Date().fp_incr(1)}
                                                                    value={allValues.premiereDate}
                                                                />
                                                                {/* <span className='error-code-input'>{allValues.errors["birthday"]}</span> */}
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="exampleInputEmail1" className='col-4'>Giờ bắt đầu</label>
                                                                <TimePicker className='col-4' use12Hours format="h:mm a" name='selectedStartTime' value={(allValues.startTime) ? moment(allValues.startTime, 'h:mm a') : ''} onChange={onChange} />
                                                                <div className='col-4'></div>
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="exampleInputEmail1" className='col-4'>Giờ kết thúc</label>
                                                                <TimePicker className='col-4' use12Hours format="h:mm a" value={(allValues.endTime) ? moment(allValues.endTime, 'h:mm a') : ''} disabled />
                                                                <div className='col-4'></div>
                                                            </div>
                                                            <div className='button-action'>
                                                                <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={handleSubmitSchedule}>
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
                                                                <Button variant="primary" className="delete-schedule-data" onClick={handleClearData}>
                                                                    <span className="visually">Clear</span>
                                                                </Button>
                                                            </div>

                                                        </div>

                                                    </div>


                                                </div>
                                            </div>

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
