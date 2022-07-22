import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import Select from 'react-select';
import './DetailTicket.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import { getDetailFilm } from '../../services/FilmsServices';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { getDetailBooking, getComboBooking } from '../../services/BookingServices';



//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';




export default function DetailTicket() {


    const [allValues, setAllValues] = useState({
        name: '',
        transName: '',
        country: '',
        language: '',
        duration: '',
        description: '',
        brand: '',
        cast: '',
        status: 0,
        typeMovie: [],
        url: '',
        releaseTime: 0,
        errors: {},
        poster: '',
        isShowLoading: false
    });

    const { id } = useParams();
    let history = useHistory();

    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


    useEffect(() => {
        async function fetchDetailTicket() {
            let dataBooking = await getDetailBooking(id);
            let dataCombo = await getComboBooking(id);

            console.log('dataBooking: ', dataBooking);


            setAllValues({
                id: id,
                listBooking: dataBooking.data || [],
                listBookingTicket: dataBooking.data.BookingTicket,
                isShowLoading: false,
                dataCombo: dataCombo.data || []
            })

            // }
        }
        fetchDetailTicket();
    }, []);









    return (

        <>

            <div id="wrapper" className='detail-ticket'>
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
                                    <li className="breadcrumb-item"><Link to={`/ticket-management`}>Quản lý Vé</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Chi tiết Vé</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-1'></div>
                                <div className="col-10">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">THÔNG TIN CHI TIẾT VÉ</h5>
                                        </div>
                                        <div className="card-body info-ticket-main">
                                            <div className='content-ticket-one'>
                                                <div className='info-cus'>
                                                    <h6 style={{ 'marginBottom': '16px' }}>THÔNG TIN KHÁCH HÀNG</h6>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p><b>Họ tên</b></p>
                                                            <p><b>Địa chỉ Email</b></p>
                                                            <p><b>Số điện thoại</b></p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <p>{(allValues.listBooking && allValues.listBooking.nameCus) ? allValues.listBooking.nameCus : ''}</p>
                                                            <p>{(allValues.listBooking && allValues.listBooking.email) ? allValues.listBooking.email : ''}</p>
                                                            <p>{(allValues.listBooking && allValues.listBooking.phoneNumber) ? allValues.listBooking.phoneNumber : ''}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='info-films'>
                                                    <h6 style={{ 'marginBottom': '16px' }}>THÔNG TIN PHIM</h6>
                                                    <div className='row'>
                                                        <div className='col-12 wrap-nameMovie'>
                                                            <p><b>Tên phim:</b></p>
                                                            <p className='nameFilms'>MAIKA - CÔ BÉ ĐẾN TỪ HÀNH TINH KHÁC</p>
                                                        </div>
                                                        <div className='col-12 wrap-nameRoom'>
                                                            <p><b>Phòng: </b></p>
                                                            <p>
                                                                {(allValues.listBookingTicket && allValues.listBookingTicket[0].TicketShowtime && allValues.listBookingTicket[0].TicketShowtime.ShowtimeMovie)
                                                                    ? allValues.listBookingTicket[0].TicketShowtime.RoomShowTime.name
                                                                    : ''
                                                                }</p>
                                                        </div>
                                                        <div className='col-12 wrap-showTime'>
                                                            <p><b>Lịch chiếu: </b></p>
                                                            <p>
                                                                {(allValues.listBookingTicket && allValues.listBookingTicket[0].TicketShowtime && allValues.listBookingTicket[0].TicketShowtime.ShowtimeMovie)
                                                                    ? moment(allValues.listBookingTicket[0].TicketShowtime.startTime).format('HH:mm - DD/MM/YYYY')
                                                                    : ''
                                                                }</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='info-booking'>
                                                    <h6 style={{ 'marginBottom': '16px' }}>THÔNG TIN ĐƠN HÀNG</h6>
                                                    <div className='row'>
                                                        <div className='col-12 wrap-idBooking'>
                                                            <p><b>Mã đơn hàng:</b></p>
                                                            <p className='bookingID'><p>{(allValues.listBooking && allValues.listBooking.id) ? allValues.listBooking.id : ''}</p></p>
                                                        </div>
                                                        <div className='col-12 wrap-statusBooking'>
                                                            <p><b>Trạng thái:</b></p>
                                                            {
                                                                (allValues.listBooking && allValues.listBooking.status && allValues.listBooking.status === -1)
                                                                    ? <p style={{ 'color': 'red' }}>Chưa thanh toán </p>
                                                                    : ''
                                                            }
                                                            {
                                                                (allValues.listBooking && allValues.listBooking.status && allValues.listBooking.status === 1)
                                                                    ? <p style={{ 'color': 'green' }}>Đã thanh toán </p>
                                                                    : ''
                                                            }
                                                        </div>
                                                        <div className='col-12 wrap-createdBooking'>
                                                            <p><b>Mã đơn hàng:</b></p>
                                                            <p>
                                                                {(allValues.listBooking && allValues.listBooking.phoneNumber)
                                                                    ? allValues.listBooking.phoneNumber
                                                                    : ''
                                                                }
                                                            </p>
                                                        </div>
                                                        {/* <div className='col-4'>
                                                            <p><b>Mã đơn hàng</b></p>
                                                            <p><b>Trạng thái</b></p>
                                                            <p><b>Ngày giờ đặt</b></p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <p>{(allValues.listBooking && allValues.listBooking.id) ? allValues.listBooking.id : ''}</p>
                                                            {
                                                                (allValues.listBooking && allValues.listBooking.status && allValues.listBooking.status === -1)
                                                                    ? <p style={{ 'color': 'red' }}>Chưa thanh toán </p>
                                                                    : ''
                                                            }
                                                            {
                                                                (allValues.listBooking && allValues.listBooking.status && allValues.listBooking.status === 1)
                                                                    ? <p style={{ 'color': 'green' }}>Đã thanh toán </p>
                                                                    : ''
                                                            }

                                                            <p>
                                                                {(allValues.listBooking && allValues.listBooking.phoneNumber)
                                                                    ? allValues.listBooking.phoneNumber
                                                                    : ''
                                                                }
                                                            </p>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='content-ticket-two'>
                                                <div className='row'>
                                                    <div className='col-5'>
                                                        <table id="customers">
                                                            <thead>
                                                                <tr>
                                                                    <th>STT</th>
                                                                    <th>Tên ghế</th>
                                                                    <th>Giá(VNĐ)</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {allValues.listBookingTicket && allValues.listBookingTicket.map((item, index) => {

                                                                    let soGhe = '';
                                                                    soGhe += alphabet[+item.TicketSeet.posOfColumn];
                                                                    soGhe = soGhe + (+item.TicketSeet.posOfRow + 1);

                                                                    return (
                                                                        <tr>
                                                                            <td>{index + 1}</td>
                                                                            <td>{soGhe}</td>
                                                                            <td>
                                                                                {item.TicketSeet.typeId === 1 && '90.000 VNĐ'}
                                                                                {item.TicketSeet.typeId === 2 && '100.000 VNĐ'}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}

                                                            </tbody>
                                                            {/* <tfoot>
                                                                <tr>
                                                                    <td>Sum</td>
                                                                    <td>$180</td>
                                                                    <td>$100</td>

                                                                </tr>
                                                            </tfoot> */}
                                                        </table>
                                                    </div>
                                                    <div className='col-7'>
                                                        <table id="customers">
                                                            <thead>
                                                                <tr>
                                                                    <th>STT</th>
                                                                    <th>Tên thực phẩm</th>
                                                                    <th>Số lượng</th>
                                                                    <th>Đơn giá (VNĐ)</th>
                                                                    <th>Thành tiền (VNĐ)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {allValues.dataCombo && allValues.dataCombo.length > 0 && allValues.dataCombo.map((item, index) => {
                                                                    let total = item.amount * item.Combo.price
                                                                    return (
                                                                        <tr>
                                                                            <td>{index + 1}</td>
                                                                            <td>{item.Combo.name}</td>
                                                                            <td>{item.amount}</td>
                                                                            <td>{item.Combo.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                                            <td>{total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                                        </tr>
                                                                    )
                                                                })}

                                                                {allValues.dataCombo && allValues.dataCombo.length === 0 &&
                                                                    <tr>
                                                                        <td colSpan={5} style={{ 'textAlign': 'center' }}>None</td>
                                                                    </tr>
                                                                }

                                                                {/* <tr>
                                                                    <td>February</td>
                                                                    <td>$80</td>
                                                                    <td>$100</td>
                                                                    <td>$100</td>
                                                                    <td>$100</td>
                                                                </tr> */}
                                                            </tbody>
                                                            {/* <tfoot>
                                                                <tr>
                                                                    <td>Sum</td>
                                                                    <td>$180</td>
                                                                    <td>$100</td>
                                                                    <td>$100</td>
                                                                    <td>$100</td>
                                                                </tr>
                                                            </tfoot> */}
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='content-ticket-three'>
                                                <div className='info-payment'>
                                                    <h6 style={{ 'marginBottom': '16px' }}>THÔNG TIN THANH TOÁN</h6>
                                                    <div className='row'>
                                                        <div className='col-3'>
                                                            <p><b>VAT</b></p>
                                                            <p><b>Mã khuyến mãi</b></p>
                                                            <p><b>Phương thức thanh toán</b></p>
                                                            <p><b>Thành tiền trước chiết khấu</b></p>
                                                            <p><b>Thành tiền sau chiết khấu</b></p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p>10%</p>
                                                            <p>{(allValues.listBooking && allValues.listBooking.voucherId) ? allValues.listBooking.voucherId : 'None'}</p>
                                                            <p>MOMO</p>
                                                            <p>{(allValues.listBooking && allValues.listBooking.price) ? allValues.listBooking.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : ''}</p>
                                                            <p>{(allValues.listBooking && allValues.listBooking.price) ? allValues.listBooking.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : ''}                                                                                                                                                                                                                                                                                                                                                                                                        </p>
                                                        </div>
                                                        <div className='col-6'></div>
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
