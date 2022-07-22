import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import Footer from '../../containers/System/Share/Footer';
import './ListFood.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { getAllFoods, getAllTypeFood, createNewFoodService, getEditFood, editFoodService, deleteFoodService } from '../../services/FoodServices';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import ModalAddFood from './ModalAddFood';
import ModalEditFood from './ModalEditFood';




function ListFood() {

    const [allValues, setAllValues] = useState({
        isShowLoading: true,
        dateSchedule: new Date(),
        premiereDate: new Date().fp_incr(1),
        movieTheaterId: '',
        listTypeFood: [],
        selectedTypeFood: {},
        listFood: [],
        startTime: '',
        endTime: '',
    });
    const [isOpenModalFood, setOpenModalFood] = useState(false);
    const [modalEditFood, setOpenModaEditFood] = useState({
        isShow: false,
        id: 0,
        dataFood: {}
    });
    let history = useHistory();




    const buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.name;
                object.value = item.id;

                result.push(object);
            })

        }
        return result;
    }

    const toggleFoodModal = () => {
        setOpenModalFood(isOpenModalFood => !isOpenModalFood)
    }




    async function fetchDataFood(typeId) {
        // You can await here
        let dateToday = moment().format('dddd, MMMM Do, YYYY');

        let dataRes = await getAllFoods((typeId) ? typeId : null);
        let dataType = await getAllTypeFood();

        let listTypeFood = [];
        if (dataType && dataType.dataTypeFood) { }
        listTypeFood = buildDataInputSelect(dataType.dataTypeFood)

        let listFood = [];
        if (dataRes && dataRes.dataFood) {
            listFood = dataRes.dataFood.map(item => {
                item.nameType = item.TypeOfFood.name;
                return item;
            })
        }

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: false,
            dateToday: dateToday,
            listFood: listFood,
            listTypeFood: listTypeFood
        }))

    }


    const toggleModalEditFood = () => {
        setOpenModaEditFood((prevState) => ({
            ...prevState,
            isShow: !prevState.isShow
        }));
    }


    const saveEditFoodFromModal = async (data) => {

        console.log("Check data from modal: ", data);

        if (data) {
            let res = await editFoodService({
                name: data.nameFood,
                price: +data.priceFood,
                typeId: data.selectedTypeFood[0].value,
                id: data.id
            })

            if (res && res.errCode == 0) {
                setOpenModaEditFood(false);
                await fetchDataFood();
                toast.success("Add new food success");
            }
        }
    }








    useEffect(() => {

        fetchDataFood()
    }, []);


    const saveNewFoodFromModal = async (data) => {

        console.log("Check data from modal: ", data);

        if (data) {

            let res = await createNewFoodService({
                name: data.nameFood,
                price: +data.priceFood,
                typeId: data.selectedTypeFood.value,
            })

            if (res && res.errCode == 0) {
                setOpenModalFood(false);
                await fetchDataFood();
                toast.success("Add new food success");
            }
        }

    }







    const columns = [
        { title: 'ID', field: 'id', key: 'FoodId', render: rowData => rowData.tableData.id + 1 },
        { title: 'Loại thực phẩm', field: 'nameType', key: 'TypeFood' },
        { title: 'Tên thực phẩm', field: 'name', key: 'NameFood' },
        { title: 'Đơn giá', field: 'price', key: 'priceFood', render: rowData => <span>{rowData.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span> },
    ]


    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;


        setAllValues({ ...stateCopy })
    }

    const customStyles = {
        // control: base => ({
        //     ...base,
        //     height: 30,
        //     minHeight: 30,
        // }),
        // dropdownIndicator: (styles) => ({
        //     ...styles,
        //     paddingTop: 5,
        //     paddingBottom: 10,
        // }),
        // clearIndicator: (styles) => ({
        //     ...styles,
        //     paddingTop: 7,
        //     paddingBottom: 7,
        // }),
    };

    const handleSubmitFilter = () => {

        console.log(allValues);
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true,
        }))

        fetchDataFood(allValues.selectedTypeFood.value);

        // setAllValues((prevState) => ({
        //     ...prevState,
        //     isShowLoading: false,
        // }))

        // let formatedDate = new Date(allValues.dateSchedule).getTime(); // convert timestamp //

        // let obj = {};
        // obj.date = formatedDate;
        // obj.roomId = allValues.selectedTypeFood.value;
        // obj.movieId = allValues.selectedMovie.value
        // fetchDataFood(obj);
    }

    const handleClearFilter = () => {
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true,
            selectedTypeFood: {}
        }))
        fetchDataFood()
    }


    const handleOnDeleteFood = async (id) => {
        try {
            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: true,
            }))


            let res = await deleteFoodService(id);
            if (res && res.errCode === 0) {
                toast.success("Delete food success !!")
                await fetchDataFood();
            } else {
                toast.error(res.errMessage)
            }
            setAllValues((prevState) => ({
                ...prevState,
                isShowLoading: false,
            }))
        } catch (e) {
            console.log(e);
        }
    }



    return (

        <>

            <div id="wrapper" className='list-food-main'>
                {/* Sidebar */}

                <Sidebar />

                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}
                        <div className="col-lg-12 mb-4">

                            <div className="card mb-4">
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">Tra cứu thực phẩm</h6>
                                </div>
                                <div className="card-body">
                                    <div className="form-group horizon-form">

                                        <div className='select-type'>
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


                                        <div className='horizon-input-submit' style={{ marginLeft: '20px' }}>
                                            <label htmlFor="exampleInputEmail1" style={{ height: '22px' }}></label>
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
                        </div>


                        <div className="col-lg-12 mb-4">

                            <LoadingOverlay
                                active={allValues.isShowLoading}
                                spinner={<BeatLoader color='#6777ef' size={20} />}
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        background: '#fff'
                                    })
                                }}
                            >
                                <MaterialTable
                                    title="Danh sách thực phẩm"
                                    columns={columns}
                                    data={allValues.listFood}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Add new food</button>,
                                            onClick: async (event, rowData) => {
                                                setOpenModalFood(true);
                                            },
                                            isFreeAction: true,
                                        },
                                        {
                                            icon: 'edit',
                                            // tooltip: 'Edit Film',
                                            onClick: async (event, rowData) => {
                                                let dataFood = await getEditFood(rowData.id);
                                                setOpenModaEditFood({
                                                    isShow: true,
                                                    id: rowData.id,
                                                    dataFood: (dataFood.errCode === 0) ? dataFood.data : {}
                                                });
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
                                                    handleOnDeleteFood(rowData.id)
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

            {isOpenModalFood &&
                <ModalAddFood
                    isOpen={isOpenModalFood}
                    toggleFromParent={toggleFoodModal}
                    saveNewFood={saveNewFoodFromModal}
                />
            }


            {modalEditFood.isShow &&
                <ModalEditFood
                    isOpen={modalEditFood.isShow}
                    toggleFromParentEditUser={toggleModalEditFood}
                    saveEditFood={saveEditFoodFromModal}
                    dataFood={modalEditFood.dataFood}
                />

            }




        </>
    );
}

export default ListFood;
