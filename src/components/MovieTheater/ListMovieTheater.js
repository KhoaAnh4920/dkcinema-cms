import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllMovieTheater } from '../../services/MovieTheater';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './ListMovieTheater.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { testFunction } from '../Users/useLocationForm';
import useLocationForm from "../Users/useLocationForm";



function ListMovieTheater() {

    const [listMovieTheater, setMovieTheaterData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    let { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit } =
        useLocationForm(false);

    let {
        cityOptions,
        districtOptions,
        wardOptions,
        selectedCity,
        selectedDistrict,
        selectedWard,
    } = state;

    let history = useHistory();



    async function fetchDataMovieTheater() {
        setShowLoading(true);
        // You can await here
        const movieTheaterData = await getAllMovieTheater();


        if (movieTheaterData && movieTheaterData.movie) {
            let response = await Promise.all(movieTheaterData.movie.map(async (item, index) => {
                const location = await testFunctionParent(item.cityCode, item.districtCode, item.wardCode);
                item.address = item.address + ', ' + location.selectedWard.label + ', ' + location.selectedDistrict.label + ', ' + location.selectedCity.label;
                item.userManage = item.UserMovieTheater.fullName;
                return item;
            }))
            setMovieTheaterData(response);
            setShowLoading(false);
        }



        // if (filmsData && filmsData.dataMovie) {
        //     let response = filmsData.dataMovie.map(item => {
        //         item.poster = item.ImageOfMovie[0].url;
        //         item.releaseTime = moment(item.releaseTime).format("DD/MM/YYYY");
        //         return item;
        //     })
        //     setFilmsData(response);
        //     setShowLoading(false);
        // }
    }

    async function testFunctionParent(cityCode, districtCode, wardCode) {
        const location = await testFunction(cityCode, districtCode, wardCode);

        if (location)
            return location;
        return null;

    }

    useEffect(() => {
        fetchDataMovieTheater();
    }, []);


    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Tên rạp chiếu', field: 'tenRap' },
        { title: 'Địa chỉ', field: 'address' },
        { title: 'Số điện thoại', field: 'soDienThoai' },
        { title: 'Quản lý rạp', field: 'userManage' },

    ]



    // const handleOnDeleteUser = async (id) => {
    //     try {
    //         // this.setState({
    //         //     isShowLoading: true
    //         // })

    //         let res = await deleteUserService(id);
    //         if (res && res.errCode === 0) {
    //             await fetchDataMovieTheater();
    //         } else {
    //             alert(res.errMessage)
    //         }
    //         // this.setState({
    //         //     isShowLoading: false
    //         // })
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }


    //DATA EXAMPLE

    // const dataChair = [
    //     { id: "1" },
    //     { id: "2" },
    //     { id: "3" },
    //     { id: "4" },
    //     { id: "5" },
    //     { id: "6" },
    //     { id: "7" },
    //     { id: "8" },
    //     { id: "9" },
    //     { id: "10" }
    // ];
    // const dataChair2 = [
    //     { id: "1" },
    //     { id: "2" },
    //     { id: "3" },
    //     { id: "4" },
    //     { id: "5" },
    //     { id: "6" },
    //     { id: "7" },
    //     { id: "8" },
    // ];




    return (

        <>
            <LoadingOverlay
                active={isShowLoading}
                spinner={<BeatLoader color='#fff' size={20} />}
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: 'rgb(10 10 10 / 68%)'
                    })
                }}
            >
                <div id="wrapper">
                    {/* Sidebar */}

                    <Sidebar />

                    { /* EXAMPLE MAP INTERGRATE*/}


                    {/* <div className='row_chair col-lg-12'>
                        <div className='chair'>
                            <div className='one_row'>
                                {
                                    dataChair.map((item, index) => {
                                        return <p>{item.id}</p>
                                    })
                                }
                            </div>
                            <div className='one_row'>
                                {
                                    dataChair2.map((item, index) => {
                                        return <p>{item.id}</p>
                                    })
                                }
                            </div>

                        </div>

                    </div> */}

                    {/* Sidebar */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            {/* TopBar */}
                            <Header />
                            {/* Topbar */}



                            <div className="col-lg-12 mb-4">

                                <MaterialTable
                                    title="Danh sách Rạp"
                                    // columns={columns}
                                    // data={listFilms}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Thêm rạp</button>,
                                            onClick: async (event, rowData) => {
                                                history.push('/add-new-movieTheater');
                                            },
                                            isFreeAction: true,
                                        },
                                        {

                                            icon: 'edit',
                                            // tooltip: 'Edit movie theater',
                                            onClick: async (event, rowData) => {
                                                history.push(`/edit-movie-theater/${rowData.id}`);
                                            }
                                        },
                                        {
                                            icon: 'delete',
                                            tooltip: 'Delete User',
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
                                            //         handleOnDeleteUser(rowData.id)
                                            //     }
                                            // })
                                        }
                                    ]}
                                    options={{
                                        actionsColumnIndex: -1,
                                        headerStyle: { color: "#6e707e", backgroundColor: "#eaecf4", fontSize: '15px', fontWeight: 700 },
                                        paginationType: "stepped"

                                    }}

                                    columns={columns}
                                    data={listMovieTheater}

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

export default ListMovieTheater;
