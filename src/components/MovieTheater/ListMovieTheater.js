import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllMovieTheater, deleteMovieTheater } from '../../services/MovieTheater';
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
                // item.userManage = item.UserMovieTheater.fullName;
                return item;
            }))
            setMovieTheaterData(response);
            setShowLoading(false);
        }

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
        // { title: 'Quản lý rạp', field: 'userManage' },

    ]

    const handleOnDelete = async (id) => {
        try {
            setShowLoading(true);

            let res = await deleteMovieTheater(id);
            if (res && res.errCode === 0) {
                await fetchDataMovieTheater();
            } else {
                toast.error(res.errMessage)
                setShowLoading(false);
            }

        } catch (e) {
            console.log(e);
        }
    }



    return (

        <>

            <div id="wrapper">
                {/* Sidebar */}

                <Sidebar />

                { /* EXAMPLE MAP INTERGRATE*/}


                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}



                        <div className="col-lg-12 mb-4" style={{ zIndex: 1 }}>
                            <LoadingOverlay
                                active={isShowLoading}
                                spinner={<BeatLoader color='#6777ef' size={20} />}
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        background: '#fff'
                                    })
                                }}
                            >
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
                                            tooltip: 'Delete Movie Theater',
                                            onClick: (event, rowData) => Swal.fire({
                                                title: 'Are you sure?',
                                                text: "You won't be able to revert this!",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Yes, delete it!'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleOnDelete(rowData.id)
                                                }
                                            })
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

export default ListMovieTheater;
