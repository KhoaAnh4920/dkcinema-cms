import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { updateStatusNews, deleteNews } from "../../services/NewsServices";
import { getAllPost } from "../../services/NewsServices";
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './TotalComment.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';



function TotalComment() {

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
        // setShowLoading(true);
        fetchDataPost();
    }, []);


    const handleChange = async (data) => {

        console.log('data: ', data);

        setShowLoading(true);

        let res = await updateStatusNews({
            id: data.id,
            status: !data.status
        })

        if (res && res.errCode === 0) {
            toast.success("Thay đổi trạng thái thành công")
            await fetchDataPost();
        }

    };

    const columns = [
        // { title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} /> },
        { title: 'ID', field: 'id' },
        { title: 'Tiêu đề', field: 'title', render: rowData => <span className='title-news' style={{ display: 'inline-block', width: '180px', }}>{rowData.title}</span> },
        { title: 'Ảnh', field: 'thumbnail', render: rowData => <img src={rowData.thumbnail} style={{ width: 100, height: 80 }} /> },
        { title: 'Tổng số bình luận', field: 'CommentNews', render: rowData => <span>{rowData.CommentNews.length}</span> },

    ]

    const handleOnDeletePost = async (id) => {
        try {
            setShowLoading(true);
            let res = await deleteNews(id);
            if (res && res.errCode === 0) {
                toast.success("Xóa bình luận thành công")
                await fetchDataPost();
            } else {
                toast.error(res.errMessage)
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
                        <div className="col-lg-12 mb-4" style={{ zIndex: 1 }}>
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
                                <MaterialTable
                                    title="Danh sách bài viết"
                                    columns={columns}
                                    data={listPost}

                                    actions={[

                                        {

                                            icon: () => <i class="fas fa-info-circle" style={{ 'fontSize': '16px' }}></i>,
                                            onClick: async (event, rowData) => {
                                                history.push(`/detail-comment/${rowData.id}`);
                                            },

                                        },
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





        </>
    );
}

export default TotalComment;
