import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { getAllBanner, updateStatusBanner, deleteBanner } from "../../services/BannerServices";
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './ListBanner.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';



function ListBanner() {

    const [listBanner, setBannerData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(false);

    let history = useHistory();


    async function fetchDataBanner() {

        // You can await here
        const bannerData = await getAllBanner();
        console.log("bannerData: ", bannerData);
        if (bannerData && bannerData.data) {


            setBannerData(bannerData.data);
            setShowLoading(false);

        } else {
            setBannerData([]);
            setShowLoading(false);
        }
    }

    useEffect(() => {
        setShowLoading(true);
        fetchDataBanner();
    }, []);


    const handleChange = async (data) => {

        console.log('data: ', data);

        setShowLoading(true);

        let res = await updateStatusBanner({
            id: data.id,
            status: !data.status
        })

        if (res && res.errCode === 0) {
            toast.success("Thay đổi trạng thái thành công")
            await fetchDataBanner();
        }

    };

    const columns = [
        // { title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} /> },
        { title: 'ID', field: 'id' },
        { title: 'Ảnh', field: 'url', render: rowData => <img src={rowData.url} style={{ width: 500, height: 200 }} /> },
        { title: 'Tên', field: 'name' },
        {
            title: 'Trạng thái', field: 'status', render: rowData => <>
                <div className="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id={rowData.id} checked={rowData.status} onChange={() => handleChange(rowData)} />
                    <label class="custom-control-label" for={rowData.id}></label>
                </div>
            </>
        },
    ]

    const handleOnDeleteBanner = async (id) => {
        try {
            setShowLoading(true);
            let res = await deleteBanner(id);
            if (res && res.errCode === 0) {
                toast.success("Xóa banner thành công")
                await fetchDataBanner();
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
                            <div className="col-lg-12 mb-4">

                                <MaterialTable
                                    title="Danh sách banner"
                                    columns={columns}
                                    data={listBanner}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" >Thêm banner</button>,
                                            onClick: async (event, rowData) => {
                                                history.push('/add-new-banner')
                                            },
                                            isFreeAction: true,
                                        },
                                        {
                                            icon: 'edit',
                                            tooltip: 'Edit Banner',
                                            onClick: async (event, rowData) => {
                                                history.push(`/edit-banner/${rowData.id}`);
                                                // let dataUser = await getEditUser(rowData.id);
                                                // setOpenModaEditlUser({
                                                //     isShow: true,
                                                //     id: rowData.id,
                                                //     dataUser: (dataUser.errCode === 0) ? dataUser.data : {}
                                                // });
                                            }


                                        },
                                        {
                                            icon: 'delete',
                                            tooltip: 'Delete Banner',
                                            onClick: (event, rowData) => Swal.fire({
                                                title: 'Bạn có chắc?',
                                                text: "Bạn sẽ không khôi phục được chúng !",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'OK !'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleOnDeleteBanner(rowData.id)
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
                        </LoadingOverlay>
                    </div>
                    {/* Footer */}
                    <Footer />
                    {/* Footer */}
                </div>
            </div>





        </>
    );
}

export default ListBanner;
