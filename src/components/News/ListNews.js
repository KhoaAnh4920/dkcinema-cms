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
        setShowLoading(true);
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
        {
            title: 'Type', field: 'type', render: rowData =>

                <>
                    {rowData.type == 1 && <span className="badge badge-success">Review phim</span>}
                    {rowData.type == 2 && <span className="badge badge-success">Giới thiệu phim</span>}
                    {rowData.type == 3 && <span className="badge badge-success">Khuyến mãi</span>}
                </>
        },
        { title: 'Created at', field: 'createdAt', render: rowData => <span>{moment(rowData.createdAt).format('DD/MM/YYYY')}</span> },
        { title: 'Author', field: 'fullName', render: rowData => <span>{(rowData.UserNews && rowData.UserNews.fullName) ? rowData.UserNews.fullName : ''}</span> },
        {
            title: 'Show', field: 'status', render: rowData => <>
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
                                    title="List Post"
                                    columns={columns}
                                    data={listPost}

                                    actions={[
                                        {
                                            icon: () => <button type="button" className="btn btn-info" >Add post</button>,
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
                                                title: 'Are you sure?',
                                                text: "You won't be able to revert this!",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Yes, delete it!'
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

export default ListNews;
