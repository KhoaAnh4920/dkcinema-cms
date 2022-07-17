import React, { useState, useEffect } from 'react';
import AdminMenu from '../containers/System/Share/AdminMenu';
import Sidebar from '../containers/System/Share/Sidebar';
import './Home.scss';
import Header from '../containers/System/Share/Header';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import Footer from '../containers/System/Share/Footer';
import LineChart from '../containers/System/Share/LineChart';
import { UserData } from "../containers/System/Share/Data";
import { userState } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { getAllMovieTheater, getTheaterSales } from '../services/MovieTheater';
import BarChart from "../containers/System/Share/BarChart";
import { countTicket, getAllFilmsByStatus } from '../services/FilmsServices';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// );

// export const options = {
//     responsive: true,
//     plugins: {
//         legend: {
//             position: 'top',
//         },
//         title: {
//             display: true,
//             text: 'Chart.js Bar Chart',
//         },
//     },
// };

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// export const data = {
//     labels,
//     datasets: [
//         {
//             label: 'Dataset 1',
//             data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         },
//         {
//             label: 'Dataset 2',
//             data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//             backgroundColor: 'rgba(53, 162, 235, 0.5)',
//         },
//     ],
// };

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
    // const [userData, setUserData] = useState({
    //     labels: UserData.map((data) => data.year),
    //     datasets: [
    //         {
    //             label: "Users Gained",
    //             data: UserData.map((data) => data.userGain),
    //             backgroundColor: [
    //                 "#3e95cd",
    //                 "#8e5ea2",
    //                 "#3cba9f",
    //                 "#e8c3b9",
    //                 "#c45850"
    //             ],

    //             // borderColor: "black",
    //             // borderWidth: 2,
    //         },
    //     ],
    // });

    const [userData, setUserData] = useState({});


    const [allValues, setAllValues] = useState({
        roleId: null,
        isShowLoading: true,
        movieTheaterId: null
    });






    useEffect(() => {
        async function fetchAllData() {

            // Admin //
            if (selectUser.adminInfo.roleId === 1) {
                // Fecth all movieTheater // 
                let dataMovieTheater = await getAllMovieTheater();

                let amountTicket = await countTicket();
                let dataMovie = await getAllFilmsByStatus(1);


                if (amountTicket && amountTicket.dataMovie && dataMovieTheater && dataMovieTheater.movie) {


                    setAllValues({
                        ...allValues,
                        roleId: selectUser.adminInfo.roleId,
                        listTheater: dataMovieTheater.movie,
                        dataTicket: amountTicket.data,
                        isShowLoading: false,
                        totalFilms: (dataMovie && dataMovie.totalData) ? dataMovie.totalData : 0
                    })
                    setUserData({
                        labels: amountTicket.dataMovie.map((data) => data.nameMovie),
                        datasets: [
                            {
                                label: "Số lượng vé",
                                data: amountTicket.dataMovie.map((data) => data.count),
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

        }

        fetchAllData();

    }, [selectUser]);



    const handleClickTheater = async (id) => {
        setAllValues({
            ...allValues,
            isShowLoading: true
        })
        // Fetch doanh thu //
        let dataSales = await getTheaterSales({
            movieTheaterId: id
        })

        if (dataSales && dataSales.data) {
            console.log('dataSales: ', dataSales)
            setAllValues({
                ...allValues,
                isShowLoading: false,
                movieTheaterId: id
            })

            setUserData({
                labels: dataSales.data.map((data) => data.monthyear),
                datasets: [
                    {
                        label: "Doanh thu",
                        data: dataSales.data.map((data) => data.price),
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'linear-gradient(to right, red, purple)',
                        pointBorderColor: '#111',
                        pointBackgroundColor: '#ff4000',
                        pointBorderWidth: 2,
                        backgroundColor: 'rgba(52, 152, 219, 0.75)',

                    },
                ],
            })
        }



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
                                <h1 className="h3 mb-0 text-gray-800">DKCinema Dashboard</h1>
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
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">Phim đang chiếu</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800" >{allValues.totalFilms} phim</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-music fa-2x text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Earnings (Annual) Card Example */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">Số Lượng Khách hàng</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800"> 20 khách hàng</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-guitar fa-2x text-success" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* New User Card Example */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">Số lượng rạp</div>
                                                    <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">2 rạp</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-play fa-2x text-info" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Pending Requests Card Example */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">Tổng doanh thu</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">3.000.000 VNĐ</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-users fa-2x text-info" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="col-xl-4 col-lg-5">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Doanh thu theo rạp</h6>
                                            {/* <div className="dropdown no-arrow">
                                                <a className="dropdown-toggle btn btn-primary btn-sm" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Month <i className="fas fa-chevron-down" />
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                                    <div className="dropdown-header">Select Periode</div>
                                                    <a className="dropdown-item" href="#">Today</a>
                                                    <a className="dropdown-item" href="#">Week</a>
                                                    <a className="dropdown-item active" href="#">Month</a>
                                                    <a className="dropdown-item" href="#">This Year</a>
                                                </div>
                                            </div> */}
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
                                {/* Invoice Example */}
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

                                        <div className='col-12 title-chart'>
                                            <p>Số lượng vé của từng phim</p>

                                        </div>
                                        {(allValues.roleId === 1 && allValues.movieTheaterId === null) && Object.keys(userData).length !== 0 &&
                                            <BarChart options={options} chartData={userData} />
                                        }


                                        {(allValues.roleId !== 1 || allValues.movieTheaterId !== null) && Object.keys(userData).length !== 0 &&
                                            <LineChart chartData={userData} />
                                        }
                                    </LoadingOverlay>





                                </div>
                                {/* Message From Customer*/}

                            </div>
                            {/*Row*/}
                            {/* Modal Logout */}
                            <div className="modal fade" id="logoutModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabelLogout" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabelLogout">Ohh No!</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <p>Are you sure you want to logout?</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-primary" data-dismiss="modal">Cancel</button>
                                            <a href="login.html" className="btn btn-primary">Logout</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
