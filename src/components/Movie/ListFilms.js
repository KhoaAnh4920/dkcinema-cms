import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllFilms, updateStatusFilms, deleteMovieService } from '../../services/FilmsServices';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './ListFilms.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import Switch from "react-switch";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";





function ListFilms() {

    const [listFilms, setFilmsData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    let selectUser = useSelector(userState);
    let history = useHistory();
    const [allValues, setAllValues] = useState({
        movieTheaterId: '',
        roleId: 2
    });

    // const handleChange = async (data) => {

    //     let res = await updateStatusFilms({
    //         id: data.id,
    //         status: !data.isDelete
    //     })

    //     if (res && res.errCode === 0) {
    //         await fetchDataMovie();
    //     }

    //     // setChecked(nextChecked);
    // };


    async function fetchDataMovie() {
        setShowLoading(true);
        // You can await here
        const filmsData = await getAllFilms();


        if (filmsData && filmsData.dataMovie) {
            let response = filmsData.dataMovie.map(item => {
                item.poster = item.ImageOfMovie[0].url;
                item.releaseTime = moment(item.releaseTime).format("DD/MM/YYYY");
                return item;
            })
            setFilmsData(response);
            setShowLoading(false);
        }
    }

    useEffect(() => {
        fetchDataMovie();
    }, []);

    useEffect(() => {

        if (selectUser.adminInfo && selectUser.adminInfo.movietheaterid) {


            setAllValues((prevState) => ({
                ...prevState,
                movieTheaterId: selectUser.adminInfo.movietheaterid,
                roleId: selectUser.adminInfo.roleId
            }));
        }


    }, [selectUser]);


    const columns = [
        // { title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} /> },
        { title: 'ID', field: 'id' },
        { title: 'Tên phim', field: 'name', render: rowData => <Link to={`/detail-film/${rowData.id}`}>{rowData.name}</Link> },
        { title: 'Quốc gia', field: 'country' },
        { title: 'Thời lượng / phút', field: 'duration' },
        { title: 'Ngày công chiếu', field: 'releaseTime' },
        {
            title: 'Trạng thái', field: 'status', render: rowData =>

                <>
                    {rowData.status == 0 && <span className="badge badge-info">Sắp chiếu</span>}
                    {rowData.status == 1 && <span className="badge badge-success">Đang chiếu</span>}
                    {rowData.status == 2 && <span className="badge badge-danger">Ngừng chiếu</span>}
                </>

        },
        // {
        //     title: 'Hiển thị', field: 'status', render: rowData => <>
        //         <div className="custom-control custom-switch">
        //             <input type="checkbox" class="custom-control-input" id={rowData.id} checked={!rowData.isDelete} onChange={() => handleChange(rowData)} />
        //             <label class="custom-control-label" for={rowData.id}></label>
        //         </div>
        //     </>
        // },

    ]

    const handleOnDeleteMovie = async (id) => {
        try {
            setShowLoading(true);

            let res = await deleteMovieService({
                id: id,
                isDelete: true
            });
            if (res && res.errCode === 0) {
                toast.success("Xóa thành công")
                await fetchDataMovie();
            } else {
                toast.error(res.errMessage)
            }
            setShowLoading(false);
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
                                    title="Danh sách Phim"
                                    columns={columns}
                                    data={listFilms}


                                    actions={
                                        (allValues.roleId === 2) ?
                                            [
                                                {
                                                    icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Thêm phim</button>,
                                                    onClick: async (event, rowData) => {
                                                        history.push('/add-new-films');
                                                    },
                                                    isFreeAction: true,
                                                },
                                                {
                                                    icon: 'edit',
                                                    // tooltip: 'Edit Film',
                                                    onClick: async (event, rowData) => {
                                                        history.push(`/edit-film/${rowData.id}`);
                                                    }
                                                },
                                                {
                                                    icon: 'delete',
                                                    tooltip: 'Delete Movie',
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
                                                            handleOnDeleteMovie(rowData.id)
                                                        }
                                                    })
                                                }

                                            ] : []}
                                    options={{
                                        actionsColumnIndex: -1,
                                        headerStyle: { zIndex: 1, color: "#6e707e", backgroundColor: "#eaecf4", fontSize: '15px', fontWeight: 700 },
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

export default ListFilms;
