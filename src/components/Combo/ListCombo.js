import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './ListCombo.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { getAllCombo, getItemCombo, deleteComboService } from '../../services/ComboServices';
import moment from 'moment';
import { Button } from 'react-bootstrap';





function ListCombo() {

    const [allValues, setAllValues] = useState({
        isShowLoading: true,
        movieTheaterId: '',
        listCombo: [],
        listItem: [],
    });

    let history = useHistory();







    async function fetchDataCombo() {
        // You can await here
        let dateToday = moment().format('dddd, MMMM Do, YYYY');

        let dataRes = await getAllCombo();


        console.log("Check data: ", dataRes.dataCombo);


        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: false,
            dateToday: dateToday,
            listCombo: dataRes.dataCombo || [],
        }))

    }


    useEffect(() => {

        fetchDataCombo()
    }, []);


    const columns = [
        { title: 'ID', field: 'id', key: 'FoodId' },
        { title: 'Tên combo', field: 'name', key: 'nameCombo' },
        { title: 'Đơn giá', field: 'price', key: 'priceCombo', render: rowData => <span>{rowData.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span> },
    ]

    const columnsItemFood = [
        { title: 'Stt', field: 'id', key: 'FoodId', render: rowData => rowData.tableData.id + 1 },
        { title: 'Tên thực phẩm', field: 'nameFood', key: 'NameFood' },
        { title: 'Số lượng', field: 'amount', key: 'amoutFood' },
    ]








    const handleOnDeleteCombo = async (id) => {
        try {
            // this.setState({
            //     isShowLoading: true
            // })

            let res = await deleteComboService(id);
            if (res && res.errCode === 0) {
                toast.success("Delete food success !!")
                await fetchDataCombo();
            } else {
                toast.error(res.errMessage)
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
                active={allValues.isShowLoading}
                spinner={<BeatLoader color='#fff' size={20} />}
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: 'rgb(10 10 10 / 68%)'
                    })
                }}
            >
                <div id="wrapper" className='list-combo-main'>
                    {/* Sidebar */}

                    <Sidebar />

                    {/* Sidebar */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            {/* TopBar */}
                            <Header />
                            {/* Topbar */}
                            {/* <div className="col-lg-12 mb-4">

                                <div className="card mb-4">
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Tra cứu thực phẩm</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group horizon-form">

                                            <div className='horizon-input'>
                                                <label htmlFor="exampleInputEmail1" style={{ marginRight: '5px' }}>Loại thực phẩm</label>
                                                <Select
                                                    className='food-select'
                                                    value={allValues.selectedTypeFood || {}}
                                                    onChange={handleChangeSelect}
                                                    options={allValues.listTypeFood}
                                                    placeholder='Select type food'
                                                    name='selectedTypeFood'
                                                    styles={customStyles}
                                                // styles={this.props.colourStyles}
                                                />
                                            </div>


                                            <div className='horizon-input' style={{ marginLeft: '50px' }}>
                                                <Button variant="primary" className="submit-schedule-data" onClick={handleSubmitFilter}>
                                                    <span className="visually">Submit</span>
                                                </Button>
                                                <Button variant="primary" className="filter-food-data" onClick={handleClearFilter}>
                                                    <span className="visually">Clear</span>
                                                </Button>
                                            </div>




                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className='row' style={{ padding: '10px' }}>

                                <div className="col-lg-7 mb-4">

                                    <MaterialTable
                                        title="Danh sách Combo"
                                        columns={columns}
                                        data={allValues.listCombo}

                                        onRowClick={async (event, rowData) => {
                                            // Copy row data and set checked state

                                            let item = await getItemCombo(rowData.id);

                                            console.log("Check item: ", item);

                                            let res = []
                                            if (item && item.data && item.data.length > 0) {
                                                res = item.data.map(item => {
                                                    item.nameFood = item.Food.name;
                                                    return item;
                                                })
                                            }

                                            setAllValues((prevState) => ({
                                                ...prevState,
                                                isShowLoading: false,
                                                listItem: res
                                            }))

                                        }}

                                        actions={[
                                            {
                                                icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Add new combo</button>,
                                                onClick: async (event, rowData) => {
                                                    history.push('/add-new-combo')
                                                },
                                                isFreeAction: true,
                                            },
                                            {
                                                icon: 'edit',
                                                // tooltip: 'Edit Film',
                                                onClick: async (event, rowData) => {
                                                    history.push(`/edit-combo/${rowData.id}`);
                                                }
                                            },
                                            {
                                                icon: 'delete',
                                                tooltip: 'Delete food',
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
                                                        handleOnDeleteCombo(rowData.id)
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
                                <div className="col-lg-5 mb-4">

                                    <MaterialTable
                                        title="Thực phẩm"
                                        columns={columnsItemFood}
                                        data={allValues.listItem}

                                        options={{
                                            actionsColumnIndex: -1,
                                            headerStyle: { color: "#6e707e", backgroundColor: "#eaecf4", fontSize: '15px', fontWeight: 700 },
                                            paginationType: "stepped"

                                        }}

                                    />
                                </div>
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

export default ListCombo;