import React, { useState } from 'react';
import AdminMenu from '../containers/System/Share/AdminMenu';
import Sidebar from '../containers/System/Share/Sidebar';




function Home() {

    return (
        <>
            {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">Disabled</a>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav> */}

            <div className="header-top-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div className="logo-area">
                                <a href="#"><img src="img/logo/logo.png" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div className="header-top-menu">
                                <ul className="nav navbar-nav notika-top-nav">
                                    <li className="nav-item dropdown">
                                        <a href="#" data-toggle="dropdown" role="button" aria-expanded="false" className="nav-link dropdown-toggle"><span><i className="notika-icon notika-search" /></span></a>
                                        <div role="menu" className="dropdown-menu search-dd animated flipInX">
                                            <div className="search-input">
                                                <i className="notika-icon notika-left-arrow" />
                                                <input type="text" />
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" data-toggle="dropdown" role="button" aria-expanded="false" className="nav-link dropdown-toggle"><span><i className="notika-icon notika-mail" /></span></a>
                                        <div role="menu" className="dropdown-menu message-dd animated zoomIn">
                                            <div className="hd-mg-tt">
                                                <h2>Messages</h2>
                                            </div>
                                            <div className="hd-message-info">
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/1.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>David Belle</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/2.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Jonathan Morris</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/4.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Fredric Mitchell</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/1.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>David Belle</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/2.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Glenn Jecobs</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="hd-mg-va">
                                                <a href="#">View All</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item nc-al"><a href="#" data-toggle="dropdown" role="button" aria-expanded="false" className="nav-link dropdown-toggle"><span><i className="notika-icon notika-alarm" /></span><div className="spinner4 spinner-4" /><div className="ntd-ctn"><span>3</span></div></a>
                                        <div role="menu" className="dropdown-menu message-dd notification-dd animated zoomIn">
                                            <div className="hd-mg-tt">
                                                <h2>Notification</h2>
                                            </div>
                                            <div className="hd-message-info">
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/1.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>David Belle</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/2.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Jonathan Morris</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/4.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Fredric Mitchell</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/1.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>David Belle</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img">
                                                            <img src="img/post/2.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Glenn Jecobs</h3>
                                                            <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="hd-mg-va">
                                                <a href="#">View All</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item"><a href="#" data-toggle="dropdown" role="button" aria-expanded="false" className="nav-link dropdown-toggle"><span><i className="notika-icon notika-menus" /></span><div className="spinner4 spinner-4" /><div className="ntd-ctn"><span>2</span></div></a>
                                        <div role="menu" className="dropdown-menu message-dd task-dd animated zoomIn">
                                            <div className="hd-mg-tt">
                                                <h2>Tasks</h2>
                                            </div>
                                            <div className="hd-message-info hd-task-info">
                                                <div className="skill">
                                                    <div className="progress">
                                                        <div className="lead-content">
                                                            <p>HTML5 Validation Report</p>
                                                        </div>
                                                        <div className="progress-bar wow fadeInLeft" data-progress="95%" style={{ width: '95%' }} data-wow-duration="1.5s" data-wow-delay="1.2s"> <span>95%</span>
                                                        </div>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="lead-content">
                                                            <p>Google Chrome Extension</p>
                                                        </div>
                                                        <div className="progress-bar wow fadeInLeft" data-progress="85%" style={{ width: '85%' }} data-wow-duration="1.5s" data-wow-delay="1.2s"><span>85%</span> </div>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="lead-content">
                                                            <p>Social Internet Projects</p>
                                                        </div>
                                                        <div className="progress-bar wow fadeInLeft" data-progress="75%" style={{ width: '75%' }} data-wow-duration="1.5s" data-wow-delay="1.2s"><span>75%</span> </div>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="lead-content">
                                                            <p>Bootstrap Admin</p>
                                                        </div>
                                                        <div className="progress-bar wow fadeInLeft" data-progress="93%" style={{ width: '65%' }} data-wow-duration="1.5s" data-wow-delay="1.2s"><span>65%</span> </div>
                                                    </div>
                                                    <div className="progress progress-bt">
                                                        <div className="lead-content">
                                                            <p>Youtube App</p>
                                                        </div>
                                                        <div className="progress-bar wow fadeInLeft" data-progress="55%" style={{ width: '55%' }} data-wow-duration="1.5s" data-wow-delay="1.2s"><span>55%</span> </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hd-mg-va">
                                                <a href="#">View All</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item"><a href="#" data-toggle="dropdown" role="button" aria-expanded="false" className="nav-link dropdown-toggle"><span><i className="notika-icon notika-chat" /></span></a>
                                        <div role="menu" className="dropdown-menu message-dd chat-dd animated zoomIn">
                                            <div className="hd-mg-tt">
                                                <h2>Chat</h2>
                                            </div>
                                            <div className="search-people">
                                                <i className="notika-icon notika-left-arrow" />
                                                <input type="text" placeholder="Search People" />
                                            </div>
                                            <div className="hd-message-info">
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img chat-img">
                                                            <img src="img/post/1.jpg" alt="" />
                                                            <div className="chat-avaible"><i className="notika-icon notika-dot" /></div>
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>David Belle</h3>
                                                            <p>Available</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img chat-img">
                                                            <img src="img/post/2.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Jonathan Morris</h3>
                                                            <p>Last seen 3 hours ago</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img chat-img">
                                                            <img src="img/post/4.jpg" alt="" />
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Fredric Mitchell</h3>
                                                            <p>Last seen 2 minutes ago</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img chat-img">
                                                            <img src="img/post/1.jpg" alt="" />
                                                            <div className="chat-avaible"><i className="notika-icon notika-dot" /></div>
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>David Belle</h3>
                                                            <p>Available</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#">
                                                    <div className="hd-message-sn">
                                                        <div className="hd-message-img chat-img">
                                                            <img src="img/post/2.jpg" alt="" />
                                                            <div className="chat-avaible"><i className="notika-icon notika-dot" /></div>
                                                        </div>
                                                        <div className="hd-mg-ctn">
                                                            <h3>Glenn Jecobs</h3>
                                                            <p>Available</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="hd-mg-va">
                                                <a href="#">View All</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AdminMenu />
        </>
    );
}

export default Home;
