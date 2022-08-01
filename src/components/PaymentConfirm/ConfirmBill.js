import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './ConfirmBill.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";
import DatePicker from '../../containers/System/Share/DatePicker';
import { getBookingConfirm } from '../../services/BookingServices'
import moment from 'moment';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import QrReader from 'react-qr-reader';



function ConfirmBill() {

    // const [listRoom, setRoomData] = useState([]);
    // const [movieTheaterId, setMovieTheaterId] = useState();
    // const [checked, setChecked] = useState(false);
    // const [loading, setLoading] = useState(false);
    const [scanResultWebCam, setScanResultWebCam] = useState('');
    const [allValues, setAllValues] = useState({
        isShowLoading: true,
        dateCreated: new Date(),
        premiereDate: new Date().fp_incr(1),
        movieTheaterId: '',
        listRoom: [],
        listMovie: [],
        selectedRoom: {},
        listSchedule: [],
        startTime: '',
        endTime: '',
        selectedMovie: {},
        listBooking: [],
        isShowScanQR: false
    });
    let history = useHistory();
    let selectUser = useSelector(userState);







    const fetchBookingConfirm = async (movieTheaterId, date) => {
        let bookData = await getBookingConfirm({
            movieTheaterId: movieTheaterId,
            date: date
        });

        if (bookData && bookData.data) {


            let response = bookData.data.map(item => {
                item.nameMovie = item.BookingTicket[0].TicketShowtime.ShowtimeMovie.name;

                return item;
            })


            setAllValues((prevState) => ({
                ...prevState,
                listBooking: response || [],
                isShowLoading: false,
            }))
        }

    }


    const clearBooking = () => {
        setAllValues((prevState) => ({
            ...prevState,
            bookingID: '',
            nameCus: '',
        }))
        setScanResultWebCam("");
    }




    useEffect(() => {

    }, []);


    useEffect(() => {
        // console.log('selectUser: ', selectUser)
        if (selectUser.adminInfo && selectUser.adminInfo.movietheaterid) {
            let dateToday = new Date();
            fetchBookingConfirm(selectUser.adminInfo.movietheaterid, dateToday.getTime())


            setAllValues((prevState) => ({
                ...prevState,
                movieTheaterId: selectUser.adminInfo.movietheaterid
            }));
        }

    }, [selectUser]);

    const handleToggleScan = () => {
        setAllValues((prevState) => ({
            ...prevState,
            isShowScanQR: !prevState.isShowScanQR
        }))
    }




    const columns = [
        { title: 'STT', field: 'stt', key: 'stt', render: (rowData, index) => <>{rowData.tableData.id + 1}</> },
        { title: 'ID', field: 'id', key: 'bookId' },
        { title: 'Tên khách hàng', field: 'nameCus', key: 'nameCus' },
        { title: 'Ngày giờ đặt', field: 'createdAt', key: 'createdAt', render: rowData => <><span>{moment(rowData.createdAt).format("DD/MM/YYYY HH:mm")}</span></> },
        { title: 'Số lượng', field: 'amount', key: 'amount', render: (rowData, index) => <><span>{rowData.BookingTicket.length}</span></> },
        { title: 'Phim', field: 'nameMovie', key: 'nameMovie', render: (rowData, index) => <><span className='nameMovie'>{rowData.nameMovie}</span></> },
        { title: 'Suất chiếu', field: 'schedule', key: 'schedule', render: (rowData, index) => <><span>{moment(rowData.BookingTicket[0].TicketShowtime.startTime).format('HH:mm DD-MM-YYYY')}</span></> },
        {
            title: 'Status', field: 'status', key: 'status', render: rowData =>

                <>
                    {rowData.status == 1 && <span className="badge badge-success">Đã thanh toán</span>}
                    {rowData.status == -1 && <span className="badge badge-danger">Thanh toán thất bại</span>}
                    {rowData.status == 0 && <span className="badge badge-danger">Chưa thanh toán</span>}
                </>
        },
    ]



    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, dateCreated: date[0] })
    }



    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const filterBooking = async () => {
        setAllValues((prevState) => ({
            ...prevState,
            isLoadingButtonSubmit: true,
        }))
        //  console.log(allValues);
        let formatedDate = new Date(allValues.dateCreated).getTime(); // convert timestamp //

        let obj = {};
        obj.date = formatedDate;
        obj.nameCus = allValues.nameCus;
        obj.bookingId = allValues.bookingID;
        obj.movieTheaterId = allValues.movieTheaterId;

        let dataBooking = await getBookingConfirm(obj);

        if (dataBooking && dataBooking.data) {

            let response = dataBooking.data.map(item => {
                item.nameMovie = item.BookingTicket[0].TicketShowtime.ShowtimeMovie.name;

                return item;
            })


            setAllValues((prevState) => ({
                ...prevState,
                listBooking: response || [],
                isLoadingButtonSubmit: false,
                isShowLoading: false,
            }))

        }

        // console.log('dataBooking: ', dataBooking);


    }

    const handleErrorWebCam = (error) => {
        console.log(error);
    }

    const handleScanWebCam = async (result) => {
        if (result) {
            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: true,
            }))

            let bookData = await getBookingConfirm({
                bookingId: result
            });

            if (bookData && bookData.data) {


                let response = bookData.data.map(item => {
                    item.nameMovie = item.BookingTicket[0].TicketShowtime.ShowtimeMovie.name;

                    return item;
                })


                setAllValues((prevState) => ({
                    ...prevState,
                    listBooking: response || [],
                    isShowLoading: false,
                }))
                setScanResultWebCam(result);
            }


        }
    }





    return (

        <>
            <LoadingOverlay
                active={allValues.isShowLoading}
                spinner={<BeatLoader color='#fff' size={20} />}
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: 'rgb(10 10 10 / 68%)'
                    })
                }}
            >
                <div id="wrapper" className='list-bill-main'>
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
                                        <h6 className="m-0 font-weight-bold text-primary">Tra cứu</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className='row'>
                                            <div className='col-6 filter-bill'>
                                                <div className="form-group input-bookingID">
                                                    <label htmlFor="exampleInputEmail1">Mã đặt vé</label>
                                                    <input type="text" className="form-control input-sm" name='bookingID' onChange={changeHandler} placeholder="Enter bookingID" />

                                                </div>
                                                <div className="form-group input-bookingNameCus">
                                                    <label htmlFor="exampleInputEmail1">Nhập tên khách</label>
                                                    <input type="text" className="form-control input-sm" name='nameCus' onChange={changeHandler} placeholder="Enter name customer" />

                                                </div>
                                                <div className="form-group input-bookingCreated">
                                                    <label htmlFor="exampleInputEmail1">Ngày đặt</label>
                                                    <DatePicker
                                                        onChange={handleOnChangeDatePicker}
                                                        className="form-control"
                                                        value={allValues.dateCreated}
                                                    // placeholder="Enter dateCreated"
                                                    />

                                                </div>
                                                <div className='horizon-input-button' style={{ marginLeft: '50px' }}>
                                                    <Button variant="primary" {...allValues.isLoadingButtonSubmit && 'disabled'} className="submit-bill-data" onClick={() => filterBooking()}>
                                                        {allValues.isLoadingButtonSubmit &&
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
                                                        {!allValues.isLoadingButtonSubmit &&
                                                            <>
                                                                <span className="visually">Tìm kiếm</span>
                                                            </>
                                                        }
                                                    </Button>

                                                    {/* <Button variant="primary" className="submit-bill-data" onClick={filterBooking} >
                                                        <span className="visually">Submit</span>
                                                    </Button> */}
                                                    <Button variant="primary" className="clear-bill-data" onClick={clearBooking} >
                                                        <span className="visually">Xóa</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='form-group col-6 qr-bill'>
                                                <h6>Quét mã QR</h6>
                                                <div className='row'>
                                                    <div className='wrap-qr col-8 '>
                                                        {allValues.isShowScanQR &&
                                                            <QrReader
                                                                delay={300}
                                                                style={{ height: '100px', position: 'inherit', display: 'block' }}
                                                                onError={handleErrorWebCam}
                                                                onScan={handleScanWebCam}
                                                            />
                                                        }
                                                        {
                                                            allValues.isShowScanQR === false &&
                                                            <img style={{ width: '300px' }} src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/800px-Superqr.svg.png' />
                                                        }



                                                    </div>
                                                    <div className="button-scan-container col-4">
                                                        <button type="button" className=" btn btn-scan" onClick={handleToggleScan}><i class="fas fa-camera" style={{ marginRight: '10px' }}></i>Quét mã QR</button>
                                                    </div>

                                                </div>


                                                <h6>Mã hiển thị: {scanResultWebCam}</h6>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div className="col-lg-12 mb-4">

                                <MaterialTable
                                    title="Danh sách đặt vé"
                                    columns={columns}
                                    data={allValues.listBooking}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Làm mới</button>,
                                            onClick: async (event, rowData) => {
                                                let movietheaterid = (selectUser && selectUser.adminInfo && selectUser.adminInfo.movietheaterid) ? selectUser.adminInfo.movietheaterid : null;
                                                // console.log('movietheaterid: ', movietheaterid)
                                                fetchBookingConfirm(movietheaterid)
                                            },
                                            isFreeAction: true,
                                        },
                                        {

                                            icon: () => <i className="fas fa-print" style={{ 'fontSize': '16px' }}> <span></span></i>,
                                            onClick: async (event, rowData) => {
                                                //  console.log(rowData)
                                                if (rowData.status === 0)
                                                    toast.error("Cannot print this ticket")
                                                history.push(`/print-ticket/${rowData.id}`);
                                            },

                                        },
                                    ]}
                                    options={{
                                        actionsColumnIndex: -1,
                                        headerStyle: { color: "#6e707e", backgroundColor: "#eaecf4", fontSize: '15px', fontWeight: 700 },
                                        paginationType: "stepped"

                                    }}

                                />
                            </div>

                        </div>
                        {/* Footer */}
                        <Footer />
                        {/* Footer */}
                    </div>
                </div>

            </LoadingOverlay>

        </>
    );
}

export default ConfirmBill;
