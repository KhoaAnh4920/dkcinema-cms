import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './ModalAddFood.scss';
import { CommonUtils } from '../../utils';
import Swal from 'sweetalert2';
import moment from 'moment';
import { getAllTypeFood } from '../../services/FoodServices';
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";




export default function ModalAddFood(props) {

    // const [isOpen, setOpenModal] = useState(false);
    // const [show, setShow] = useState(false);
    const {
        register,
        handleSubmit,
        control,
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
            // You can await here
            let dataType = await getAllTypeFood();


            if (dataType && dataType.dataTypeFood) {
                let listTypeFood = buildDataInputSelect(dataType.dataTypeFood)

                setAllValues((prevState) => ({
                    ...prevState,
                    listTypeFood: listTypeFood
                }));
            }
        }
        fetchDataTypeFood();

    }, []);



    const toggle = () => {
        props.toggleFromParent();
    }

    const handleOpenUploadFile = () => {
        fileUploader.current.click();
    }

    const _handleImageChange = async (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        /*------------ Duck ------------*/
        if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            Swal.fire({
                title: 'Missing data?',
                text: "Sai định dạng ảnh!",
                icon: 'warning',
            })
        }
        /*------------ Duck ------------*/

        else if (file) {
            let base64 = await CommonUtils.getBase64(file);
            reader.onloadend = () => {
                setAllValues({
                    ...allValues,
                    file: file,
                    imagePreviewUrl: reader.result,
                    avatar: base64,
                    fileName: file.name
                })
            }

            reader.readAsDataURL(file)
        }
    }

    const handleChangeSelect = async (selectedOption, name) => {
        // console.log('name: ', handleChangeSelect)
        let stateName = name.name; // Lấy tên của select - selectedOption: lấy giá trị đc chọn trên select //
        let stateCopy = { ...allValues };
        stateCopy[stateName] = selectedOption;
        setAllValues({ ...stateCopy })
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
        props.saveNewFood(allValuesInput);

    }


    return (
        <Modal className={'modal-add-food'} isOpen={props.isOpen} toggle={() => toggle()} centered >
            <ModalHeader toggle={() => toggle()} className='titleModal'>Thêm thực phẩm mới</ModalHeader>
            <form onSubmit={handleSubmit(handleSaveFood)}>
                <ModalBody className='modal-body-container'>
                    <div className='modal-add-food-body'>
                        <div className='input-container'>
                            <div className='input-row'>


                                <Select
                                    options={allValues.listTypeFood}
                                    name="selectedTypeFood"

                                    className='food-select'
                                    placeholder='Chọn loại thực phẩm'
                                    onChange={handleChangeSelect}
                                />

                                <input
                                    type="text"
                                    className="form-control input-small"
                                    name='nameFood'
                                    placeholder="Nhập tên thực phẩm"
                                    style={{ marginTop: '20px' }}
                                    {...register("nameFood", {
                                        required: true,
                                        onChange: changeHandler
                                    })}
                                />
                                <input type="text"
                                    className="form-control input-small"
                                    name='priceFood'
                                    placeholder="Nhập đơn giá"
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
                                <span className="visually">Thêm</span>
                            </>
                        }
                    </Button>


                </ModalFooter>
            </form>
        </Modal>
    )
}
