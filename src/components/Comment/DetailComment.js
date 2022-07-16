import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Header from '../../containers/System/Share/Header';
import { updateStatusNews, deleteNews } from "../../services/NewsServices";
import { getDetailComment, deleteCommentService } from "../../services/NewsServices";
import MaterialTable from 'material-table';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from '../../containers/System/Share/Footer';
import './DetailComment.scss';
import Sidebar from '../../containers/System/Share/Sidebar';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';




function DetailComment() {

    const [listComment, setCommentData] = useState([]);
    const [isShowLoading, setShowLoading] = useState(false);

    let history = useHistory();
    const { id } = useParams();




    async function fetchDetailComment() {

        // You can await here
        const commentData = await getDetailComment({
            newsId: id
        });
        console.log("commentData: ", commentData);
        if (commentData && commentData.data) {


            setCommentData(commentData.data);
            setShowLoading(false);

        } else {
            setCommentData([]);
            setShowLoading(false);
        }
    }

    useEffect(() => {
        // setShowLoading(true);
        fetchDetailComment();
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
            await fetchDetailComment();
        }

    };

    const columns = [
        // { title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} /> },
        { title: 'ID', field: 'id' },
        { title: 'Comment', field: 'comment' },
        { title: 'Rating', field: 'rating' },
        { title: 'FullName', field: 'FullName', render: rowData => <span>{rowData.CustomerComment.fullName}</span> },

    ]


    const handleOnDeleteComment = async (id) => {
        try {


            let res = await deleteCommentService(id);
            if (res && res.errCode === 0) {
                await fetchDetailComment();
            } else {
                alert(res.errMessage)
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
                <div id="wrapper" className='listComment-main'>
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
                                    title="Comment"
                                    columns={columns}
                                    data={listComment}

                                    actions={[

                                        {
                                            icon: 'delete',
                                            tooltip: 'Delete Comment',
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
                                                    handleOnDeleteComment(rowData.id)
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

export default DetailComment;
