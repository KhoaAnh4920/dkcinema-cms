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



export default function ModalEditFood(props) {

    // const [isOpen, setOpenModal] = useState(false);
    // const [show, setShow] = useState(false);
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

                    setAllValues((prevState) => ({
                        ...prevState,
                        listTypeFood: listTypeFood,
                        selectedTypeFood,
                        nameFood: dataFood.name,
                        priceFood: dataFood.price,
                        id: dataFood.id
                    }));
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
        <Modal className={'modal-add-food'} isOpen={props.isOpen} toggle={() => toggle()} centered >
            <ModalHeader toggle={() => toggle()} className='titleModal'>Edit food</ModalHeader>
            <ModalBody className='modal-body-container'>
                <div className='modal-add-food-body'>
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
                            <input type="text" className="form-control input-small" name='nameFood' value={allValues.nameFood} onChange={changeHandler} placeholder="Enter name" style={{ marginTop: '20px' }} />
                            <input type="text" className="form-control input-small" name='priceFood' value={allValues.priceFood} onChange={changeHandler} placeholder="Enter price" style={{ marginTop: '20px' }} />

                        </div>

                    </div>
                </div>
            </ModalBody>
            <ModalFooter className='modal-footer-container'>
                {/* <Button color="primary" className='btn btn-save-edit' onClick={() => handleSaveFood()}>Save</Button> */}

                <Button variant="primary" {...allValues.isShowLoading && 'disabled'} onClick={() => handleSaveFood()}>
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
        </Modal>
    )
}
