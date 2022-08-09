import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllStaff, deleteUserService, createNewUserService, getEditUser, updateUserService } from '../../services/UserService';
import MaterialTable, { MTableToolbar } from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './ListStaff.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import ModalAddStaff from './ModalAddStaff';
import { toast } from 'react-toastify';
import ModalEditStaff from './ModalEditStaff';
import { useSelector } from "react-redux";
import { userState } from "../../redux/userSlice";
import { Button } from "@material-ui/core";
//Material UI
import { Paper } from "@material-ui/core";



function ListStaff() {
    let selectUser = useSelector(userState);
    const [listUser, setUserData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(true);
    const [isOpenModalUser, setOpenModalUser] = useState(false);
    const [modalEditStaff, setOpenModaEditlUser] = useState({
        isShow: false,
        id: 0,
        dataUser: {}
    });
    let history = useHistory();
    const [allValues, setAllValues] = useState({
        movieTheaterId: '',
        roleId: ''
    });




    async function fetchDataUser(movietheaterid) {
        // You can await here
        //   console.log('movietheaterid: ', movietheaterid)
        const userData = await getAllStaff({
            movieTheaterId: movietheaterid
        });
        //  console.log("userData: ", userData);
        if (userData && userData.data) {
            let response = userData.data.map((item, index) => {

                if (item.UserRoles)
                    item.rolesName = item.UserRoles.rolesName;
                item.birthday = moment(item.birthday).format("DD/MM/YYYY");
                if (item.UserMovieTheater && item.UserMovieTheater.tenRap) {
                    item.movieTheater = item.UserMovieTheater.tenRap;
                } else {
                    item.movieTheater = 'None'
                }
                return item;
            })

            setUserData(response);
            setShowLoading(false);

        }
        setShowLoading(false);
    }

    useEffect(() => {
        // fetchDataUser();
    }, []);

    useEffect(() => {

        if (selectUser.adminInfo && selectUser.adminInfo.movietheaterid) {

            fetchDataUser(selectUser.adminInfo.movietheaterid);
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
        { title: 'Ảnh', field: 'avatar', render: rowData => <img src={rowData.avatar} style={{ width: 60, height: 60, borderRadius: '50%' }} /> },
        { title: 'Họ và tên', field: 'fullName' },
        { title: 'Giới tính', field: 'gender', render: rowData => (rowData.gender) ? 'Nam' : 'Nữ' },
        { title: 'Quyền', field: 'rolesName' },
        { title: 'Rạp phim', field: 'movieTheater' },
        { title: 'Trạng thái', field: 'isActive', render: rowData => (rowData.isActive) ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">InActive</span> },
    ]

    // const handleOnDeleteUser = async (id) => {
    //     try {
    //         // this.setState({
    //         //     isShowLoading: true
    //         // })

    //         let res = await deleteUserService(id);
    //         if (res && res.errCode === 0) {
    //             await fetchDataUser();
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


    const toggleUserModal = () => {
        setOpenModalUser(isOpenModalUser => !isOpenModalUser)
    }

    const toggleUserModalEditUser = () => {
        setOpenModaEditlUser((prevState) => ({
            ...prevState,
            isShow: !prevState.isShow
        }));
    }

    const saveNewUserFromModal = async (data) => {

        // console.log('data: ', data);

        if (data) {
            let formatedDate = new Date(data.birthday).getTime(); // convert timestamp //
            //   console.log("Check formatedDate: ", formatedDate);

            let res = await createNewUserService({
                email: data.email,
                password: data.password,
                fullName: data.fullName,
                birthday: formatedDate,
                phone: data.phone,
                gender: data.selectedGender.value,
                roleId: data.selectedRoles.value,
                movietheaterid: allValues.movieTheaterId,
                userName: data.userName,
                address: data.address,
                avatar: data.avatar,
                fileName: data.fileName,
                cityCode: (data.selectedCity && data.selectedCity.value) ? data.selectedCity.value : null,
                districtCode: (data.selectedDistrict && data.selectedDistrict.value) ? data.selectedDistrict.value : null,
                wardCode: (data.selectedWard && data.selectedWard.value) ? data.selectedWard.value : null
            })

            if (res && res.errCode == 0) {
                setOpenModalUser(false);
                await fetchDataUser(allValues.movieTheaterId);
                toast.success("Thêm nhân viên mới thành công");
            } else toast.error(res.message);


        }
    }


    const saveEditUserFromModal = async (data) => {

        //    console.log("Check data from modal: ", data);

        if (data) {
            let formatedDate = new Date(data.birthday).getTime(); // convert timestamp //

            let res = await updateUserService({
                fullName: data.fullName,
                birthday: formatedDate,
                phone: data.phone,
                gender: data.selectedGender.value,
                roleId: data.selectedRoles.value,
                movietheaterid: allValues.movieTheaterId,
                userName: data.userName,
                address: data.address,
                avatar: data.avatar,
                fileName: data.fileName,
                cityCode: (data.selectedCity && data.selectedCity.value) ? data.selectedCity.value : null,
                districtCode: (data.selectedDistrict && data.selectedDistrict.value) ? data.selectedDistrict.value : null,
                wardCode: (data.selectedWard && data.selectedWard.value) ? data.selectedWard.value : null,
                id: modalEditStaff.id,
            })

            if (res && res.errCode === 0) {
                setOpenModaEditlUser((prevState) => ({
                    ...prevState,
                    isShow: false
                }));
                await fetchDataUser(allValues.movieTheaterId);
                toast.success("Cập nhật nhân viên mới thành công");
            } else toast.error(res.message);
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
                                    title="Danh sách nhân viên"
                                    columns={columns}
                                    data={listUser}
                                    // components={{
                                    //     Toolbar: (props) => (
                                    //         <div
                                    //             style={{
                                    //                 display: "flex",
                                    //                 justifyContent: "flex-end",
                                    //                 alignItems: "center"
                                    //             }}
                                    //         >
                                    //             <Button
                                    //                 type="button"
                                    //                 className="btn btn-info btn-add-staff"
                                    //                 data-toggle="modal"
                                    //                 data-target="#myModalthree"
                                    //             >
                                    //                 Thêm nhân viên
                                    //             </Button>
                                    //             <div style={{ width: "13rem" }}>
                                    //                 <MTableToolbar {...props} />
                                    //             </div>
                                    //         </div>
                                    //     ),
                                    //     Container: (props) => <Paper {...props} elevation={8} />
                                    // }}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info btn-add-staff" data-toggle="modal" data-target="#myModalthree">Thêm nhân viên</button>,
                                            onClick: async (event, rowData) => {
                                                setOpenModalUser(true);
                                            },
                                            isFreeAction: true,
                                        },
                                        {
                                            icon: 'edit',
                                            tooltip: 'Edit User',
                                            onClick: async (event, rowData) => {
                                                let dataUser = await getEditUser(rowData.id);
                                                setOpenModaEditlUser({
                                                    isShow: true,
                                                    id: rowData.id,
                                                    dataUser: (dataUser.errCode === 0) ? dataUser.data : {}
                                                });
                                            }

                                        },
                                        // {
                                        //     icon: 'delete',
                                        //     tooltip: 'Delete User',
                                        //     onClick: (event, rowData) => Swal.fire({
                                        //         title: 'Are you sure?',
                                        //         text: "You won't be able to revert this!",
                                        //         icon: 'warning',
                                        //         showCancelButton: true,
                                        //         confirmButtonColor: '#3085d6',
                                        //         cancelButtonColor: '#d33',
                                        //         confirmButtonText: 'Yes, delete it!'
                                        //     }).then((result) => {
                                        //         if (result.isConfirmed) {
                                        //             handleOnDeleteUser(rowData.id)
                                        //         }
                                        //     })
                                        // }
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

            {isOpenModalUser &&
                <ModalAddStaff
                    isOpen={isOpenModalUser}
                    toggleFromParent={toggleUserModal}
                    saveNewUser={saveNewUserFromModal}
                    movieTheaterId={allValues.movieTheaterId}
                />
            }

            {modalEditStaff.isShow &&
                <ModalEditStaff
                    isOpen={modalEditStaff.isShow}
                    toggleFromParentEditUser={toggleUserModalEditUser}
                    saveEditUser={saveEditUserFromModal}
                    dataUser={modalEditStaff.dataUser}
                />
            }
        </>
    );
}

export default ListStaff;
