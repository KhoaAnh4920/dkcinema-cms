import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './ModalAddVoucher.scss';
import { CommonUtils } from '../../utils';
import Swal from 'sweetalert2';
import moment from 'moment';
import DatePicker from '../../containers/System/Share/DatePicker';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";



const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập name"),

    code: yup
        .string()
        .required("Vui lòng tạo mã"),

    discount: yup
        .string()
        .required("Vui lòng nhập giá khuyến mãi"),
});



export default function ModalAddVoucher(props) {

    // const [isOpen, setOpenModal] = useState(false);
    // const [show, setShow] = useState(false);



    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });


    const [allValues, setAllValues] = useState({
        timeStart: '',
        timeEnd: '',
        errors: {},
        code: '',
        maxUses: '',
        discount: '',
        condition: '',
        name: '',
        isShowLoading: false,
        isShowLoadingGenCode: false
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

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }


    const handleGenerateCode = () => {

        const genCode = makeid(9);

        setAllValues((prevState) => ({
            ...prevState,
            code: genCode
        }));

    }



    useEffect(() => {
        // async function fetchDataTypeFood() {
        //     // You can await here
        //     let dataType = await getAllTypeFood();


        //     if (dataType && dataType.dataTypeFood) {
        //         let listTypeFood = buildDataInputSelect(dataType.dataTypeFood)

        //         setAllValues((prevState) => ({
        //             ...prevState,
        //             listTypeFood: listTypeFood
        //         }));
        //     }
        // }
        // fetchDataTypeFood();

    }, []);



    const toggle = () => {
        props.toggleFromParent();
    }




    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const handleSaveVoucher = async () => {
        console.log('aaa')
        // setAllValues((prevState) => ({
        //     ...prevState,
        //     isShowLoading: true
        // }));

        // let allValuesInput = { ...allValues };
        // props.saveNewVoucher(allValuesInput);

    }

    const handleOnChangeDatePickerStart = (date) => {
        setAllValues({ ...allValues, timeStart: date[0] })
    }

    const handleOnChangeDatePickerEnd = (date) => {
        setAllValues({ ...allValues, timeEnd: date[0] })
    }


    return (


        <Modal className={'modal-add-voucher'} isOpen={props.isOpen} toggle={() => toggle()} centered size="md-down" >
            <ModalHeader toggle={() => toggle()} className='titleModal'>Add new Voucher</ModalHeader>
            <form onSubmit={handleSubmit(handleSaveVoucher)}>
                <ModalBody className='modal-body-container'>
                    <div className='modal-add-voucher-body'>
                        <div className='input-container'>
                            <div className='input-row'>
                                <div className='form-name-voucher'>
                                    <div className='label-voucher'>
                                        <label htmlFor="exampleInputPassword1">*Tên voucher</label>
                                        <input
                                            type="text"
                                            className="form-control input-small"
                                            value={allValues.name}
                                            name='name'
                                            onChange={changeHandler}
                                            {...register("name", {
                                                required: true,
                                                onChange: changeHandler,
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className='form-code-voucher'>
                                    <div className='label-voucher'>
                                        <label htmlFor="exampleInputPassword1">*Mã voucher</label>
                                        <div className='input-code-voucher'>
                                            <input
                                                type="text"
                                                className="form-control input-small"
                                                value={allValues.code}
                                                name='code'
                                                onChange={changeHandler}
                                            />
                                            <Button variant="primary" {...allValues.isShowLoadingGenCode && 'disabled'} onClick={() => handleGenerateCode()}>
                                                {allValues.isShowLoadingGenCode &&
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
                                                {!allValues.isShowLoadingGenCode &&
                                                    <>
                                                        <span className="visually">Generate</span>
                                                    </>
                                                }
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                                <div className='form-horizontal-voucher'>
                                    <div className='form-maxUses-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">Số lượng voucher</label>
                                            <input type="number" className="form-control input-small" value={allValues.maxUses} name='maxUses' onChange={changeHandler} />
                                        </div>
                                    </div>
                                    <div className='form-maxUses-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">*Giá trị giảm</label>
                                            <input
                                                type="number"
                                                className="form-control input-small"
                                                value={allValues.discount}
                                                name='discount'
                                                onChange={changeHandler}
                                            />
                                        </div>
                                    </div>
                                    <div className='form-maxUses-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">Điều kiện</label>
                                            <input type="number" className="form-control input-small" value={allValues.condition} name='condition' onChange={changeHandler} />
                                        </div>
                                    </div>
                                </div>

                                <div className='form-horizontal-voucher'>
                                    <div className='form-timeStart-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">*Thời gian bắt đầu</label>
                                            <DatePicker
                                                onChange={handleOnChangeDatePickerStart}
                                                className="form-control"
                                                value={allValues.timeStart}
                                                minDate="today"
                                            />
                                        </div>
                                    </div>
                                    <div className='form-timeEnd-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">*Thời gian kết thúc</label>
                                            <DatePicker
                                                onChange={handleOnChangeDatePickerEnd}
                                                className="form-control"
                                                value={allValues.timeEnd}
                                                minDate="today"
                                            />
                                        </div>
                                    </div>
                                </div>





                            </div>


                        </div>
                    </div>
                </ModalBody>

                <ModalFooter className='modal-footer-container'>
                    {Object.keys(errors).length !== 0 && (
                        <ul className="error-modal-container">
                            {errors.name?.type === "required" && <li>Name Voucher is required</li>}
                            {errors.code?.type === "required" && <li>Code is required</li>}
                            {errors.discount?.type === "required" && <li>Discount value is required</li>}
                        </ul>
                    )}

                    <Button className='btn-ft' variant="primary" {...allValues.isShowLoading && 'disabled'} type='submit'>
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
