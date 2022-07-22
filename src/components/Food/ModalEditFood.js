import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './ModalEditFood.scss';
import { CommonUtils } from '../../utils';
import Swal from 'sweetalert2';
import moment from 'moment';
import { getAllTypeFood } from '../../services/FoodServices';
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";




export default function ModalEditFood(props) {

    // const [isOpen, setOpenModal] = useState(false);
    // const [show, setShow] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();
    const fileUploader = useRef(null);
    const [allValues, setAllValues] = useState({
        nameFood: '',
        priceFood: '',
        listTypeFood: [],
        selectedTypeFood: '',
        errors: {},
        isShowLoading: false,
    });


    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

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



    useEffect(() => {
        async function fetchDataTypeFood() {
            let dataFood = props.dataFood;

            console.log("Check dataFood: ", dataFood);

            if (dataFood) {
                let dataType = await getAllTypeFood();

                if (dataType && dataType.dataTypeFood) {
                    let listTypeFood = buildDataInputSelect(dataType.dataTypeFood);
                    let selectedTypeFood = setDefaultValue(listTypeFood, dataFood.typeId);

                    let defaultValues = {};
                    defaultValues.nameFood = dataFood.name;
                    defaultValues.priceFood = dataFood.price;


                    setAllValues((prevState) => ({
                        ...prevState,
                        listTypeFood: listTypeFood,
                        selectedTypeFood,
                        nameFood: dataFood.name,
                        priceFood: dataFood.price,
                        id: dataFood.id
                    }));

                    reset({ ...defaultValues });
                }
            }

        }
        fetchDataTypeFood();

    }, []);


    const setDefaultValue = (inputData, value) => {
        let result = inputData.filter(item => item.value === value);
        if (result) {
            return result;
        }
    }



    const toggle = () => {
        props.toggleFromParentEditUser();
    }

    const handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;
        setAllValues({ ...stateCopy })

        console.log("Check state: ", allValues);
    }


    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const handleSaveFood = async () => {

        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let allValuesInput = { ...allValues };
        props.saveEditFood(allValuesInput);

    }


    return (
        <Modal className={'modal-edit-food'} isOpen={props.isOpen} toggle={() => toggle()} centered >
            <ModalHeader toggle={() => toggle()} className='titleModal'>Edit food</ModalHeader>
            <form onSubmit={handleSubmit(handleSaveFood)}>
                <ModalBody className='modal-body-container'>
                    <div className='modal-edit-food-body'>
                        <div className='input-container'>
                            <div className='input-row'>
                                <Select
                                    className='food-select'
                                    value={allValues.selectedTypeFood || {}}
                                    onChange={handleChangeSelect}
                                    options={allValues.listTypeFood}
                                    isDisabled
                                    placeholder='Select type food'
                                    name='selectedTypeFood'
                                />
                                <input
                                    type="text"
                                    className="form-control input-small"
                                    name='nameFood'
                                    placeholder="Enter name"
                                    style={{ marginTop: '20px' }}
                                    {...register("nameFood", {
                                        required: true,
                                        onChange: changeHandler
                                    })}
                                />
                                <input
                                    type="text"
                                    className="form-control input-small"
                                    name='priceFood'

                                    placeholder="Enter price"
                                    style={{ marginTop: '20px' }}
                                    {...register("priceFood", {
                                        required: true,
                                        onChange: changeHandler,
                                        pattern: /^(0|[1-9]\d*)(\.\d+)?$/
                                    })}
                                />

                            </div>

                            {Object.keys(errors).length !== 0 && (
                                <ul className="error-container">
                                    {errors.selectedTypeFood?.type === "required" && <li>Type Food is required</li>}
                                    {errors.nameFood?.type === "required" && <li>Name Food is required</li>}
                                    {errors.priceFood?.type === "required" && <li>Price Food is required</li>}
                                    {errors.priceFood?.type === "pattern" && <li>Price Food is only number</li>}

                                </ul>
                            )}

                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className='modal-footer-container'>
                    {/* <Button color="primary" className='btn btn-save-edit' onClick={() => handleSaveFood()}>Save</Button> */}

                    <Button variant="primary" type='submit' {...allValues.isShowLoading && 'disabled'}>
                        {allValues.isShowLoading &&
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
                        {!allValues.isShowLoading &&
                            <>
                                <span className="visually">Submit</span>
                            </>
                        }
                    </Button>


                </ModalFooter>
            </form>
        </Modal>
    )
}
