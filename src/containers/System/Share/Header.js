import React, { useEffect } from 'react';
import './Header.scss';
import { userState, processLogoutUser } from "../../../redux/userSlice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";



export default function Header() {
    let selectUser = useSelector(userState);
    let history = useHistory();
    const dispatch = useDispatch();



    useEffect(() => {
        console.log('userState from header: ', selectUser.isLoggedInAdmin);
        if (!selectUser.isLoggedInAdmin) {
            console.log("OK");
            history.push('/admin-login');
        } else {
            console.log("No");
        }

    }, []);

    const handleLogout = async () => {
        dispatch(processLogoutUser());
        history.push('/admin-login');
    }

    const backToMenu = () => {
        history.push('/');
    }


    return (
        <nav className="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-search fa-fw" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                        <form className="navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-1 small" placeholder="What do you want to look for?" aria-label="Search" aria-describedby="basic-addon2" style={{ borderColor: '#3f51b5' }} />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-bell fa-fw" />
                        <span className="badge badge-danger badge-counter">3+</span>
                    </a>
                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                        <h6 className="dropdown-header">
                            Alerts Center
                        </h6>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="mr-3">
                                <div className="icon-circle bg-primary">
                                    <i className="fas fa-file-alt text-white" />
                                </div>
                            </div>
                            <div>
                                <div className="small text-gray-500">December 12, 2019</div>
                                <span className="font-weight-bold">A new monthly report is ready to download!</span>
                            </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="mr-3">
                                <div className="icon-circle bg-success">
                                    <i className="fas fa-donate text-white" />
                                </div>
                            </div>
                            <div>
                                <div className="small text-gray-500">December 7, 2019</div>
                                $290.29 has been deposited into your account!
                            </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="mr-3">
                                <div className="icon-circle bg-warning">
                                    <i className="fas fa-exclamation-triangle text-white" />
                                </div>
                            </div>
                            <div>
                                <div className="small text-gray-500">December 2, 2019</div>
                                Spending Alert: We've noticed unusually high spending for your account.
                            </div>
                        </a>
                        <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                    </div>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-envelope fa-fw" />
                        <span className="badge badge-warning badge-counter">2</span>
                    </a>
                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="messagesDropdown">
                        <h6 className="dropdown-header">
                            Message Center
                        </h6>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="dropdown-list-image mr-3">
                                <img className="rounded-circle" src="/img/man.png" style={{ maxWidth: '60px' }} alt="" />
                                <div className="status-indicator bg-success" />
                            </div>
                            <div className="font-weight-bold">
                                <div className="text-truncate">Hi there! I am wondering if you can help me with a problem I've been
                                    having.</div>
                                <div className="small text-gray-500">Udin Cilok · 58m</div>
                            </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="dropdown-list-image mr-3">
                                <img className="rounded-circle" src="/img/girl.png" style={{ maxWidth: '60px' }} alt="" />
                                <div className="status-indicator bg-default" />
                            </div>
                            <div>
                                <div className="text-truncate">Am I a good boy? The reason I ask is because someone told me that people
                                    say this to all dogs, even if they aren't good...</div>
                                <div className="small text-gray-500">Jaenab · 2w</div>
                            </div>
                        </a>
                        <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                    </div>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-tasks fa-fw" />
                        <span className="badge badge-success badge-counter">3</span>
                    </a>
                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="messagesDropdown">
                        <h6 className="dropdown-header">
                            Task
                        </h6>
                        <a className="dropdown-item align-items-center" href="#">
                            <div className="mb-3">
                                <div className="small text-gray-500">Design Button
                                    <div className="small float-right"><b>50%</b></div>
                                </div>
                                <div className="progress" style={{ height: '12px' }}>
                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '50%' }} aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </a>
                        <a className="dropdown-item align-items-center" href="#">
                            <div className="mb-3">
                                <div className="small text-gray-500">Make Beautiful Transitions
                                    <div className="small float-right"><b>30%</b></div>
                                </div>
                                <div className="progress" style={{ height: '12px' }}>
                                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '30%' }} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </a>
                        <a className="dropdown-item align-items-center" href="#">
                            <div className="mb-3">
                                <div className="small text-gray-500">Create Pie Chart
                                    <div className="small float-right"><b>75%</b></div>
                                </div>
                                <div className="progress" style={{ height: '12px' }}>
                                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: '75%' }} aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </a>
                        <a className="dropdown-item text-center small text-gray-500" href="#">View All Taks</a>
                    </div>
                </li>
                <div className="topbar-divider d-none d-sm-block" />
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img className="img-profile rounded-circle" src={(selectUser.adminInfo.avatar) ? selectUser.adminInfo.avatar : ''} style={{ maxWidth: '60px' }} />
                        <span className="ml-2 d-none d-lg-inline text-white small">{(selectUser.adminInfo.fullName) ? selectUser.adminInfo.fullName : ''}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        <div className="dropdown-divider" />
                        <a className="dropdown-item" onClick={handleLogout} data-toggle="modal" data-target="#logoutModal">
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                            Logout
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
        // <div className="header-top-area">
        //     <div className="container">
        //         <div className="row">
        //             <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        //                 <div className="logo-area">
        //                     <a href="#"><img src="img/logo/logo.png" alt="" onClick={backToMenu} /></a>
        //                 </div>
        //             </div>
        //             <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
        //                 <div className="header-top-menu">
        //                     <ul className="nav navbar-nav notika-top-nav">

        //                         <li className="nav-item dropdown">
        //                             <a href="#" data-toggle="dropdown" role="button" aria-expanded="false" className="nav-link dropdown-toggle">
        //                                 <span><i class="fa fa-user" aria-hidden="true"></i>{selectUser.adminInfo.fullName}</span>
        //                             </a>
        //                         </li>
        //                         <li className="nav-item dropdown">
        //                             <a href="#" data-toggle="dropdown" role="button" aria-expanded="false" className="nav-link dropdown-toggle" onClick={handleLogout}>
        //                                 <span><i class="fa fa-sign-out" aria-hidden="true"></i>Đăng xuất</span>
        //                             </a>
        //                         </li>



        //                     </ul>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}
