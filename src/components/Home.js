import React, { useState, useEffect } from 'react';
import AdminMenu from '../containers/System/Share/AdminMenu';
import Sidebar from '../containers/System/Share/Sidebar';
import './Home.scss';
import Header from '../containers/System/Share/Header';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import Footer from '../containers/System/Share/Footer';
import LineChart from '../containers/System/Share/LineChart';
import PieChart from "../containers/System/Share/PieChart";
import { UserData } from "../containers/System/Share/Data";
import { userState } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { getAllMovieTheater, getTheaterSales, getEditMovieTheater, countRoomMovieTheater, counTicketMovieTheater, getEachTheaterRevenue } from '../services/MovieTheater';
import BarChart from "../containers/System/Share/BarChart";
import { countTicket, getAllFilmsByStatus, getMovieRevenue, countBookingTypeMovie } from '../services/FilmsServices';
import { getUserByRole } from '../services/UserService';
import { countSalesMonth } from '../services/BookingServices';
import moment from 'moment';



export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
    },
};



function Home() {
    let selectUser = useSelector(userState);


    const [userData, setUserData] = useState({});

    const [priceTheaterData, setPriceTheaterData] = useState({});

    const [ticketMovieData, setTicketMovie] = useState({});
    const [ticketMovieTodayData, setTicketMovieToday] = useState({});
    const [typeMovieData, setTypeMovieData] = useState({});


    const [allValues, setAllValues] = useState({
        roleId: null,
        isShowLoading: true,
        movieTheaterId: '',
        dataSales: 0,
        nameTheater: '',
        amountRoom: 0,
        amoutCustomer: 0,
        amountPrice: 0,
        typeSales: moment(new Date()).format('MM/YYYY'),
        selectType: 2
    });


    async function fetchAllFilms() {
        let dataMovie = await getAllFilmsByStatus(1);
        setAllValues((prevState) => ({
            ...prevState,
            totalFilms: (dataMovie && dataMovie.totalData) ? dataMovie.totalData : 0,
            isShowLoading: false
        }));

    }



    useEffect(() => {
        fetchAllFilms()
    }, []);



    useEffect(() => {
        async function fetchAllData() {

            let nameTheater = '';
            if (selectUser.adminInfo.movietheaterid) {
                let dataTheater = await getEditMovieTheater(selectUser.adminInfo.movietheaterid);
                let amountRoom = await countRoomMovieTheater(selectUser.adminInfo.movietheaterid);
                let countCustomer = await getUserByRole(4);
                nameTheater = (dataTheater && dataTheater.data && dataTheater.data.tenRap) ? dataTheater.data.tenRap : ''

                setAllValues((prevState) => ({
                    ...prevState,
                    nameTheater,
                    amountRoom: (amountRoom && amountRoom.data) ? amountRoom.data : 0,
                    movieTheaterId: selectUser.adminInfo.movietheaterid,
                    amoutCustomer: (countCustomer && countCustomer.data) ? countCustomer.data.length : 0,
                }));
            }

            // Admin //
            if (selectUser.adminInfo.roleId) {
                // Fecth all movieTheater // 
                let dataMovieTheater = await getAllMovieTheater();

                let amountTicket = await countTicket();
                let dataSales = await countSalesMonth();
                let countCustomer = await getUserByRole(4);
                let countTicketTheater = await counTicketMovieTheater((selectUser.adminInfo.movietheaterid ? selectUser.adminInfo.movietheaterid : null));
                let eachTheaterRevenue = await getEachTheaterRevenue((selectUser.adminInfo.movietheaterid ? selectUser.adminInfo.movietheaterid : null), 2);
                let movieRevenueToday = await getMovieRevenue(1);
                let movieRevenueAllday = await getMovieRevenue();
                let countTypeMovie = await countBookingTypeMovie();




                if (amountTicket && amountTicket.dataMovie && dataMovieTheater && dataMovieTheater.movie) {


                    setUserData({
                        labels: countTicketTheater.data.map((data) => data.nameTheater),
                        datasets: [
                            {
                                label: "Số lượng vé",
                                data: countTicketTheater.data.map((data) => data.countTicket),
                                backgroundColor: [
                                    "#3e95cd",
                                    "#8e5ea2",
                                    "#3cba9f",
                                    "#e8c3b9",
                                    "#c45850"
                                ],
                                borderColor: [
                                    "#3e95cd",
                                    "#8e5ea2",
                                    "#3cba9f",
                                    "#e8c3b9",
                                    "#c45850"
                                ],
                            },
                        ],
                    })

                    let dataPrice = eachTheaterRevenue.data;
                    let arrMonth = dataPrice.map(item => item.createdAt);
                    let uniqueChars = [...new Set(arrMonth)];

                    console.log('dataPrice: ', dataPrice)

                    const result = dataPrice.reduce((r, { tenRap, sum, createdAt }) => {
                        let arrSum = [];

                        if (r[tenRap]) {
                            arrSum = r[tenRap].arrSum;
                            arrSum.push(sum)

                            r[tenRap] = { tenRap, arrSum }
                        }
                        else {
                            arrSum.push(sum)

                            r[tenRap] = { tenRap, arrSum }
                        };
                        return r;
                    }, {})

                    // Fix tạm //
                    if (!selectUser.adminInfo.movietheaterid) {
                        Object.keys(result).map(function (key, index) {
                            if (result[key].arrSum.length === 1) {
                                result[key].arrSum.unshift(0);
                            }
                        })
                    }


                    setPriceTheaterData({
                        labels: uniqueChars,
                        datasets:
                            Object.keys(result).map(function (key, index) {
                                // console.log(result[key].arrSum)
                                return (
                                    {
                                        label: result[key].tenRap,
                                        data: result[key].arrSum.map(item => item),
                                        backgroundColor: [
                                            "#3e95cd",
                                            "#8e5ea2",
                                            "#3cba9f",
                                            "#e8c3b9",
                                            "#c45850"
                                        ],

                                        borderColor: [
                                            "#3e95cd",
                                            "#8e5ea2",
                                            "#3cba9f",
                                            "#e8c3b9",
                                            "#c45850"
                                        ],
                                    }
                                )
                            })
                    })


                    setTicketMovie({
                        labels: movieRevenueAllday.dataMovie.map((data) => data.nameMovie),
                        datasets: [
                            {
                                label: 'Vé',
                                data: movieRevenueAllday.dataMovie.map((data) => data.sum),
                                backgroundColor: [
                                    "#3e95cd",
                                    "#8e5ea2",
                                    "#3cba9f",
                                    "#e8c3b9",
                                    "#c45850"
                                ],

                            },
                        ],
                    })




                    setTicketMovieToday({
                        labels: movieRevenueToday.dataMovie.map((data) => data.nameMovie),
                        datasets: [
                            {
                                label: 'Vé',
                                data: movieRevenueToday.dataMovie.map((data) => data.sum),
                                backgroundColor: [
                                    "#3e95cd",
                                    "#8e5ea2",
                                    "#3cba9f",
                                    "#e8c3b9",
                                    "#c45850"
                                ],

                            },
                        ],
                    })


                    let dataTypeMovie = countTypeMovie.dataMovie;



                    let sum = 0
                    dataTypeMovie.map((item, index) => {
                        sum += item.count;
                    })

                    dataTypeMovie.map((item, index) => {
                        item.percent = +((item.count) / sum * 100).toFixed(2);
                        return item;
                    })


                    setTypeMovieData({
                        labels: dataTypeMovie.map((data) => data.nameType),
                        datasets: [
                            {
                                label: 'Thể loại',
                                data: dataTypeMovie.map((data) => data.percent),
                                backgroundColor: [
                                    "#3e95cd",
                                    "#8e5ea2",
                                    "#3cba9f",
                                    "#e8c3b9",
                                    "#c45850"
                                ],

                            },
                        ],
                    })


                    setAllValues((prevState) => ({
                        ...prevState,
                        roleId: selectUser.adminInfo.roleId,
                        listTheater: dataMovieTheater.movie,
                        dataTicket: amountTicket.dataMovie,
                        countTicket: (countTicketTheater && countTicketTheater.data[0] && countTicketTheater.data[0].countTicket) ? countTicketTheater.data[0].countTicket : 0,
                        dataSales: (dataSales && dataSales.dataSales && dataSales.dataSales[0].PriceCount),
                        amoutCustomer: (countCustomer && countCustomer.data) ? countCustomer.data.length : 0,
                        totalPrice: (eachTheaterRevenue && eachTheaterRevenue.data) ? eachTheaterRevenue.data : {},
                        isShowLoading: false,
                        uniqueChars: [...new Set(arrMonth)],
                        amountPrice: dataPrice[dataPrice.length - 1].sum
                    }));

                }


            } else {


                handleClickTheater(selectUser.adminInfo.movietheaterid)
            }

        }

        fetchAllData();

    }, [selectUser]);



    // const handleClickTheater = async (id) => {
    //     setAllValues((prevState) => ({
    //         ...prevState,
    //         isShowLoading: true
    //     }));

    //     // Fetch doanh thu //
    //     let dataSales = await getTheaterSales({
    //         movieTheaterId: id
    //     })



    //     if (dataSales && dataSales.data) {

    //         setAllValues((prevState) => ({
    //             ...prevState,
    //             isShowLoading: false,
    //             movieTheaterId: id,
    //             amountPrice: (dataSales.data[dataSales.data.length - 1] && dataSales.data[dataSales.data.length - 1].price) ? dataSales.data[dataSales.data.length - 1].price : 0
    //         }));


    //         setUserData({
    //             labels: dataSales.data.map((data) => data.monthyear),
    //             datasets: [
    //                 {
    //                     label: "Doanh thu",
    //                     data: dataSales.data.map((data) => data.price),
    //                     fill: false,
    //                     lineTension: 0.1,
    //                     backgroundColor: 'rgba(75,192,192,0.4)',
    //                     borderColor: 'linear-gradient(to right, red, purple)',
    //                     pointBorderColor: '#111',
    //                     pointBackgroundColor: '#ff4000',
    //                     pointBorderWidth: 2,
    //                     backgroundColor: 'rgba(52, 152, 219, 0.75)',

    //                 },
    //             ],
    //         })
    //     }



    // }

    const handleClickTheater = async (id) => {
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        // Fetch doanh thu //
        // console.log(id)
        let countTicketTheater = await counTicketMovieTheater(id);

        // console.log('countTicketTheater: ', countTicketTheater)

        if (countTicketTheater && countTicketTheater.data) {

            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: false,
                movieTheaterId: id,

            }));


            setUserData({
                labels: countTicketTheater.data.map((data) => data.nameTheater),
                datasets: [
                    {
                        label: "Số lượng vé",
                        data: countTicketTheater.data.map((data) => data.countTicket),
                        backgroundColor: [
                            "#3e95cd",
                            "#8e5ea2",
                            "#3cba9f",
                            "#e8c3b9",
                            "#c45850"
                        ],

                    },
                ],
            })
        }



    }



    const handleClickTheaterSales = async (id) => {

        console.log('allValues.uniqueChars: ', allValues.uniqueChars);

        let eachTheaterRevenue = await getEachTheaterRevenue(id, allValues.selectType);
        // console.log(eachTheaterRevenue)
        // setAllValues((prevState) => ({
        //     ...prevState,
        //     selectType: type

        // }));

        let dataPrice = eachTheaterRevenue.data;

        let arrMonth = dataPrice.map(item => item.createdAt);

        let uniqueChars = [...new Set(arrMonth)];

        console.log('uniqueChars: ', uniqueChars)



        const result = dataPrice.reduce((r, { tenRap, sum, createdAt }) => {
            let arrSum = [];

            if (r[tenRap]) {

                // console.log('r[tenRap]: ', r[tenRap])
                arrSum = r[tenRap].arrSum;
                arrSum.push(sum)

                r[tenRap] = { tenRap, arrSum }
            }
            else {
                arrSum.push(sum)

                r[tenRap] = { tenRap, arrSum }
            };
            return r;
        }, {})

        if (allValues.selectType === 2) {
            // Fix tạm //
            Object.keys(result).map(function (key, index) {
                if (result[key].arrSum.length === 1) {
                    result[key].arrSum.unshift(0);
                }
            })
        }



        setPriceTheaterData({
            labels: uniqueChars,
            datasets:
                Object.keys(result).map(function (key, index) {
                    console.log(result[key].arrSum)
                    return (
                        {
                            label: result[key].tenRap,
                            data: result[key].arrSum.map(item => item),
                            backgroundColor: [
                                "#3e95cd",
                                "#8e5ea2",
                                "#3cba9f",
                                "#e8c3b9",
                                "#c45850"
                            ],

                            borderColor: [
                                "#3e95cd",
                                "#8e5ea2",
                                "#3cba9f",
                                "#e8c3b9",
                                "#c45850"
                            ],
                        }
                    )
                })
        })



    }

    const handleSelectType = async (type) => {

        let eachTheaterRevenue = await getEachTheaterRevenue((allValues.movieTheaterId ? allValues.movieTheaterId : null), type);
        console.log(eachTheaterRevenue)


        let dataPrice = eachTheaterRevenue.data;

        let arrMonth = dataPrice.map(item => item.createdAt);

        let uniqueChars = [...new Set(arrMonth)];


        const result = dataPrice.reverse().reduce((r, { tenRap, sum, createdAt }) => {
            let arrSum = [];

            if (r[tenRap]) {

                // console.log('r[tenRap]: ', r[tenRap])
                arrSum = r[tenRap].arrSum;
                arrSum.push(sum)

                r[tenRap] = { tenRap, arrSum }
            }
            else {
                arrSum.push(sum)

                r[tenRap] = { tenRap, arrSum }
            };
            return r;
        }, {})

        if (type === 2) {
            // Fix tạm //
            if (!allValues.movieTheaterId) {
                Object.keys(result).map(function (key, index) {
                    if (result[key].arrSum.length === 1) {
                        result[key].arrSum.unshift(0);
                    }
                })
            }

        }



        console.log('result: ', result);

        setAllValues((prevState) => ({
            ...prevState,
            selectType: type,
            uniqueChars: [...new Set(arrMonth)]

        }));

        setPriceTheaterData({
            labels: (type === 2) ? uniqueChars.reverse() : uniqueChars,
            datasets:
                Object.keys(result).map(function (key, index) {
                    console.log(result[key].arrSum)
                    return (
                        {
                            label: result[key].tenRap,
                            data: result[key].arrSum.map(item => item),
                            backgroundColor: [
                                "#3e95cd",
                                "#8e5ea2",
                                "#3cba9f",
                                "#e8c3b9",
                                "#c45850"
                            ],

                            borderColor: [
                                "#3e95cd",
                                "#8e5ea2",
                                "#3cba9f",
                                "#e8c3b9",
                                "#c45850"
                            ],
                        }
                    )
                })
        })


    }




    return (
        <>
            <div id="wrapper">
                {/* Sidebar */}

                <Sidebar />

                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column dk-dashboard">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}
                        {/* Container Fluid*/}
                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                {!allValues.nameTheater &&
                                    <h1 className="h3 mb-0 text-gray-800">DKCinema Dashboard</h1>
                                }

                                {allValues.nameTheater &&
                                    <h1 className="h3 mb-0 text-gray-800">{allValues.nameTheater}</h1>
                                }
                                {/* {allValues.movieTheate} */}
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="./">Home</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                                </ol>
                            </div>
                            <div className="row mb-3">
                                {/* Earnings (Monthly) Card Example */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">Tổng phim đang chiếu</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800" >{allValues.totalFilms} phim</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-film fa-2x text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Earnings (Annual) Card Example */}
                                {selectUser.adminInfo && selectUser.adminInfo.movietheaterid === null &&
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">Số Lượng Khách hàng</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{allValues.amoutCustomer} khách hàng</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-users fa-2x text-success" />
                                                        <i class="fas fa-camera-movie"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* New User Card Example */}
                                {selectUser.adminInfo && selectUser.adminInfo.movietheaterid !== null &&
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">Số lượng phòng chiếu</div>
                                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{allValues.amountRoom} phòng</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-video fa-2x text-info" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {selectUser.adminInfo && selectUser.adminInfo.movietheaterid !== null &&
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">Số lượng vé</div>
                                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{allValues.countTicket} vé</div>
                                                    </div>
                                                    <div className="col-auto">

                                                        <i className="fas fa-ticket-alt fa-2x text-info" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {selectUser.adminInfo && selectUser.adminInfo.movietheaterid === null &&
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">Số lượng rạp</div>
                                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{(allValues.listTheater && allValues.listTheater.length) ? allValues.listTheater.length : 0} rạp</div>
                                                    </div>
                                                    <div className="col-auto">

                                                        <i className="fas fa-video fa-2x text-info" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* Pending Requests Card Example */}

                                {selectUser.adminInfo && selectUser.adminInfo.movietheaterid !== null &&
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">Doanh thu {moment().format('MM/YYYY')}</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{allValues.amountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                                                    </div>
                                                    <div className="col-auto">

                                                        <i className="fas fa-money-check fa-2x text-info" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {selectUser.adminInfo && selectUser.adminInfo.movietheaterid === null &&
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">Doanh thu {moment().format('MM/YYYY')}</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{allValues.dataSales.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-money-check fa-2x text-info" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }


                                {selectUser.adminInfo && selectUser.adminInfo.roleId === 1 &&
                                    <>

                                        <div className="col-xl-4 col-lg-5">
                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <h6 className="m-0 font-weight-bold text-primary">Số lượng vé bán theo rạp</h6>
                                                </div>
                                                <div className="card-body list-theater">
                                                    {allValues.listTheater && allValues.listTheater.length > 0 && allValues.listTheater.map((item, index) => {
                                                        return (
                                                            <div className="card h-100 item-theater" key={index} onClick={() => handleClickTheater(item.id)}>
                                                                <div className="card-body">
                                                                    <div className="row align-items-center">
                                                                        <div className="col mr-2">
                                                                            <div className="text-xs font-weight-bold text-uppercase mb-1">{item.tenRap}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}



                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-xl-8 col-lg-7 mb-4">



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

                                                {(selectUser.adminInfo && selectUser.adminInfo.roleId === 1) && Object.keys(userData).length !== 0 &&
                                                    <>

                                                        <div className="card mb-4">
                                                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                                <div className='title-pie'>
                                                                    <h6 className="m-0 font-weight-bold text-primary">Số lượng vé bán ngày {moment(new Date()).format('DD/MM/YYYY')}</h6>
                                                                </div>

                                                            </div>
                                                            <div className="card-body">
                                                                <BarChart options={options} chartData={userData} />

                                                            </div>
                                                        </div>
                                                    </>
                                                }


                                            </LoadingOverlay>


                                        </div>
                                    </>
                                }

                                {selectUser.adminInfo && selectUser.adminInfo.roleId === 1 &&
                                    <>

                                        <div className="col-xl-4 col-lg-5">
                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <h6 className="m-0 font-weight-bold text-primary">Doanh thu theo rạp</h6>
                                                    <div className="dropdown no-arrow">
                                                        <a className="dropdown-toggle btn btn-primary btn-sm" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            {(allValues.selectType === 1) ? 'Day' : 'Month'} <i className="fas fa-chevron-down" />
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                                            <div className="dropdown-header">Select Periode</div>
                                                            <a className={(allValues.selectType === 1 ? 'dropdown-item active' : 'dropdown-item')} onClick={() => handleSelectType(1)}>Day</a>
                                                            <a className={(allValues.selectType === 2 ? 'dropdown-item active' : 'dropdown-item')} onClick={() => handleSelectType(2)}>Month</a>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card-body list-theater">
                                                    {allValues.listTheater && allValues.listTheater.length > 0 && allValues.listTheater.map((item, index) => {
                                                        return (
                                                            <div className="card h-100 item-theater" key={index} onClick={() => handleClickTheaterSales(item.id)}>
                                                                <div className="card-body">
                                                                    <div className="row align-items-center">
                                                                        <div className="col mr-2">
                                                                            <div className="text-xs font-weight-bold text-uppercase mb-1">{item.tenRap}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}



                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-xl-8 col-lg-7 mb-4">

                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <div className='title-pie'>
                                                        <h6 className="m-0 font-weight-bold text-primary">Doanh thu {(allValues.selectType === 2) ? '6 tháng' : '7 ngày'} gần nhất</h6>
                                                    </div>

                                                </div>
                                                <div className="card-body">
                                                    {
                                                        priceTheaterData && priceTheaterData.datasets &&
                                                        <LineChart chartData={priceTheaterData} />
                                                    }

                                                </div>
                                            </div>

                                        </div>
                                    </>
                                }


                                {selectUser.adminInfo && selectUser.adminInfo.roleId === 1 &&
                                    <>

                                        <div className="col-xl-6 col-lg-6">
                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <div className='title-pie'>
                                                        <h6 className="m-0 font-weight-bold text-primary">Doanh thu phim hôm nay</h6>
                                                    </div>

                                                </div>
                                                <div className="card-body">
                                                    {ticketMovieTodayData && ticketMovieTodayData.datasets &&
                                                        <BarChart options={options} chartData={ticketMovieTodayData} />
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xl-6 col-lg-6 mb-4">

                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <div className='title-pie'>
                                                        <h6 className="m-0 font-weight-bold text-primary">Tổng doanh thu của phim</h6>
                                                    </div>

                                                </div>
                                                <div className="card-body">
                                                    {ticketMovieData && ticketMovieData.datasets &&
                                                        <BarChart options={options} chartData={ticketMovieData} />
                                                    }

                                                </div>
                                            </div>

                                        </div>
                                    </>
                                }


                                {selectUser.adminInfo && selectUser.adminInfo.roleId !== 1 &&
                                    <>

                                        <div className="col-xl-4 col-lg-5">
                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <h6 className="m-0 font-weight-bold text-primary">Doanh thu rạp</h6>
                                                    <div className="dropdown no-arrow">
                                                        <a className="dropdown-toggle btn btn-primary btn-sm" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            {(allValues.selectType === 1) ? 'Today' : 'Month'} <i className="fas fa-chevron-down" />
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                                            <div className="dropdown-header">Select Periode</div>
                                                            <a className={(allValues.selectType === 1 ? 'dropdown-item active' : 'dropdown-item')} onClick={() => handleSelectType(1)}>Today</a>
                                                            <a className={(allValues.selectType === 2 ? 'dropdown-item active' : 'dropdown-item')} onClick={() => handleSelectType(2)}>Month</a>

                                                        </div>
                                                    </div>
                                                </div>

                                                {/* {console.log('allValues.movieTheaterId: ', allValues.movieTheaterId)} */}

                                                <div className="card-body">
                                                    {allValues.listTheater && allValues.listTheater.length > 0 && allValues.listTheater.map((item, index) => {
                                                        if (item.id === allValues.movieTheaterId) {
                                                            return (
                                                                <div className="card h-100 item-theater" key={index} >
                                                                    <div className="card-body">
                                                                        <div className="row align-items-center">
                                                                            <div className="col mr-2">
                                                                                <div className="text-xs font-weight-bold text-uppercase mb-1">{item.tenRap}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }

                                                    })}

                                                </div>



                                            </div>

                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <div className='title-pie'>
                                                        <h6 className="m-0 font-weight-bold text-primary">Lượng xem thể loại (%)</h6>
                                                    </div>

                                                </div>
                                                <div className="card-body">
                                                    {typeMovieData && typeMovieData.datasets &&
                                                        <PieChart chartData={typeMovieData} />
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xl-8 col-lg-7 mb-4">

                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <div className='title-pie'>
                                                        <h6 className="m-0 font-weight-bold text-primary">Doanh thu {(allValues.selectType === 2) ? '6 tháng' : '7 ngày'} gần nhất</h6>
                                                    </div>

                                                </div>
                                                <div className="card-body">
                                                    {
                                                        priceTheaterData && priceTheaterData.datasets &&
                                                        <LineChart chartData={priceTheaterData} />
                                                    }

                                                </div>
                                            </div>

                                        </div>
                                    </>
                                }

                                {selectUser.adminInfo && selectUser.adminInfo.roleId !== 1 &&
                                    <>

                                        <div className="col-xl-6 col-lg-6">
                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <div className='title-pie'>
                                                        <h6 className="m-0 font-weight-bold text-primary">Doanh thu phim hôm nay</h6>
                                                    </div>

                                                </div>
                                                <div className="card-body">
                                                    {ticketMovieTodayData && ticketMovieTodayData.datasets &&
                                                        <BarChart options={options} chartData={ticketMovieTodayData} />
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xl-6 col-lg-6 mb-4">

                                            <div className="card mb-4">
                                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <div className='title-pie'>
                                                        <h6 className="m-0 font-weight-bold text-primary">Tổng doanh thu của phim</h6>
                                                    </div>

                                                </div>
                                                <div className="card-body">
                                                    {ticketMovieData && ticketMovieData.datasets &&
                                                        <BarChart options={options} chartData={ticketMovieData} />
                                                    }

                                                </div>
                                            </div>

                                        </div>
                                    </>

                                }

                                {selectUser.adminInfo && selectUser.adminInfo.roleId === 1 &&
                                    <div className="col-xl-4 col-lg-6">
                                        <div className="card mb-4">
                                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                <div className='title-pie'>
                                                    <h6 className="m-0 font-weight-bold text-primary">Lượng xem thể loại (%)</h6>
                                                </div>

                                            </div>
                                            <div className="card-body">
                                                {typeMovieData && typeMovieData.datasets &&
                                                    <PieChart chartData={typeMovieData} />
                                                }

                                            </div>
                                        </div>
                                    </div>

                                }

                            </div>
                            {/*Row*/}


                        </div>
                        {/*-Container Fluid*/}
                    </div>
                    {/* Footer */}
                    <Footer />
                    {/* Footer */}
                </div>
            </div>
            {/* <Header />





            <AdminMenu /> */}

            {/* Main Menu area End*/}
            {/* Start Status area */}


        </>
    );
}

export default Home;
