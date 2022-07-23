import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './ModalEditVoucher.scss';
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
        .required("Vui lòng nhập tên voucher"),

    code: yup
        .string()
        .required("Vui lòng tạo mã"),

    discount: yup
        .number('Discount phải là số')
        .integer('Diacount chỉ được nhập số nguyên')
        .min(1, 'Discount min là 1')
        .required('Vui lòng tạo discount'),
});

export default function ModalEditVoucher(props) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({ resolver: yupResolver(schema) });
    const fileUploader = useRef(null);
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
        async function fetchEditVoucher() {
            if (props.dataVoucher) {
                let dataVoucher = props.dataVoucher;

                console.log('dataVoucher: ', dataVoucher)


                let defaultValues = {};
                defaultValues.name = dataVoucher.name;
                defaultValues.code = dataVoucher.code;
                defaultValues.discount = dataVoucher.discount;
                defaultValues.maxUses = dataVoucher.maxUses;
                defaultValues.condition = dataVoucher.condition;
                defaultValues.timeStart = dataVoucher.timeStart || null;
                defaultValues.timeEnd = dataVoucher.timeEnd || null;


                setAllValues({
                    name: dataVoucher.name,
                    code: dataVoucher.code,
                    discount: +dataVoucher.discount,
                    maxUses: +dataVoucher.maxUses,
                    condition: +dataVoucher.condition,
                    timeStart: dataVoucher.timeStart || null,
                    timeEnd: dataVoucher.timeEnd || null,
                    id: dataVoucher.id
                })

                reset({ ...defaultValues });
            }
        }

        fetchEditVoucher();

    }, []);



    const toggle = () => {
        props.toggleFromParentEditVoucher();
    }




    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const handleEditVoucher = async () => {
        setAllValues((prevState) => ({
            ...prevState,
            isShowLoading: true
        }));

        let allValuesInput = { ...allValues };

        props.saveEditVoucher(allValuesInput);

    }

    const handleOnChangeDatePickerStart = (date) => {
        setAllValues({ ...allValues, timeStart: date[0] })
    }

    const handleOnChangeDatePickerEnd = (date) => {
        setAllValues({ ...allValues, timeEnd: date[0] })
    }

    return (
        <Modal className={'modal-edit-voucher'} isOpen={props.isOpen} toggle={() => toggle()} centered size="md-down" >
            <ModalHeader toggle={() => toggle()} className='titleModal'>Cập nhật voucher</ModalHeader>
            <form onSubmit={handleSubmit(handleEditVoucher)}>
                <ModalBody className='modal-body-container'>
                    <div className='modal-edit-voucher-body'>
                        <div className='input-container'>
                            <div className='input-row'>
                                <div className='form-name-voucher'>
                                    <div className='label-voucher'>
                                        <label htmlFor="exampleInputPassword1">*Tên voucher</label>
                                        <input
                                            type="text"
                                            className="form-control input-small"
                                            name='name'
                                            {...register("name", {
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
                                                name='code'
                                                readOnly
                                                {...register("code", {
                                                    required: true,
                                                    onChange: changeHandler,
                                                })}

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
                                            <label htmlFor="exampleInputPassword1">*Số lượng voucher</label>
                                            <input type="number" readOnly className="form-control input-small" value={allValues.maxUses} name='maxUses' onChange={changeHandler} />
                                        </div>
                                    </div>
                                    <div className='form-maxUses-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">*Giá trị giảm</label>
                                            <input
                                                type="number"
                                                min={1}
                                                readOnly
                                                className="form-control input-small"
                                                name='discount'
                                                {...register("discount", {
                                                    onChange: changeHandler,
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className='form-maxUses-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">*Điều kiện</label>
                                            <input type="number" className="form-control input-small" value={allValues.condition} name='condition' onChange={changeHandler} />
                                        </div>
                                    </div>
                                </div>

                                <div className='form-horizontal-voucher'>
                                    <div className='form-timeStart-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">*Thời gian bắt đầu</label>
                                            <DatePicker
                                                readOnly
                                                onChange={handleOnChangeDatePickerEnd}
                                                className="form-control"
                                                value={allValues.timeStart}

                                            />
                                        </div>
                                    </div>
                                    <div className='form-timeEnd-voucher'>
                                        <div className='label-voucher'>
                                            <label htmlFor="exampleInputPassword1">*Thời gian kết thúc</label>
                                            <DatePicker
                                                readOnly
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
                    {Object.keys(errors).length !== 0 &&
                        <ul className="error-container">
                            {errors.name && errors.name.message &&
                                <li>{errors.name.message}</li>
                            }
                            {errors.code && errors.code.message &&
                                <li>{errors.code.message}</li>
                            }
                            {errors.discount && errors.discount.message &&
                                <li>{errors.discount.message}</li>
                            }
                        </ul>
                    }

                    <Button variant="primary" className='btn-ft' type='submit' {...allValues.isShowLoading && 'disabled'}>
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
                                <span className="visually">Cập nhật</span>
                            </>
                        }
                    </Button>


                </ModalFooter>
            </form>
        </Modal>
    )
}
