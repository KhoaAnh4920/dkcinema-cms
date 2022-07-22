import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllRoom, deleteRoomService } from '../../services/RoomService';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './ListTicket.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";
import DatePicker from '../../containers/System/Share/DatePicker';
import Select from 'react-select';
import { getAllFilmsByStatus } from '../../services/FilmsServices';

import { getAllBooking } from '../../services/BookingServices'

import moment from 'moment';
import { Button } from 'react-bootstrap';




function ListTicket() {

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
        selectedMovie: {},
        listBooking: []
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







    const fetchAllData = async (movieTheaterId) => {
        let bookData = await getAllBooking(movieTheaterId);

        console.log('bookData: ', bookData);
        if (bookData && bookData.data) {
            setAllValues((prevState) => ({
                ...prevState,
                listBooking: bookData.data || [],
                isShowLoading: false,
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
            fetchAllData(selectUser.adminInfo.movietheaterid)

            setAllValues((prevState) => ({
                ...prevState,
                movieTheaterId: selectUser.adminInfo.movietheaterid
            }));
        }

    }, [selectUser]);




    const columns = [
        { title: 'ID', field: 'id', key: 'bookId' },
        { title: 'Tên khách hàng', field: 'nameCus', key: 'nameCus' },
        { title: 'Số điện thoại', field: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Ngày giờ đặt', field: 'createdAt', key: 'createdAt', render: rowData => <><span>{moment(rowData.createdAt).format("DD/MM/YYYY HH:mm")}</span></> },
        {
            title: 'Status', field: 'status', key: 'status', render: rowData =>

                <>
                    {rowData.status == 1 && <span className="badge badge-success">Đã thanh toán</span>}
                    {rowData.status == -1 && <span className="badge badge-danger">Thanh toán thất bại</span>}
                    {rowData.status == 0 && <span className="badge badge-danger">Chưa thanh toán</span>}
                </>
        },
    ]






    const handleSubmitFilter = async () => {

        console.log('key: ', allValues.key);

        let check = isNaN(+allValues.key);

        console.log(check)

        let bookData = null;
        if (check) {
            bookData = await getAllBooking(movieTheaterId, null, allValues.key);


        } else {
            bookData = await getAllBooking(movieTheaterId, allValues.key);
        }

        // console.log('bookData: ', bookData);
        if (bookData && bookData.data) {
            setAllValues((prevState) => ({
                ...prevState,
                listBooking: bookData.data || [],
                isShowLoading: false,
            }))
        }


    }

    const handleClearFilter = () => {
        // setAllValues((prevState) => ({
        //     ...prevState,
        //     selectedMovie: {},
        //     selectedRoom: {}
        // }))
    }

    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }



    return (

        <>

            <div id="wrapper" className='list-ticket-main'>
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
                                    <h6 className="m-0 font-weight-bold text-primary">Tra cứu đặt vé</h6>
                                </div>
                                <div className="card-body">
                                    <div className="form-group horizon-form">


                                        <div className='horizon-input'>
                                            <input type="text" className="form-control input-sm" onChange={changeHandler} value={allValues.name} name='key' placeholder="Nhập tên mã đơn hàng hoặc tên khách hàng" />
                                        </div>

                                        <div className='horizon-input' style={{ marginLeft: '50px' }}>
                                            <Button variant="primary" className="submit-ticket-data" onClick={handleSubmitFilter}>
                                                <span className="visually">Submit</span>
                                            </Button>
                                            <Button variant="primary" className="filter-ticket-data" onClick={handleClearFilter}>
                                                <span className="visually">Clear</span>
                                            </Button>
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
                                    title="Danh sách đặt vé"
                                    columns={columns}
                                    data={allValues.listBooking}

                                    actions={[
                                        {

                                            icon: () => <i class="fas fa-info-circle" style={{ 'fontSize': '16px' }}></i>,
                                            onClick: async (event, rowData) => {
                                                history.push(`/detail-ticket/${rowData.id}`);
                                            },

                                        },
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

export default ListTicket;
