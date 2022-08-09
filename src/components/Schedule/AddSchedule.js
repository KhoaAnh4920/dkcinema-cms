import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllRoom } from '../../services/RoomService';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
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
import { Link } from "react-router-dom";






export default function AddSchedule() {
    const [allValues, setAllValues] = useState({
        isShowLoading: true,
        isShowLoadingButton: false,
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
        obj.movieTheaterId = allValues.movieTheaterId

        if (stateName === 'selectedRoom') {
            let listSchedule = await getAllSchedule(obj);

            if (listSchedule && listSchedule.data) {
                listSchedule = listSchedule.data.reverse();
                // console.log('listSchedule: ', listSchedule)
                listSchedule.map((item, index) => {
                    if (index < (listSchedule.length - 1)) {
                        let newDateEndTime = new Date(item.endTime);
                        // console.log('newDateEndTime: ', newDateEndTime)

                        let test2 = moment(newDateEndTime).format("HH:mm:ss a");
                        let startTime = moment(listSchedule[index + 1].startTime).format("HH:mm:ss a");

                        // console.log("end: ", test2)
                        // console.log('startTime: ', startTime);

                        var startTime2 = moment(test2, 'HH:mm:ss a');
                        var endTime2 = moment(startTime, 'HH:mm:ss a');

                        let duration = endTime2.diff(startTime2, 'minutes');

                        item.duration = duration;

                        return item;
                    }
                })
            }


            //  console.log("Check res: ", listSchedule);
            stateCopy['listSchedule'] = (listSchedule) ? listSchedule : [];

            // console.log("Check res: ", stateCopy['listSchedule']);
        }



        setAllValues({ ...stateCopy })
    }

    const onChange = (time, timeString) => {


        if (Object.keys(allValues.selectedMovie).length === 0) {
            toast.error("Chọn phim đầu tiên !!");
            return;
        }

        // Tính giờ kết thúc //


        let addEndTime = moment(time, 'DD-MM-YYYY hh:mm:ss').add(allValues.selectedMovie.duration, 'minutes');

        setAllValues((prevState) => ({
            ...prevState,
            startTime: (time && time._d) ? time._d : null,
            endTime: (addEndTime && addEndTime._d) ? addEndTime._d : null
        }))

        // console.log("Check allvalues: ", allValues.startTime);


    };

    const fetchAllData = async (movieTheaterId, status) => {
        let roomData = await getAllRoom(movieTheaterId);
        const dataMovie = await getAllFilmsByStatus(status);

        let listMovie = [];
        if (dataMovie && dataMovie.data) {
            listMovie = buildDataInputSelect(dataMovie.data, 'MOVIE');
        }

        if (roomData && roomData.room && roomData.room.length > 0) {
            let t = moment();
            let formatedDate = new Date(t._d).getTime(); // convert timestamp //
            let obj = {};
            obj.date = formatedDate;
            obj.roomId = roomData.room[0].id;
            obj.movieTheaterId = movieTheaterId;

            let listSchedule = await getAllSchedule(obj);
            let listRoom = buildDataInputSelect(roomData.room);

            if (listSchedule && listSchedule.data) {
                listSchedule = listSchedule.data.reverse();
                //  console.log('listSchedule: ', listSchedule)
                listSchedule.map((item, index) => {
                    if (index < (listSchedule.length - 1)) {
                        let newDateEndTime = new Date(item.endTime);
                        //  console.log('newDateEndTime: ', newDateEndTime)

                        let test2 = moment(newDateEndTime).format("HH:mm:ss a");
                        let startTime = moment(listSchedule[index + 1].startTime).format("HH:mm:ss a");

                        // console.log("end: ", test2)
                        // console.log('startTime: ', startTime);

                        var startTime2 = moment(test2, 'HH:mm:ss a');
                        var endTime2 = moment(startTime, 'HH:mm:ss a');

                        let duration = endTime2.diff(startTime2, 'minutes');

                        item.duration = duration;

                        return item;
                    }
                })
            }

            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: false,
                dataRoom: roomData.room,
                listRoom: listRoom,
                selectedRoom: listRoom[0] || {},
                listSchedule: listSchedule,
                listMovie: listMovie,
                movieTheaterId: movieTheaterId
            }));
        }

    }


    useEffect(() => {

        let formatDate = moment().format("DD/MM/YYYY")
        let now = new Date().toLocaleDateString('vi-VN', { weekday: "long" });
        let dateToday = now + ', ' + formatDate

        setAllValues((prevState) => ({
            ...prevState,
            dateToday: dateToday
        }))
    }, []);


    useEffect(() => {

        fetchAllData(selectUser.adminInfo.movietheaterid, 1)

        setAllValues((prevState) => ({
            ...prevState,
            movieTheaterId: selectUser.adminInfo.movietheaterid
        }));


    }, [selectUser]);





    const targetHeight = 32;

    const customStyles = {
        control: (base) => ({
            ...base,
            minHeight: 'initial',
        }),
        valueContainer: (base) => ({
            ...base,
            height: `${targetHeight - 1 - 1}px`,
            padding: '0 8px',
        }),
        clearIndicator: (base) => ({
            ...base,
            padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
        }),
    };




    const handleSubmitSchedule = async () => {

        // console.log("Check allvalue: ", allValues);

        if (!allValues.premiereDate || !allValues.startTime) {
            toast.error("Vui lòng chọn thời gian");
            return;
        }

        let formatedPremiereDate = new Date(allValues.premiereDate).getTime(); // convert timestamp //
        let formatedStartTime = new Date(allValues.startTime).getTime(); // convert timestamp //
        let formatedEndTime = new Date(allValues.endTime).getTime(); // convert timestamp //


        let checkTime = moment(allValues.startTime).format('HH');

        if (+checkTime < 9 || +checkTime > 22) {
            toast.error("Thời gian không hợp lệ");
            return;
        }
        if (+checkTime === 22) {
            let checkMinutes = moment(allValues.startTime).format('mm');
            if (checkMinutes > 30) {
                toast.error("Thời gian không hợp lệ");
                return;
            }
        }



        setAllValues((prevState) => ({
            ...prevState,
            isShowLoadingButton: true
        }));

        if (allValues.startTime === '' || allValues.endTime === '' || allValues.selectedMovie === '') {
            toast.error("Thông tin rỗng !! Không thể thêm lịch chiếu");
            setAllValues((prevState) => ({
                ...prevState,
                isShowLoadingButton: false
            }));
            return;
        } else {
            let res = await createNewScheduleService({
                movieId: allValues.selectedMovie.value,
                roomId: allValues.selectedRoom.value,
                premiereDate: formatedPremiereDate,
                startTime: formatedStartTime,
                endTime: formatedEndTime
            })

            if (res && res.errCode === 0) {
                toast.success("Thêm lịch chiếu mới thành công");
                let formatedDate = new Date(allValues.dateSchedule).getTime(); // convert timestamp //

                let obj = {};
                obj.date = formatedDate;
                obj.roomId = allValues.selectedRoom.value
                obj.movieTheaterId = allValues.movieTheaterId
                let listSchedule = await getAllSchedule(obj);

                if (listSchedule && listSchedule.data) {
                    listSchedule = listSchedule.data.reverse();
                    //console.log('listSchedule: ', listSchedule)
                    listSchedule.map((item, index) => {
                        if (index < (listSchedule.length - 1)) {
                            let newDateEndTime = new Date(item.endTime);
                            // console.log('newDateEndTime: ', newDateEndTime)

                            let test2 = moment(newDateEndTime).format("HH:mm:ss a");
                            let startTime = moment(listSchedule[index + 1].startTime).format("HH:mm:ss a");

                            //  console.log("end: ", test2)
                            //  console.log('startTime: ', startTime);

                            var startTime2 = moment(test2, 'HH:mm:ss a');
                            var endTime2 = moment(startTime, 'HH:mm:ss a');

                            let duration = endTime2.diff(startTime2, 'minutes');

                            item.duration = duration;

                            return item;
                        }
                    })
                }


                setAllValues((prevState) => ({
                    ...prevState,
                    startTime: '',
                    endTime: '',
                    listSchedule: listSchedule,
                }))
            } else {
                toast.error(res.errMessage)
            }

            setAllValues((prevState) => ({
                ...prevState,
                isShowLoadingButton: false
            }));
        }


    }


    const handleOnChangeListSchedule = async (date) => {
        let formatedDate = new Date(date[0]).getTime(); // convert timestamp //


        let obj = {};
        obj.date = formatedDate;
        obj.roomId = allValues.selectedRoom.value;
        obj.movieTheaterId = allValues.movieTheaterId
        let listSchedule = await getAllSchedule(obj);


        if (listSchedule && listSchedule.data) {
            listSchedule = listSchedule.data.reverse();
            //  console.log('listSchedule: ', listSchedule)
            listSchedule.map((item, index) => {
                if (index < (listSchedule.length - 1)) {
                    let newDateEndTime = new Date(item.endTime);
                    //  console.log('newDateEndTime: ', newDateEndTime)

                    let test2 = moment(newDateEndTime).format("HH:mm:ss a");
                    let startTime = moment(listSchedule[index + 1].startTime).format("HH:mm:ss a");

                    // console.log("end: ", test2)
                    //  console.log('startTime: ', startTime);

                    var startTime2 = moment(test2, 'HH:mm:ss a');
                    var endTime2 = moment(startTime, 'HH:mm:ss a');

                    let duration = endTime2.diff(startTime2, 'minutes');

                    item.duration = duration;

                    return item;
                }
            })
        }


        setAllValues({ ...allValues, dateSchedule: date[0], listSchedule: listSchedule })

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
                                    <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>
                                    <li className="breadcrumb-item"><Link to={`/showTime-management`}>Quản lý lịch chiếu</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Thêm lịch chiếu</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <LoadingOverlay
                                active={allValues.isShowLoading}
                                spinner={<BeatLoader color='#6777ef' size={20} />}
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        background: '#fff'
                                    })
                                }}

                            >
                                <div className="row">
                                    <div className='col-1'></div>

                                    <div className="col-10">
                                        <div className="card mb-4">
                                            <div className="card-header">
                                                <h5 className="m-0 font-weight-bold text-primary">Quản lý lịch chiếu</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className='schedule-management'>
                                                    <div className='row main-row'>
                                                        <div className='list-schedule col-5'>
                                                            <div className='content-schedule-top'>
                                                                <div className='title-list'>
                                                                    <p>Danh sách lịch chiếu</p>
                                                                </div>
                                                                <DatePicker
                                                                    onChange={handleOnChangeListSchedule}
                                                                    className="form-control"
                                                                    // minDate="today"
                                                                    value={allValues.dateSchedule}
                                                                />
                                                                <Select
                                                                    className='room-select'
                                                                    value={allValues.selectedRoom || {}}
                                                                    onChange={handleChangeSelect}
                                                                    options={allValues.listRoom}
                                                                    placeholder='Chọn phòng chiếu'
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
                                                                                        <p>
                                                                                            Thời gian chờ: {item.duration} phút
                                                                                        </p>
                                                                                    </div>
                                                                                }

                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                                {allValues && allValues.listSchedule && allValues.listSchedule.length === 0 &&
                                                                    <div className='data-movie-content'>
                                                                        <div className='movie-content none'>
                                                                            <p>Không có suất chiếu mới nào !!</p>
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
                                                                            <p className='text'>Cập nhật lịch chiếu</p>
                                                                            <p>Điền đầy đủ thông tin !!!</p>
                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>
                                                            <div className='form-input-content'>
                                                                <div className="form-group row">
                                                                    <label htmlFor="exampleInputEmail1" className='col-4'>Tên phim</label>
                                                                    <Select
                                                                        className='movie-select col-8'
                                                                        value={allValues.selectedMovie || {}}
                                                                        onChange={handleChangeSelect}
                                                                        options={allValues.listMovie}
                                                                        placeholder='Chọn phim'
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
                                                                        value={allValues.selectedRoom || {}}
                                                                        onChange={handleChangeSelect}
                                                                        options={allValues.listRoom}
                                                                        placeholder='Chọn phòng chiếu'
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
                                                                    <Button variant="primary" {...allValues.isShowLoadingButton && 'disabled'} onClick={handleSubmitSchedule}>
                                                                        {allValues.isShowLoadingButton &&
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
                                                                        {!allValues.isShowLoadingButton &&
                                                                            <>
                                                                                <span className="visually">Thêm</span>
                                                                            </>
                                                                        }
                                                                    </Button>
                                                                    <Button variant="primary" className="delete-schedule-data" onClick={handleClearData}>
                                                                        <span className="visually">Xóa</span>
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
                            </LoadingOverlay>

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
