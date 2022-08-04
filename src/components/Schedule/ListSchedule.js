import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllRoom, deleteRoomService } from '../../services/RoomService';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './ListSchedule.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";
import DatePicker from '../../containers/System/Share/DatePicker';
import Select from 'react-select';
import { getAllFilmsByStatus } from '../../services/FilmsServices';
import { getAllSchedule } from '../../services/ScheduleServices';
import moment from 'moment';
import { Button } from 'react-bootstrap';




function ListSchedule() {

    const [listRoom, setRoomData] = useState([]);
    const [movieTheaterId, setMovieTheaterId] = useState();
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allValues, setAllValues] = useState({
        isShowLoading: true,
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

        //  console.log("Check phim: ", dataMovie);

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

        //   console.log('dataRes: ', dataRes);

        let timeNow = moment();


        if (dataRes && dataRes.data.length > 0) {
            let listSchedule = dataRes.data.reverse();
            let res = listSchedule.map((item, index) => {
                // if ngay hien tai < ngay cong chieu
                // status sap chieu 
                // if ngay hien tai > ngay cong chieu 
                // status da chieu
                // else
                // time hien tai is between start va end => dang chieu
                // time hien tai < start => sap chieu
                // else => da chieu



                //  console.log((moment(item.premiereDate)));

                var duration = moment.duration(timeNow.diff(moment(item.premiereDate)));

                // console.log("Check duation: ", duration);
                // console.log("Check day: ", duration.asDays() / 10);

                // console.log("Check day: ", Math.trunc(duration.asDays()));
                // console.log("Check asHours: ", Math.trunc(duration.asHours()));
                // console.log("Check asMinutes: ", Math.trunc(duration.asMinutes()));

                if (Math.trunc(duration.asDays()) < 0 || Math.trunc(duration.asHours()) < 0 || Math.trunc(duration.asMinutes()) < 0) {
                    item.status = 0
                } else if (Math.trunc(duration.asDays()) > 0) {
                    item.status = 2
                }
                else {
                    // time hien tai is between start va end => dang chieu
                    // time hien tai < start => sap chieu
                    // else => da chieu

                    let h = moment(timeNow).format("HH");
                    let m = moment(timeNow).format("mm");
                    let h1 = moment(item.startTime).format("HH");
                    let m1 = moment(item.startTime).format("mm");
                    let h2 = moment(item.endTime).format("HH");
                    let m2 = moment(item.endTime).format("mm");

                    if ((h1 < h || h1 == h && m1 <= m) && (h < h2 || h == h2 && m <= m2)) {
                        // console.log("Dang chieu")
                        item.status = 1
                    }
                    else if (h < h1) {
                        //   console.log("Sap chieu");
                        item.status = 0
                    } else {
                        item.status = 2
                        //   console.log("Da chieu")
                    }

                }
                return item;

            })

            setAllValues((prevState) => ({
                ...prevState,
                listSchedule: res,
            }))
        } else {
            setAllValues((prevState) => ({
                ...prevState,
                listSchedule: [],
            }))
        }
    }




    const fetchAllData = async (movieTheaterId, status) => {

        //  console.log('movieTheaterId: ', movieTheaterId)
        let roomData = await getAllRoom(movieTheaterId);
        const dataMovie = await getAllFilmsByStatus(status);

        // console.log("Check phim: ", dataMovie);

        //   console.log('roomData: ', roomData);

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

            let reslistSchedule = await getAllSchedule(obj);
            let listRoom = buildDataInputSelect(roomData.room);

            // console.log("reslistSchedule: ", reslistSchedule);

            let timeNow = moment();


            if (reslistSchedule && reslistSchedule.data.length > 0) {
                let listSchedule = reslistSchedule.data.reverse();
                let res = listSchedule.map((item, index) => {
                    // console.log("Start: ", item.startTime);
                    // console.log((moment(item.startTime)));

                    var duration = moment.duration(timeNow.diff(moment(item.premiereDate)));

                    // console.log("Check duation: ", duration);

                    // console.log("Check day: ", duration.asDays());

                    if (Math.trunc(duration.asDays()) < 0 || Math.trunc(duration.asHours()) < 0 || Math.trunc(duration.asMinutes()) < 0) {
                        item.status = 0
                    } else if (Math.trunc(duration.asDays()) > 0) {
                        //  console.log("Cung ngay da chieu");
                        item.status = 2
                    }
                    else {
                        //   console.log("Chay vo else");
                        // time hien tai is between start va end => dang chieu
                        // time hien tai < start => sap chieu
                        // else => da chieu

                        let h = moment(timeNow).format("HH");
                        let m = moment(timeNow).format("mm");
                        let h1 = moment(item.startTime).format("HH");
                        let m1 = moment(item.startTime).format("mm");
                        let h2 = moment(item.endTime).format("HH");
                        let m2 = moment(item.endTime).format("mm");

                        if ((h1 < h || h1 == h && m1 <= m) && (h < h2 || h == h2 && m <= m2)) {
                            //    console.log("Dang chieu")
                            item.status = 1
                        }
                        else if (h < h1) {
                            //    console.log("Sap chieu");
                            item.status = 0
                        } else {
                            item.status = 2
                            //    console.log("Da chieu")
                        }

                    }
                    return item;

                })

                setAllValues((prevState) => ({
                    ...prevState,
                    listSchedule: res,
                    isShowLoading: false,
                    dataRoom: roomData.room,
                    listRoom: listRoom,
                    selectedRoom: listRoom[0] || {},
                    listMovie: listMovie
                }))
            } else {
                setAllValues((prevState) => ({
                    ...prevState,
                    listSchedule: [],
                    isShowLoading: false,
                    dataRoom: roomData.room,
                    listRoom: listRoom,
                    selectedRoom: listRoom[0] || {},
                    listMovie: listMovie
                }))
            }
        } else {
            setAllValues((prevState) => ({
                ...prevState,
                listSchedule: [],
                isShowLoading: false,
                dataRoom: [],
                listRoom: [],
                selectedRoom: {},
            }))
        }
    }




    useEffect(() => {
        let dateToday = moment().format('dddd, MMMM Do, YYYY');

        setAllValues((prevState) => ({
            ...prevState,
            dateToday: dateToday,
        }))
    }, []);


    useEffect(() => {

        if (selectUser.adminInfo && selectUser.adminInfo.movietheaterid) {
            fetchAllData(selectUser.adminInfo.movietheaterid, 1)

            setAllValues((prevState) => ({
                ...prevState,
                movieTheaterId: selectUser.adminInfo.movietheaterid
            }));
        }


    }, [selectUser]);




    const columns = [
        { title: 'ID', field: 'id', key: 'RoomId' },
        { title: 'Tên phim', field: 'name', key: 'nameMovie', render: rowData => <><span>{rowData.ShowtimeMovie.name}</span></> },
        { title: 'Ngày chiếu', field: 'premiereDate', key: 'premiereDate', render: rowData => <><span>{moment(rowData.premiereDate).format("DD-MM-YYYY")}</span></> },
        { title: 'Phòng chiếu', field: 'label', key: 'NameRoom', render: rowData => <span>{rowData.RoomShowTime.name}</span> },
        { title: 'Giờ bắt đầu', field: 'startTime', key: 'startTime', render: rowData => <><span>{moment(rowData.startTime).format("HH:mm")}</span></> },
        { title: 'Giờ kết thúc', field: 'endTime', key: 'endTime', render: rowData => <><span>{moment(rowData.endTime).format("HH:mm")}</span></> },
        {
            title: 'Status', field: 'status', key: 'status', render: rowData =>

                <>
                    {rowData.status == 0 && <span className="badge badge-info">Sắp chiếu</span>}
                    {rowData.status == 1 && <span className="badge badge-success">Đang chiếu</span>}
                    {rowData.status == 2 && <span className="badge badge-danger">Đã chiếu</span>}
                </>
        },
    ]


    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;


        setAllValues({ ...stateCopy })
    }

    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, dateSchedule: date[0] })
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

    const handleSubmitFilter = () => {
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: false,
        }))

        let formatedDate = new Date(allValues.dateSchedule).getTime(); // convert timestamp //

        let obj = {};
        obj.date = formatedDate;
        obj.roomId = allValues.selectedRoom.value;
        obj.movieId = allValues.selectedMovie.value;
        obj.movieTheaterId = allValues.movieTheaterId;
        fetchDataSchedule(obj);
    }

    const handleClearFilter = () => {
        setAllValues((prevState) => ({
            ...prevState,
            selectedMovie: {},
            selectedRoom: {}
        }))
    }



    return (

        <>

            <div id="wrapper" className='list-schedule-main'>
                {/* Sidebar */}

                <Sidebar />

                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}
                        <div className="col-lg-12 mb-4">

                            <div className="card mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">Tra cứu suất chiếu</h6>
                                </div>
                                <div className="card-body">
                                    <div className="form-group horizon-form">
                                        <div className='horizon-input'>
                                            <label htmlFor="exampleInputEmail1">Ngày chiếu</label>
                                            <DatePicker
                                                onChange={handleOnChangeDatePicker}
                                                className="form-control input-date-time"
                                                value={allValues.dateSchedule || {}}
                                            />
                                        </div>
                                        <div className='horizon-input'>
                                            <label htmlFor="exampleInputEmail1">Phòng</label>
                                            <Select
                                                className='room-select'
                                                value={allValues.selectedRoom || {}}
                                                onChange={handleChangeSelect}
                                                options={allValues.listRoom}
                                                placeholder='Select room'
                                                name='selectedRoom'
                                                styles={customStyles}
                                            // styles={this.props.colourStyles}
                                            />
                                        </div>
                                        <div className='horizon-input'>
                                            <label htmlFor="exampleInputEmail1">Phim</label>
                                            <Select
                                                className='movie-select'
                                                value={allValues.selectedMovie || {}}
                                                onChange={handleChangeSelect}
                                                options={allValues.listMovie}
                                                placeholder='Select movie'
                                                name='selectedMovie'
                                                styles={customStyles}
                                            // styles={this.props.colourStyles}
                                            />
                                        </div>

                                        <div className='horizon-input' style={{ paddingLeft: 'auto' }}>
                                            <label htmlFor="exampleInputEmail1" style={{ height: '22px' }}></label>


                                            <div className='button-filter'>
                                                <Button variant="primary" className="submit-schedule-data" onClick={handleSubmitFilter}>
                                                    <span className="visually">Tìm kiếm</span>
                                                </Button>
                                                <Button variant="primary" className="filter-schedule-data" onClick={handleClearFilter}>
                                                    <span className="visually">Xóa</span>
                                                </Button>

                                            </div>


                                        </div>




                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="col-lg-12 mb-4">
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
                                <MaterialTable
                                    title="Danh sách suất chiếu"
                                    columns={columns}
                                    data={allValues.listSchedule}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Thêm suất chiếu</button>,
                                            onClick: async (event, rowData) => {
                                                if (allValues.dataRoom.length === 0)
                                                    toast.error("Please add a screening room")
                                                else history.push('/add-new-schedule');
                                            },
                                            isFreeAction: true,
                                        },
                                        {
                                            icon: 'delete',
                                            tooltip: 'Delete schedule',
                                            // onClick: (event, rowData) => Swal.fire({
                                            //     title: 'Are you sure?',
                                            //     text: "You won't be able to revert this!",
                                            //     icon: 'warning',
                                            //     showCancelButton: true,
                                            //     confirmButtonColor: '#3085d6',
                                            //     cancelButtonColor: '#d33',
                                            //     confirmButtonText: 'Yes, delete it!'
                                            // }).then((result) => {
                                            //     if (result.isConfirmed) {
                                            //         handleOnDeleteRoom(rowData.id)
                                            //     }
                                            // })
                                        }
                                    ]}
                                    options={{
                                        actionsColumnIndex: -1,
                                        headerStyle: { color: "#6e707e", backgroundColor: "#eaecf4", fontSize: '15px', fontWeight: 700 },
                                        paginationType: "stepped"

                                    }}

                                />

                            </LoadingOverlay>
                        </div>


                    </div>
                    {/* Footer */}
                    <Footer />
                    {/* Footer */}
                </div>
            </div>



        </>
    );
}

export default ListSchedule;
