import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { updateStatusNews, deleteNews } from "../../services/NewsServices";
import { getDetailComment, deleteCommentService } from "../../services/NewsServices";
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './ListFeedback.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { getListFeedback } from '../../services/FeedbackServices';
import DatePicker from '../../containers/System/Share/DatePicker';
import moment from 'moment';
import { Button } from 'react-bootstrap';


function ListFeedback() {

    const [listFeedback, setFeedbackData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(true);

    const [allValues, setAllValues] = useState({
        isShowLoading: true,
        startTime: null,
        endTime: null,
        listFeedback: [],
        fullName: ''
    });


    let history = useHistory();
    const { id } = useParams();


    async function fetchFeedback(data) {

        // You can await here
        let feedbackData = {};
        if (data && (data.key || data.startTime || data.endTime)) {
            feedbackData = await getListFeedback({
                key: data.key,
                startTime: data.startTime,
                endTime: data.endTime
            });
        } else {
            feedbackData = await getListFeedback();
        }


        if (feedbackData && feedbackData.data) {

            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: false,
                listFeedback: feedbackData.data
            }));



        } else {

            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: false,
                listFeedback: []
            }));
        }
    }

    useEffect(() => {
        // setShowLoading(true);
        fetchFeedback();
    }, []);


    const handleChange = async (data) => {

        console.log('data: ', data);

        setShowLoading(true);

        let res = await updateStatusNews({
            id: data.id,
            status: !data.status
        })

        if (res && res.errCode === 0) {
            toast.success("Update status success")
            await fetchFeedback();
        }

    };

    const columns = [
        // { title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} /> },
        { title: 'ID', field: 'id' },
        { title: 'Tên khách hàng', field: 'fullName' },
        { title: 'Số điện thoại', field: 'phone' },
        { title: 'Ngày gửi', field: 'createdAt' },

    ]


    const handleOnDeleteComment = async (id) => {
        try {


            let res = await deleteCommentService(id);
            if (res && res.errCode === 0) {
                await fetchFeedback();
            } else {
                alert(res.errMessage)
            }

        } catch (e) {
            console.log(e);
        }
    }

    const handleOnChangeDatePicker = (date) => {
        setAllValues({ ...allValues, startTime: date[0] })
    }

    const handleOnChangeDatePickerEndTime = (date) => {
        setAllValues({ ...allValues, endTime: date[0] })
    }

    const handleSubmitFilter = async () => {
        console.log('allValue: ', allValues);
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true,
        }))

        let formatedDateStart = null;
        let formatedDateEnd = null;
        if (allValues.startTime) {
            formatedDateStart = new Date(allValues.startTime).getTime();
        }
        if (allValues.endTime) {
            formatedDateEnd = new Date(allValues.endTime).getTime();
        }

        await fetchFeedback({
            key: allValues.fullName,
            startTime: formatedDateStart,
            endTime: formatedDateEnd
        })
    }

    const handleClearFilter = () => {
        setAllValues((prevState) => ({
            ...prevState,
            startTime: null,
            endTime: null,
            fullName: ''
        }))
    }

    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
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
                <div id="wrapper" className='listFeedback-main'>
                    {/* Sidebar */}

                    <Sidebar />

                    {/* Sidebar */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            {/* TopBar */}
                            <Header />
                            {/* Topbar */}
                            <div className="col-lg-12 mb-4">

                                <div className="card mb-4 filter-form">
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Tra cứu</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group horizon-form form-filter">
                                            <div className='horizon-input '>

                                                <input className='form-control' name='fullName' value={allValues.fullName} onChange={changeHandler} placeholder='Nhập mã hoặc tên khách hàng' />
                                            </div>
                                            <div className='horizon-input input-date'>
                                                <label htmlFor="exampleInputEmail1">Từ</label>
                                                <DatePicker
                                                    onChange={handleOnChangeDatePicker}
                                                    className="form-control"
                                                    value={allValues.startTime || {}}
                                                />
                                            </div>
                                            <div className='horizon-input input-date'>
                                                <label htmlFor="exampleInputEmail1">Đến</label>
                                                <DatePicker
                                                    onChange={handleOnChangeDatePickerEndTime}
                                                    className="form-control"
                                                    value={allValues.endTime || {}}
                                                />
                                            </div>


                                            <div className='horizon-input button-filter-container'>
                                                <Button variant="primary" className="submit-feedback-data" onClick={handleSubmitFilter}>
                                                    <span className="visually">Submit</span>
                                                </Button>
                                                <Button variant="primary" className="clear-feedback-data" onClick={handleClearFilter}>
                                                    <span className="visually">Clear</span>
                                                </Button>
                                            </div>




                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 mb-4">
                                <MaterialTable
                                    title="Feedback"
                                    columns={columns}
                                    data={allValues.listFeedback}

                                    actions={[

                                        {

                                            icon: () => <i class="fas fa-info-circle" style={{ 'fontSize': '16px' }}></i>,
                                            onClick: async (event, rowData) => {
                                                history.push(`/feedback-detail/${rowData.id}`);
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

export default ListFeedback;
