import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './ListVoucher.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import {
    getAllVoucher, createNewVoucherService, updateStatusVoucher,
    getEditVoucher, updateVoucherService, deleteVoucherService
} from '../../services/VoucherServices';


import ModalAddVoucher from './ModalAddVoucher';
import ModalEditVoucher from './ModalEditVoucher';


function ListVoucher() {

    const [listVoucher, setVoucherData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(true);
    const [isOpenModalVoucher, setOpenModalVoucher] = useState(false);

    const [loading, setLoading] = useState(false);
    const [modalEditVoucher, setOpenModaEditVoucher] = useState({
        isShow: false,
        id: 0,
        dataVoucher: {}
    });

    let history = useHistory();



    async function fetchDataVoucher() {

        // You can await here
        const voucherData = await getAllVoucher();
        // console.log("voucherData: ", voucherData);
        if (voucherData && voucherData.data) {

            setVoucherData(voucherData.data);
            setShowLoading(false);

        } else {
            setVoucherData([]);
            setShowLoading(false);
        }
    }



    useEffect(() => {
        fetchDataVoucher()
    }, []);

    const toggleVoucherModal = () => {
        setOpenModalVoucher(isOpenModalVoucher => !isOpenModalVoucher)
    }

    const toggleModalEditVoucher = () => {
        setOpenModaEditVoucher((prevState) => ({
            ...prevState,
            isShow: !prevState.isShow
        }));
    }


    const saveNewVoucherFromModal = async (data) => {

        console.log("Check data from modal: ", data);

        if (data) {
            let formatedDateStart = null;
            let formatedDateEnd = null;
            if (data.timeStart)
                formatedDateStart = new Date(data.timeStart).getTime(); // convert timestamp //
            if (data.timeEnd)
                formatedDateEnd = new Date(data.timeEnd).getTime();
            let res = await createNewVoucherService({
                name: data.name,
                code: data.code,
                discount: +data.discount,
                maxUses: +data.maxUses,
                condition: +data.condition,
                timeStart: formatedDateStart,
                timeEnd: formatedDateEnd
            })

            if (res && res.errCode == 0) {
                setOpenModalVoucher(false);
                await fetchDataVoucher();
                toast.success("Add new voucher success");
            } else {
                toast.error(res.errMessage);
            }
        }

    }



    const handleChange = async (data) => {

        console.log('data: ', data);

        setShowLoading(true);

        let res = await updateStatusVoucher({
            id: data.id,
            status: !data.status
        })

        if (res && res.errCode === 0) {
            toast.success("Update status success")
            await fetchDataVoucher();
        }

    };

    const saveEditVoucherFromModal = async (data) => {

        console.log("Check data from modal: ", data);

        if (data) {
            let formatedDateStart = null;
            let formatedDateEnd = null;
            if (data.timeStart)
                formatedDateStart = new Date(data.timeStart).getTime(); // convert timestamp //
            if (data.timeEnd)
                formatedDateEnd = new Date(data.timeEnd).getTime();
            let res = await updateVoucherService({
                name: data.name,
                code: data.code,
                discount: +data.discount,
                maxUses: +data.maxUses,
                condition: +data.condition,
                timeStart: formatedDateStart,
                timeEnd: formatedDateEnd,
                id: data.id
            })

            if (res && res.errCode == 0) {
                setOpenModaEditVoucher((prevState) => ({
                    ...prevState,
                    isShow: false
                }));
                await fetchDataVoucher();
                toast.success("Update voucher success");
            } else {
                toast.error(res.errMessage);
            }
        }
    }




    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Code', field: 'code' },
        { title: 'Name', field: 'name' },
        {
            title: 'Discount', field: 'discount', render: rowData =>
                <>
                    {rowData.discount > 100 && rowData.discount.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                    {rowData.discount < 101 && rowData.discount + '%'}
                </>
        },
        { title: 'Condition', field: 'condition', render: rowData => (rowData.condition) ? rowData.condition.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : '' },
        {
            title: 'Show', field: 'status', render: rowData => <>
                <div className="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id={rowData.id} checked={rowData.status} onChange={() => handleChange(rowData)} />
                    <label class="custom-control-label" for={rowData.id}></label>
                </div>
            </>
        },

    ]

    const handleOnDeleteVoucher = async (id) => {
        try {
            setShowLoading(true);
            let res = await deleteVoucherService(id);
            if (res && res.errCode === 0) {
                toast.success("Delete voucher success")
                await fetchDataVoucher();
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
                                    title="Danh sách Voucher"
                                    // columns={columns}
                                    // data={listFilms}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Add Voucher</button>,
                                            onClick: async (event, rowData) => {
                                                setOpenModalVoucher(true);
                                            },
                                            isFreeAction: true,
                                        },
                                        {

                                            icon: 'edit',
                                            // tooltip: 'Edit movie theater',
                                            onClick: async (event, rowData) => {
                                                let dataVoucher = await getEditVoucher(+rowData.id);
                                                console.log('rowData.id: ', rowData.id)
                                                setOpenModaEditVoucher({
                                                    isShow: true,
                                                    id: +rowData.id,
                                                    dataVoucher: (dataVoucher.errCode === 0) ? dataVoucher.data : {}
                                                });
                                            }
                                        },
                                        {
                                            icon: 'delete',
                                            tooltip: 'Delete Voucher',
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
                                                    handleOnDeleteVoucher(rowData.id)
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
                                    data={listVoucher}

                                />
                            </LoadingOverlay>
                        </div>


                    </div>
                    {/* Footer */}
                    <Footer />
                    {/* Footer */}
                </div>
            </div>


            {isOpenModalVoucher &&
                <ModalAddVoucher
                    isOpen={isOpenModalVoucher}
                    toggleFromParent={toggleVoucherModal}
                    saveNewVoucher={saveNewVoucherFromModal}
                />
            }

            {modalEditVoucher.isShow &&
                <ModalEditVoucher
                    isOpen={modalEditVoucher.isShow}
                    toggleFromParentEditVoucher={toggleModalEditVoucher}
                    saveEditVoucher={saveEditVoucherFromModal}
                    dataVoucher={modalEditVoucher.dataVoucher}
                />

            }



        </>
    );
}

export default ListVoucher;
