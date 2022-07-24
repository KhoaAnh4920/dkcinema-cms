import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { updateStatusNews, deleteNews } from "../../services/NewsServices";
import { getAllPost } from "../../services/NewsServices";
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './ListNews.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';



function ListNews() {

    const [listPost, setPostData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(true);

    let history = useHistory();


    async function fetchDataPost() {

        // You can await here
        const postData = await getAllPost();
        // console.log("postData: ", postData);
        if (postData && postData.data) {


            setPostData(postData.data);
            setShowLoading(false);

        } else {
            setPostData([]);
            setShowLoading(false);
        }
    }

    useEffect(() => {
        setShowLoading(true);
        fetchDataPost();
    }, []);


    const handleChange = async (data) => {

        // console.log('data: ', data);

        setShowLoading(true);

        let res = await updateStatusNews({
            id: data.id,
            status: !data.status
        })

        if (res && res.errCode === 0) {
            toast.success("Cập nhật trạng thái thành công")
            await fetchDataPost();
        }

    };

    const columns = [
        // { title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} /> },
        { title: 'ID', field: 'id' },
        { title: 'Tiêu đề', field: 'title', render: rowData => <span className='title-news' style={{ display: 'inline-block', width: '180px', }}>{rowData.title}</span> },
        { title: 'Ảnh', field: 'thumbnail', render: rowData => <img src={rowData.thumbnail} style={{ width: 150, height: 100 }} /> },
        {
            title: 'Loại', field: 'type', render: rowData =>

                <>
                    {rowData.type == 1 && <span className="badge badge-success">Review phim</span>}
                    {rowData.type == 2 && <span className="badge badge-success">Blog điện ảnh</span>}
                    {rowData.type == 3 && <span className="badge badge-success">Khuyến mãi</span>}
                </>
        },
        { title: 'Ngày tạo', field: 'createdAt', render: rowData => <span>{moment(rowData.createdAt).format('DD/MM/YYYY')}</span> },
        { title: 'Tác giả', field: 'fullName', render: rowData => <span>{(rowData.UserNews && rowData.UserNews.fullName) ? rowData.UserNews.fullName : ''}</span> },
        {
            title: 'Trạng thái', field: 'status', render: rowData => <>
                <div className="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id={rowData.id} checked={rowData.status} onChange={() => handleChange(rowData)} />
                    <label class="custom-control-label" for={rowData.id}></label>
                </div>
            </>
        },
    ]

    const handleOnDeletePost = async (id) => {
        try {
            setShowLoading(true);
            let res = await deleteNews(id);
            if (res && res.errCode === 0) {
                toast.success("Xóa bài viết thành công")
                await fetchDataPost();
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
            <div id="wrapper" className='listPost-main'>
                {/* Sidebar */}

                <Sidebar />

                {/* Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {/* TopBar */}
                        <Header />
                        {/* Topbar */}
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
                            <div className="col-lg-12 mb-4" style={{ zIndex: 1 }}>

                                <MaterialTable
                                    title="Danh sách bài viết"
                                    columns={columns}
                                    data={listPost}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" >Thêm bài viết</button>,
                                            onClick: async (event, rowData) => {
                                                history.push('/add-new-post')
                                            },
                                            isFreeAction: true,
                                        },
                                        {
                                            icon: 'edit',
                                            tooltip: 'Edit Post',
                                            onClick: async (event, rowData) => {
                                                history.push(`/edit-post/${rowData.id}`);
                                            }


                                        },
                                        {
                                            icon: 'delete',
                                            tooltip: 'Delete Post',
                                            onClick: (event, rowData) => Swal.fire({
                                                title: 'Bạn có chắc ?',
                                                text: "Bạn sẽ không khôi phục được nó!",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'OK !'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleOnDeletePost(rowData.id)
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

export default ListNews;
