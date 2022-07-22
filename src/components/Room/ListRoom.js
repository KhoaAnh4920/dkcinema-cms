import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllRoom, deleteRoomService } from '../../services/RoomService';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './ListRoom.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";


function ListRoom() {

    const [listRoom, setRoomData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(true);
    const [movieTheaterId, setMovieTheaterId] = useState();
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);


    let history = useHistory();
    let selectUser = useSelector(userState);



    async function fetchDataRoom(movieTheaterId) {
        // You can await here
        const roomData = await getAllRoom(movieTheaterId);

        console.log("Check room: ", roomData);

        if (roomData && roomData.room) {
            setRoomData(roomData.room);
            setShowLoading(false);
        }
    }


    useEffect(() => {
        // if (movieTheaterId) {
        //     fetchDataRoom(selectUser.adminInfo.movietheaterid);
        // }
    }, []);


    useEffect(() => {

        fetchDataRoom(selectUser.adminInfo.movietheaterid);

        setMovieTheaterId({
            movieTheaterId: selectUser.adminInfo.movietheaterid
        });


    }, [selectUser]);




    const columns = [
        { title: 'ID', field: 'id', key: 'RoomId' },
        { title: 'Tên phòng chiếu', field: 'name', key: 'NameRoom' },
        { title: 'Số lượng ghế', field: 'NumberOfSeet', render: rowData => <span>{rowData.RoomSeet.length}</span> },
    ]



    const handleOnDeleteRoom = async (id) => {
        try {
            // this.setState({
            //     isShowLoading: true
            // })

            let res = await deleteRoomService(id);
            if (res && res.errCode === 0) {
                toast.success("Xóa thành công")
                console.log('movieTheaterId: ', selectUser.adminInfo.movietheaterid)
                await fetchDataRoom(selectUser.adminInfo.movietheaterid);
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

export default ListRoom;
