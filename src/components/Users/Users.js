import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllUser, deleteUserService, createNewUserService, getEditUser, updateUserService } from '../../services/UserService';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './Users.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import ModalAddUsers from './ModalAddUsers';
import { toast } from 'react-toastify';
import ModalEditUsers from './ModalEditUsers';



function Users() {

    const [listUser, setUserData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(false);
    const [isOpenModalUser, setOpenModalUser] = useState(false);
    const [modalEditUser, setOpenModaEditlUser] = useState({
        isShow: false,
        id: 0,
        dataUser: {}
    });
    let history = useHistory();


    async function fetchDataUser() {
        setShowLoading(true);
        // You can await here
        const userData = await getAllUser();
        console.log("userData: ", userData);
        if (userData && userData.user) {
            let response = userData.user.map((item, index) => {
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
    }

    useEffect(() => {
        fetchDataUser();
    }, []);



    const columns = [
        // { title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} /> },
        { title: 'ID', field: 'id' },
        { title: 'Avatar', field: 'avatar', render: rowData => <img src={rowData.avatar} style={{ width: 60, height: 60, borderRadius: '50%' }} /> },
        { title: 'FullName', field: 'fullName' },
        { title: 'Gender', field: 'gender', render: rowData => (rowData.gender) ? 'Nam' : 'Nữ' },
        { title: 'Role', field: 'rolesName' },
        { title: 'Movie Theater', field: 'movieTheater' },
        { title: 'Status', field: 'isActive', render: rowData => (rowData.isActive) ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">InActive</span> },
    ]

    const handleOnDeleteUser = async (id) => {
        try {
            // this.setState({
            //     isShowLoading: true
            // })

            let res = await deleteUserService(id);
            if (res && res.errCode === 0) {
                await fetchDataUser();
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

        console.log("Check data from modal: ", data);

        if (data) {
            let formatedDate = new Date(data.birthday).getTime(); // convert timestamp //
            console.log("Check formatedDate: ", formatedDate);

            let res = await createNewUserService({
                email: data.email,
                password: data.password,
                fullName: data.fullName,
                birthday: formatedDate,
                phone: data.phone,
                gender: data.selectedGender.value,
                roleId: data.selectedRoles.value,
                movietheaterid: (data.selectedMovieTheater && data.selectedMovieTheater.value) ? data.selectedMovieTheater.value : null,
                userName: data.userName,
                address: data.address || null,
                avatar: data.avatar,
                fileName: data.fileName,
                cityCode: (data.selectedCity && data.selectedCity.value) ? data.selectedCity.value : null,
                districtCode: (data.selectedDistrict && data.selectedDistrict.value) ? data.selectedDistrict.value : null,
                wardCode: (data.selectedWard && data.selectedWard.value) ? data.selectedWard.value : null
            })

            if (res && res.errCode == 0) {
                setOpenModalUser(false);
                await fetchDataUser();
                toast.success("Add new user success");
            }
        }
    }


    const saveEditUserFromModal = async (data) => {

        console.log("Check data from modal: ", data);

        if (data) {
            let formatedDate = new Date(data.birthday).getTime(); // convert timestamp //

            let res = await updateUserService({
                fullName: data.fullName,
                birthday: formatedDate,
                phone: data.phone,
                gender: data.selectedGender.value,
                roleId: data.selectedRoles.value,
                movietheaterid: (data.selectedMovieTheater && data.selectedMovieTheater.value) ? data.selectedMovieTheater.value : null,
                userName: data.userName,
                address: data.address,
                avatar: data.avatar,
                fileName: data.fileName,
                cityCode: data.selectedCity.value,
                districtCode: data.selectedDistrict.value,
                wardCode: data.selectedWard.value,
                id: modalEditUser.id,
            })

            if (res && res.errCode == 0) {
                setOpenModaEditlUser((prevState) => ({
                    ...prevState,
                    isShow: false
                }));
                await fetchDataUser();
                toast.success("Edit user success");
            }
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
                                    title="Danh sách người dùng"
                                    columns={columns}
                                    data={listUser}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Add user</button>,
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
                                            // onClick: (event, rowData) => history.push(`/edit-user/${rowData.id}`)

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
                <ModalAddUsers
                    isOpen={isOpenModalUser}
                    toggleFromParent={toggleUserModal}
                    saveNewUser={saveNewUserFromModal}
                />
            }

            {modalEditUser.isShow &&
                <ModalEditUsers
                    isOpen={modalEditUser.isShow}
                    toggleFromParentEditUser={toggleUserModalEditUser}
                    saveEditUser={saveEditUserFromModal}
                    dataUser={modalEditUser.dataUser}
                />

            }





        </>
    );
}

export default Users;
