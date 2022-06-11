import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import './TestModal.scss';


export default function TestModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    console.log('props.modalIdForm: ', props)
    return (
        <>
            {/* <button type="button" className="btn btn-info" data-toggle="modal" data-target="#myModalthree">Modal Large</button> */}
            <div className="modal fade in" id={props.data} role="dialog">
                <div className="modal-dialog modal-large">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">×</button>
                        </div>
                        <div className="modal-body">
                            <h2>Modal title</h2>
                            <p>Curabitur blandit mollis lacus. Nulla sit amet est. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Cras sagittis.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Save changes</button>
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="modals-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="modals-list mg-t-30">
                                <div className="modals-single">
                                    <div className="modals-hd">
                                        <h2>Modals sizes</h2>
                                        <p>Modals have two optional sizes, available via modifier classes to be placed on a <code>.modals-default, .modal-sm, .modal-large</code>.</p>
                                    </div>
                                    <div className="modals-default-cl">
                                        

                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}
