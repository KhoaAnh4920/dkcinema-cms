import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllRoom, deleteRoomService } from '../../services/RoomService';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './ListRoom.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { testFunction } from '../Users/useLocationForm';
import useLocationForm from "../Users/useLocationForm";



function ListRoom() {

    const [listRoom, setRoomData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(true);
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);


    let history = useHistory();



    async function fetchDataRoom() {
        // You can await here
        const roomData = await getAllRoom();

        console.log("Check room: ", roomData);

        if (roomData && roomData.room) {
            setRoomData(roomData.room);
            setShowLoading(false);
        }


        // if (movieTheaterData && movieTheaterData.movie) {
        //     let response = await Promise.all(movieTheaterData.movie.map(async (item, index) => {
        //         const location = await testFunctionParent(item.cityCode, item.districtCode, item.wardCode);
        //         item.address = item.address + ', ' + location.selectedWard.label + ', ' + location.selectedDistrict.label + ', ' + location.selectedCity.label;
        //         item.userManage = item.UserMovieTheater.fullName;
        //         return item;
        //     }))
        //     setRoomData(response);
        //     setShowLoading(false);
        // }



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


    useEffect(() => {
        fetchDataRoom();
    }, []);


    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Tên phòng chiếu', field: 'name' },
        { title: 'Số lượng ghế', field: 'NumberOfSeet', render: rowData => <span>{rowData.RoomSeet.length}</span> },
    ]



    const handleOnDeleteRoom = async (id) => {
        try {
            // this.setState({
            //     isShowLoading: true
            // })

            let res = await deleteRoomService(id);
            if (res && res.errCode === 0) {
                await fetchDataRoom();
            } else {
                alert(res.errMessage)
            }
            // this.setState({
            //     isShowLoading: false
            // })
        } catch (e) {
            console.log(e);
        }
    }







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

                    {/* Sidebar */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            {/* TopBar */}
                            <Header />
                            {/* Topbar */}


                            <div className="col-lg-12 mb-4">

                                <MaterialTable
                                    title="Danh sách Phòng chiếu"
                                    columns={columns}
                                    data={listRoom}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Thêm Phòng</button>,
                                            onClick: async (event, rowData) => {
                                                history.push('/add-new-room');
                                            },
                                            isFreeAction: true,
                                        },
                                        {

                                            icon: 'edit',
                                            // tooltip: 'Edit movie theater',
                                            onClick: async (event, rowData) => {
                                                history.push(`/edit-room/${rowData.id}`);
                                            }
                                        },
                                        {
                                            icon: 'delete',
                                            tooltip: 'Delete Room',
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
                                                    handleOnDeleteRoom(rowData.id)
                                                }
                                            })
                                        }
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

export default ListRoom;
