import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './DetailFeedback.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";
import moment from 'moment';
import { useParams } from 'react-router-dom';
// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css'
import { getDetailFeedback } from '../../services/FeedbackServices';
import { Link } from "react-router-dom";






function DetailFeedback() {
    const { id } = useParams();
    const [allValues, setAllValues] = useState({
        isShowLoading: false,
        detailFeedback: null,
        isLoadingButton: false
    });

    let history = useHistory();
    let selectUser = useSelector(userState);




    const fetchDetailFeedback = async () => {
        let dateToday = moment().format('dddd, MMMM Do, YYYY');

        let feedbackData = await getDetailFeedback(id);

        if (feedbackData && feedbackData.data) {
            setAllValues((prevState) => ({
                ...prevState,
                detailFeedback: feedbackData.data,
                dateToday
            }))
        }


    }







    useEffect(() => {
        fetchDetailFeedback();
    }, []);


    useEffect(() => {
        if (selectUser.adminInfo && selectUser.adminInfo.movietheaterid) {

            // fetchAllData(id, 1, 1)

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
                <div id="wrapper" className='detail-feedback-main'>
                    {/* Sidebar */}

                    <Sidebar />

                    {/* Sidebar */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            {/* TopBar */}
                            <Header />
                            {/* Topbar */}
                            <div className='container-fluid'>
                                <div className="d-sm-flex align-items-center justify-content-between mb-4">

                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>
                                        <li className="breadcrumb-item"><Link to={`/showTime-management`}>Quản lý phản hồi</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">Chi tiết phản hồi</li>
                                    </ol>
                                    <span className='date-today'>{allValues.dateToday}</span>
                                    {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                                </div>
                                <div className="col-lg-12 mb-4">

                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div className='row feedback-main'>
                                                <div className='col-4 info-cus-container'>
                                                    <h5>Thông tin khách hàng</h5>
                                                    <div className='row content-info'>
                                                        <div className='col-12 wrap-nameCus'>
                                                            <p><b>Họ tên:</b></p>
                                                            <p className='nameCus'>{(allValues.detailFeedback) ? allValues.detailFeedback.fullName : ''}</p>
                                                        </div>
                                                        <div className='col-12 wrap-nameCus'>
                                                            <p><b>Email:</b></p>
                                                            <p className='nameCus'>{(allValues.detailFeedback) ? allValues.detailFeedback.email : ''}</p>
                                                        </div>
                                                        <div className='col-12 wrap-nameCus'>
                                                            <p><b>Số điện thoại:</b></p>
                                                            <p className='nameCus'>{(allValues.detailFeedback) ? allValues.detailFeedback.phone : ''}</p>
                                                        </div>
                                                        <div className='col-12 wrap-nameCus'>
                                                            <p><b>Ngày gửi:</b></p>
                                                            <p className='nameCus'>{(allValues.detailFeedback) ? moment(allValues.detailFeedback.createdAt).format('DD/MM/YYYY') : ''}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-8 feedback-container'>
                                                    <h5>Nội dung phản hồi</h5>
                                                    <div className='text-content-feedback'>
                                                        <p>
                                                            {(allValues.detailFeedback) ? allValues.detailFeedback.content : ''}
                                                        </p>
                                                    </div>
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
                </div>

            </LoadingOverlay>

        </>
    );
}

export default DetailFeedback;
