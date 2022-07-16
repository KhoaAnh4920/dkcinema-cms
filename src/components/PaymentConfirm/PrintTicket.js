import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllRoom, deleteRoomService } from '../../services/RoomService';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './PrintTicket.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";
import { getAllBooking, getTicketBooking } from '../../services/BookingServices'
import moment from 'moment';
import { useParams } from 'react-router-dom';
// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css'
import { Pagination } from 'antd';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import QRCode from 'qrcode';




function PrintTicket() {
    const { id } = useParams();
    const [listRoom, setRoomData] = useState([]);
    const [movieTheaterId, setMovieTheaterId] = useState();
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allValues, setAllValues] = useState({
        isShowLoading: false,
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
        listTicket: [],
        isLoadingButton: false
    });
    const [pageCurrent, setPageCurrent] = useState(1);
    let history = useHistory();
    let selectUser = useSelector(userState);
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];



    const fetchAllData = async (bookingId, page, PerPage) => {
        let ticketData = await getTicketBooking(bookingId, page, PerPage);

        if (ticketData && ticketData.data) {
            let nameSeet = '';
            let posOfColumn = +ticketData.data[0].TicketSeet.posOfColumn;
            let pos = +ticketData.data[0].TicketSeet.posOfRow;

            nameSeet += alphabet[+posOfColumn];
            nameSeet = nameSeet + (+pos + 1);

            console.log('ticketData: ', ticketData)

            let imgQRCode = await QRCode.toDataURL(`${ticketData.data[0].id}`);


            setAllValues((prevState) => ({
                ...prevState,
                listTicket: ticketData.data || [],
                totalData: ticketData.totalData,
                nameSeet: nameSeet,
                imgQRCode: imgQRCode,
                isShowLoading: false,
            }))
        }

    }


    async function onChangePagination(current) {
        // call api //

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true,
        }))

        setPageCurrent(current);

        fetchAllData(id, current, 1)

    }




    useEffect(() => {

    }, []);


    useEffect(() => {
        console.log('selectUser: ', selectUser)
        if (selectUser.adminInfo && selectUser.adminInfo.movietheaterid) {

            fetchAllData(id, 1, 1)

            setAllValues((prevState) => ({
                ...prevState,
                movieTheaterId: selectUser.adminInfo.movietheaterid,
                staffId: selectUser.adminInfo.id,
                nameStaff: selectUser.adminInfo.fullName
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


    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;


        setAllValues({ ...stateCopy })
    }

    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, dateCreated: date[0] })
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

        let formatedDate = new Date(allValues.dateCreated).getTime(); // convert timestamp //

        let obj = {};
        obj.date = formatedDate;
        obj.roomId = allValues.selectedRoom.value;
        obj.movieId = allValues.selectedMovie.value;
        obj.movieTheaterId = allValues.movieTheaterId;

    }

    const handleClearFilter = () => {
        setAllValues((prevState) => ({
            ...prevState,
            selectedMovie: {},
            selectedRoom: {}
        }))
    }

    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }


    const handlePrintTicket = () => {
        setAllValues((prevState) => ({
            ...prevState,
            isLoadingButton: true,
        }))

        setTimeout(() => {
            toast.success("In vé thành công");
            setAllValues((prevState) => ({
                ...prevState,
                isLoadingButton: false,
            }))
        }, 5000);
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
                <div id="wrapper" className='print-ticket-main'>
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
                                    <div className="card-body">
                                        <div className='row ticket-main'>
                                            <div className='col-5 ticket-one'>
                                                <div className='header-ticket'>
                                                    <div className='header-title'>
                                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>VÉ XEM PHIM</span>
                                                        <span style={{ textDecoration: 'underline' }}>Lien 1: Nhan vien</span>
                                                    </div>
                                                    <p className='address-ticket'>180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh</p>


                                                </div>
                                                <div style={{ height: '3px' }}></div>
                                                <div className='content-ticket'>
                                                    <p className='nameTheater'>{(allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime) ? allValues.listTicket[0].TicketShowtime.RoomShowTime.MovieTheaterRoom.tenRap : ''}</p>
                                                    <p className='nameMovie'>{(allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime) ? allValues.listTicket[0].TicketShowtime.ShowtimeMovie.name : ''}</p>
                                                    <div className='horizontal-text'>
                                                        <div className='row'>
                                                            <div className='col-6'>
                                                                <p>{(allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime) ? moment(allValues.listTicket[0].TicketShowtime.premiereDate).format('ddd DD-MM-YYYY') : ''}</p>

                                                            </div>
                                                            <div className='col-6'>
                                                                <p>Show: {(allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime) ? moment(allValues.listTicket[0].TicketShowtime.startTime).format('HH:mm') : ''}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='horizontal-text'>
                                                        <div className='row'>
                                                            <div className='col-6'>
                                                                <p>Seat: {allValues.nameSeet}</p>

                                                            </div>
                                                            <div className='col-6'>
                                                                <p>Screen: {((allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime)) ? allValues.listTicket[0].TicketShowtime.RoomShowTime.name : ''}</p>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontSize: '10px' }}>(Đã bao gồm 5% VAT)</span>
                                                    </div>


                                                </div>
                                                <div style={{ height: '3px' }}></div>
                                                <div className='ticket-footer'>
                                                    <p className='info-staff'>{allValues.staffId} - {allValues.nameStaff} - {moment().format('DD-MM-YYYY HH:mm')}</p>
                                                    <p className='idTicket'>SaleNo: {(allValues.listTicket && allValues.listTicket[0]) ? allValues.listTicket[0].id : ''}</p>
                                                    <div className='qrTicket-container'>
                                                        {allValues.imgQRCode &&
                                                            <img className='qrTicket-img' src={allValues.imgQRCode} />

                                                        }
                                                        <p>TICKET</p>
                                                        <p>www.dkcinema.vn - Hotline: 19002099</p>
                                                        <p>THANK YOU FOR CHOOSING US TODAY</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-2'> </div>
                                            <div className='form-group col-5 ticket-two'>
                                                <div className='header-ticket'>
                                                    <div className='header-title'>
                                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>VÉ XEM PHIM</span>
                                                        <span style={{ textDecoration: 'underline' }}>Lien 2: Khach hang</span>
                                                    </div>
                                                    <p className='address-ticket'>180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh</p>


                                                </div>
                                                <div style={{ height: '3px' }}></div>
                                                <div className='content-ticket'>
                                                    <p className='nameTheater'>{(allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime) ? allValues.listTicket[0].TicketShowtime.RoomShowTime.MovieTheaterRoom.tenRap : ''}</p>
                                                    <p className='nameMovie'>{(allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime) ? allValues.listTicket[0].TicketShowtime.ShowtimeMovie.name : ''}</p>
                                                    <div className='horizontal-text'>
                                                        <div className='row'>
                                                            <div className='col-6'>
                                                                <p>{(allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime) ? moment(allValues.listTicket[0].TicketShowtime.premiereDate).format('ddd DD-MM-YYYY') : ''}</p>

                                                            </div>
                                                            <div className='col-6'>
                                                                <p>Show: {(allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime) ? moment(allValues.listTicket[0].TicketShowtime.startTime).format('HH:mm') : ''}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='horizontal-text'>
                                                        <div className='row'>
                                                            <div className='col-6'>
                                                                <p>Seat: {allValues.nameSeet}</p>

                                                            </div>
                                                            <div className='col-6'>
                                                                <p>Screen: {((allValues.listTicket[0] && allValues.listTicket[0].TicketShowtime)) ? allValues.listTicket[0].TicketShowtime.RoomShowTime.name : ''}</p>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontSize: '10px' }}>(Đã bao gồm 5% VAT)</span>
                                                    </div>


                                                </div>
                                                <div style={{ height: '3px' }}></div>
                                                <div className='ticket-footer'>
                                                    <p className='info-staff'>{allValues.staffId} - {allValues.nameStaff} - {moment().format('DD-MM-YYYY HH:mm')}</p>
                                                    <p className='idTicket'>SaleNo: {(allValues.listTicket && allValues.listTicket[0]) ? allValues.listTicket[0].id : ''}</p>
                                                    <div className='qrTicket-container'>
                                                        {allValues.imgQRCode &&
                                                            <img className='qrTicket-img' src={allValues.imgQRCode} />

                                                        }
                                                        <p>TICKET</p>
                                                        <p>www.dkcinema.vn - Hotline: 19002099</p>
                                                        <p>THANK YOU FOR CHOOSING US TODAY</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Pagination
                                            style={{ display: 'flex', justifyContent: 'center' }}
                                            responsive={true}
                                            onChange={onChangePagination}
                                            total={allValues.totalData}
                                            pageSize={1}
                                            current={pageCurrent}
                                        />

                                        <div className='button-print'>
                                            <Button variant="primary" {...allValues.isLoadingButton && 'disabled'} className="submit-bill-data" onClick={() => handlePrintTicket()}>
                                                {allValues.isLoadingButton &&
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
                                                {!allValues.isLoadingButton &&
                                                    <>
                                                        <span className="visually"><i className="fas fa-print" style={{ 'fontSize': '16px' }}> </i> In vé</span>
                                                    </>
                                                }
                                            </Button>
                                        </div>


                                    </div>
                                </div>
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

export default PrintTicket;
