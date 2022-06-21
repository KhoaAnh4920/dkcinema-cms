import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import Swal from 'sweetalert2';
import moment from 'moment';
import { toast } from 'react-toastify';
import Footer from '../../containers/System/Share/Footer';
import Select from 'react-select';
import './DetailFilm.scss';
import DatePicker from '../../containers/System/Share/DatePicker';
import Sidebar from '../../containers/System/Share/Sidebar';
import { CommonUtils } from '../../utils';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import { getDetailFilm } from '../../services/FilmsServices';
import { useParams } from 'react-router-dom';



//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';


//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import "antd/dist/antd.css";



export default function DetailFilm() {
    const [startDate, setStartDate] = useState(new Date());

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
    const [valImg, setValImg] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    })
    const [typeCheck, setUserInfo] = useState({
        typeMovie: [],
        response: [],
    });
    const { id } = useParams();
    let history = useHistory();




    useEffect(() => {
        async function fetchDetailMovie(){
            let dataMovie = await getDetailFilm(id);
            console.log("dataMovie:", dataMovie);
            if(dataMovie && dataMovie.data){
                setAllValues({
                    poster: dataMovie.data.ImageOfMovie[0].url,
                    id: id,
                    name: dataMovie.data.name,
                    transName: dataMovie.data.transName,
                    country: dataMovie.data.country,
                    duration: dataMovie.data.duration,
                    language: dataMovie.data.language,
                    releaseTime: dataMovie.data.releaseTime,
                    brand: dataMovie.data.brand,
                    cast:  dataMovie.data.cast,
                    typeMovie: dataMovie.data.MovieOfType,
                    status: dataMovie.data.status,
                    description: dataMovie.data.description
                })
               
            }
        }
        fetchDetailMovie();
    }, []);









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
                                    <li className="breadcrumb-item">Quản lý người dùng</li>
                                    <li className="breadcrumb-item active" aria-current="page">Thêm người dùng</li>
                                </ol>
                                <span className='date-today'>{allValues.dateToday}</span>
                                {/* <i className="fa fa-arrow-left previous-page" aria-hidden="true" onClick={() => history.goBack()}></i> */}
                            </div>
                            <div className="row">
                                <div className='col-1'></div>
                                <div className="col-10">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h5 className="m-0 font-weight-bold text-primary">THÔNG TIN CHI TIẾT PHIM</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className='row'>
                                                <div className='col-4 img-poster'>
                                                <img src={allValues.poster} />
                                                </div>
{/* 
                                                poster: dataMovie.data.ImageOfMovie[0].url,
                                                id: id,
                                                name: dataMovie.data.name,
                                                transName: dataMovie.data.transName,
                                                country: dataMovie.data.country,
                                                duration: dataMovie.data.duration,
                                                language: dataMovie.data.language,
                                                releaseTime: dataMovie.data.releaseTime,
                                                brand: dataMovie.data.brand,
                                                cast:  dataMovie.data.cast,
                                                typeMovie: dataMovie.data.MovieOfType,
                                                status: dataMovie.data.status,
                                                description: dataMovie.data.description */}

                                                <div className='col-8 film-content'>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Mã phim</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{allValues.id}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Tên phim</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{allValues.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Tên phiên dịch</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{allValues.transName}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Quốc gia</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{allValues.country}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Thời lượng</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{allValues.duration} phút</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Ngôn ngữ</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{allValues.language}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Ngày công chiếu</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{moment(allValues.releaseTime).format('MM/DD/YYYY')}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Nhà sản xuất</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{allValues.brand}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Diễn viên</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{allValues.cast}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Thể loại phim</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            {
                                                                allValues.typeMovie.map((item, index)=>{
                                                                    return(
                                                                        <p key={index}>{item.name}</p>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content'>
                                                        <div className='content-left'>
                                                            <p>Trạng thái</p>
                                                        </div>
                                                        <div className='content-right'>
                                                            <p>{(allValues.status) ? 'Đang chiếu' :'Sắp chiếu'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='wrap-content-desc'>
                                                        <div className='content-top'>
                                                            <p>Mô tả</p>
                                                        </div>
                                                        <div className='content-bottom'>
                                                            <p>{allValues.description}</p>
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
