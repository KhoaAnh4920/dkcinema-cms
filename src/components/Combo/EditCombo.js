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
//Image upload modules
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css';




function EditCombo() {

    const [allValues, setAllValues] = useState({
        isShowLoading: true,
        isLoadingButton: false,
        name: '',
        price: '',
        listFood: [],
        listItem: [],
    });

    const [valImg, setValImg] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    })

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


        let result = [];

        //  console.log('dataDetailCombo.data[0]: ', dataDetailCombo.data[0])

        if (dataDetailCombo.data[0].image && dataDetailCombo.data[0].public_id_image) {

            let obj = {};
            obj.uid = dataDetailCombo.data[0].id;
            obj.name = dataDetailCombo.data[0].public_id_image;
            obj.public_id = dataDetailCombo.data[0].public_id_image;
            obj.status = 'done';
            obj.url = dataDetailCombo.data[0].image;
            result.push(obj);
        }


        // console.log('result: ', result)


        setValImg((prevState) => ({
            ...prevState,
            fileList: result
        }));


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
        // console.log("input: ", input);
        // console.log("id: ", input[0].id);
        if (input.is('input')) {
            input[0][isNegative ? 'stepDown' : 'stepUp']()
        }
    }


    const handleEditCombo = async () => {
        // setAllValues((prevState) => ({
        //     ...prevState,
        //     isLoadingButton: true
        // }))
        //  console.log("Check all value: ", allValues);
        let quantity = document.getElementsByClassName("quantity");
        let items = [];
        for (let a = 0; a < quantity.length; a++) {
            let obj = {};
            if (+quantity[a].value !== 0) {
                obj.foodId = +quantity[a].id;
                obj.amount = +quantity[a].value;
                items.push(obj);
            }
            //  console.log(allValues.listFood)
            if (+quantity[a].value === 0) {
                let res = allValues.listFood.some(item => (item.id === +quantity[a].id && item.amount !== 0));
                if (res) {
                    obj.foodId = +quantity[a].id;
                    obj.amount = +quantity[a].value;
                    items.push(obj);
                }
            }
        }

        let res = '';
        if (valImg.fileList && valImg.fileList[0] && valImg.fileList[0].originFileObj) {
            let result = [];
            await Promise.all(valImg.fileList.map(async (item, index) => {

                let obj = {};
                obj.image = await getBase64(item.originFileObj);
                obj.fileName = item.name;
                result.push(obj);

            }))

            // validate //
            // console.log('item: ', items);
            // console.log('allValues: ', allValues);
            // console.log('result: ', result);

            if (!allValues.name || !allValues.price) {
                toast.error("Điền đầy đủ thông tin !!")
                return;
            }

            res = await editCombo({
                name: allValues.name,
                price: +allValues.price,
                items: items,
                id: id,
                image: result[0].image,
                fileName: result[0].fileName
            })

        } else {
            // validate //

            // console.log('else');
            // console.log('item: ', items);
            // console.log('allValues: ', allValues);

            if (!allValues.name || !allValues.price) {
                toast.error("Điền đầy đủ thông tin !!")
                return;
            }


            res = await editCombo({
                name: allValues.name,
                price: +allValues.price,
                items: items,
                id: id
            })
        }

        if (res && res.errCode == 0) {
            history.push("/combo-management")
            toast.success("Cập nhật thông tin combo thành công");
        } else {
            toast.error(res.errMessage);
        }
    }


    //Image Preview
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setValImg((prevState) => ({
            ...prevState,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        }));

    };

    const handleChangeImage = ({ fileList }) => {

        //  console.log(fileList);
        if (fileList.length > 1) {
            toast.error("Chỉ được tải lên 1 ảnh");
            return;
        }
        if (fileList.length > 0) {
            const isJpgOrPng = fileList[fileList.length - 1].type === 'image/jpeg' || fileList[fileList.length - 1].type === 'image/png';

            if (!isJpgOrPng) {
                toast.error("Hãy chọn ảnh !!");
                setValImg((prevState) => ({
                    previewVisible: false,
                    previewImage: '',
                    previewTitle: '',
                    fileList: [],
                }));
                return;
            }
        }
        //  console.log(fileList);
        setValImg((prevState) => ({
            ...prevState,
            fileList
        }));
    }

    //Uploaded url
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const handleCancel = () => {

        setValImg((prevState) => ({
            ...prevState,
            previewVisible: false
        }));
    }


    // const handleRemove = async (e) => {

    //     if (e.public_id && typeof (e.uid) !== 'string') {
    //         let res = await removeImageFilm(e.uid);

    //         if (res && res.errCode === 0) {
    //             toast.success("Delete image succeed !!!");
    //             let fileList = valImg.fileList.filter(item => item.uid !== e.uid)

    //             setValImg((prevState) => ({
    //                 ...prevState,
    //                 fileList
    //             }));
    //         }

    //         else
    //             toast.error(res.errMessage);
    //     } else {
    //         setValImg((prevState) => ({
    //             ...prevState,
    //         }));
    //     }

    // }









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

            <div id="wrapper" className='edit-combo-main'>
                {/* Sidebar */}

                <Sidebar />

                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}


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
                            <div className='row' style={{ padding: '10px' }}>

                                <div className="col-lg-6 mb-4">

                                    <MaterialTable
                                        title="Danh sách thực phẩm"
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
                                        <h5>Cập nhật thông tin combo</h5>
                                        <div className='vertical-input'>
                                            <Upload
                                                action={""}
                                                listType="picture-card"
                                                fileList={valImg.fileList}
                                                onPreview={handlePreview}
                                                beforeUpload={() => {
                                                    /* update state here */
                                                    return false;
                                                }}
                                                onChange={handleChangeImage}
                                            >
                                                {
                                                    valImg.fileList.length >= 8 ? null :
                                                        <>
                                                            <div>
                                                                <PlusOutlined />
                                                                <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                                            </div>
                                                        </>}
                                            </Upload>
                                            <Modal
                                                visible={valImg.previewVisible}
                                                title={valImg.previewTitle}
                                                footer={null}
                                                onCancel={handleCancel}
                                            >
                                                <img alt="example" style={{ width: '100%' }} src={valImg.previewImage} />
                                            </Modal>
                                        </div>
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
                                                        <span className="visually">Cập nhật</span>
                                                    </>
                                                }
                                            </Button>
                                        </div>
                                    </div>


                                </div>
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

export default EditCombo;
