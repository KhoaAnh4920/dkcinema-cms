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
    const [isShowLoading, setShowLoading] = useState(false);

    let history = useHistory();


    async function fetchDataPost() {

        // You can await here
        const postData = await getAllPost();
        console.log("postData: ", postData);
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
            toast.success("Update status success")
            await fetchDataPost();
        }

    };

    const columns = [
        // { title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} /> },
        { title: 'ID', field: 'id' },
        { title: 'Title', field: 'title', render: rowData => <span className='title-news' style={{ display: 'inline-block', width: '180px', }}>{rowData.title}</span> },
        { title: 'Thumbnail', field: 'thumbnail', render: rowData => <img src={rowData.thumbnail} style={{ width: 100, height: 80 }} /> },
        { title: 'Total Comment', field: 'CommentNews', render: rowData => <span>{rowData.CommentNews.length}</span> },

    ]

    const handleOnDeletePost = async (id) => {
        try {
            setShowLoading(true);
            let res = await deleteNews(id);
            if (res && res.errCode === 0) {
                toast.success("Delete post success")
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
            <LoadingOverlay
                active={isShowLoading}
                spinner={<BeatLoader color='#fff' size={20} />}
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: 'rgb(10 10 10 / 68%)'
                    })
                }}
            >
                <div id="wrapper" className='listPost-main'>
                    {/* Sidebar */}

                    <Sidebar />

                    {/* Sidebar */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            {/* TopBar */}
                            <Header />
                            {/* Topbar */}
                            <div className="col-lg-12 mb-4">
                                <MaterialTable
                                    title="List comment"
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

export default TotalComment;
