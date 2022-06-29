import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import MaterialTable from 'material-table';
import Footer from '../../containers/System/Share/Footer';
import './EditCombo.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import $ from "jquery";
import { getAllFoods } from '../../services/FoodServices';
import { editCombo, getDetailCombo } from '../../services/ComboServices';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';





function EditCombo() {

    const [allValues, setAllValues] = useState({
        isShowLoading: true,
        isLoadingButton: false,
        name: '',
        price: '',
        listFood: [],
        listItem: [],
    });

    let history = useHistory();
    const { id } = useParams();







    async function fetchDataFood() {
        // You can await here

        let dataRes = await getAllFoods();
        let dataDetailCombo = await getDetailCombo(id);

        let listFood = [];

        if (dataRes && dataRes.dataFood) {
            listFood = dataRes.dataFood.map(item => {
                item.nameType = item.TypeOfFood.name;
                item.amount = 0;
                dataDetailCombo.data[0].ComboInFood.map(y => {
                    if (y.id === item.id && item.amount === 0) {
                        item.amount = y.Combo_Food.amount;
                        return;
                    }
                })
                return item;
            })
        }


        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: false,
            listFood: listFood,
            dataDetailCombo: (dataDetailCombo && dataDetailCombo.data && dataDetailCombo.data[0]) ? dataDetailCombo.data[0] : [],
            name: dataDetailCombo.data[0].name || '',
            price: dataDetailCombo.data[0].price || ''
        }))

    }



    useEffect(() => {

        fetchDataFood()
    }, []);



    const test = (e) => {
        const isNegative = $(e.target).closest('.btn-minus').is('.btn-minus');
        const input = $(e.target).closest('.input-group').find('input');
        console.log("input: ", input);
        console.log("id: ", input[0].id);
        if (input.is('input')) {
            input[0][isNegative ? 'stepDown' : 'stepUp']()
        }
    }


    const handleEditCombo = async () => {
        allValues.isLoadingButton = true;
        console.log("Check all value: ", allValues);
        let quantity = document.getElementsByClassName("quantity");
        let items = [];
        for (let a = 0; a < quantity.length; a++) {
            let obj = {};
            if (+quantity[a].value !== 0) {
                obj.foodId = +quantity[a].id;
                obj.amount = +quantity[a].value;
                items.push(obj);
            }
            console.log(allValues.listFood)
            if (+quantity[a].value === 0) {
                let res = allValues.listFood.some(item => (item.id === +quantity[a].id && item.amount !== 0));
                if (res) {
                    obj.foodId = +quantity[a].id;
                    obj.amount = +quantity[a].value;
                    items.push(obj);
                }
            }
        }

        let res = await editCombo({
            name: allValues.name,
            price: +allValues.price,
            items: items,
            id: id
        })

        if (res && res.errCode == 0) {
            history.push("/combo-management")
            toast.success("Update combo succeed");
        } else {
            toast.error(res.errMessage);
        }
    }









    const columnsItemFood = [
        { title: 'ID', field: 'id', key: 'FoodId' },
        { title: 'Tên thực phẩm', field: 'name', key: 'NameFood' },
        {
            title: 'Số lượng', field: 'amount', key: 'amoutFood', render: rowData =>
                <>
                    <div className="input-group inline-group">
                        <div className="input-group-prepend">
                            <button className="btn btn-outline-secondary btn-minus" onClick={(e) => test(e)} >
                                <i className="fa fa-minus"></i>
                            </button>
                        </div>
                        <input className="form-control quantity" min="0" name="quantity" value={rowData.amount} id={rowData.id} type="number" />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary btn-plus" onClick={(e) => test(e)}>
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>

                </>
        },
    ]








    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
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
                <div id="wrapper" className='edit-combo-main'>
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

                                <div className="col-lg-6 mb-4">

                                    <MaterialTable
                                        title="Add food"
                                        columns={columnsItemFood}
                                        data={allValues.listFood}

                                        options={{
                                            actionsColumnIndex: -1,
                                            headerStyle: { color: "#6e707e", backgroundColor: "#eaecf4", fontSize: '15px', fontWeight: 700 },
                                            paginationType: "stepped"

                                        }}

                                    />
                                </div>
                                <div className="col-lg-6 mb-4 card">
                                    <div className='form-edit-combo'>
                                        <h5>Update Combo</h5>
                                        <div className='vertical-input'>
                                            <label htmlFor="exampleInputEmail1">Tên combo</label>
                                            <input type="text" className="form-control input-sm" onChange={changeHandler} value={allValues.name} name='name' placeholder="Nhập tên combo" />
                                        </div>
                                        <div className='vertical-input'>
                                            <label htmlFor="exampleInputEmail1">Đơn giá</label>
                                            <input type="text" className="form-control input-sm" onChange={changeHandler} value={allValues.price} name='price' onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }} placeholder="Nhập giá" />
                                        </div>
                                        <div className='horizon-button' style={{ marginTop: '30px' }}>
                                            {/* <Button variant="primary" className="submit-schedule-data">
                                                <span className="visually">Submit</span>
                                            </Button> */}
                                            <Button variant="primary" {...allValues.isLoadingButton && 'disabled'} onClick={handleEditCombo} >
                                                {allValues.isLoadingButton &&
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="visually" style={{ marginLeft: '10px' }}>Loading...</span>
                                                    </>

                                                }
                                                {!allValues.isLoadingButton &&
                                                    <>
                                                        <span className="visually">Submit</span>
                                                    </>
                                                }
                                            </Button>
                                        </div>
                                    </div>


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

export default EditCombo;
