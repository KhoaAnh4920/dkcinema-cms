import React, { useState } from 'react';

function AdminMenu() {


    return (
        <>
            <div className="main-menu-area mg-tb-40">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <ul className="nav nav-tabs notika-menu-wrap menu-it-icon-pro">
                                <li className="active"><a data-toggle="tab" href="#Home"><i className="notika-icon notika-house" /> Home</a>
                                </li>
                                <li><a data-toggle="tab" href="#mailbox"><i className="notika-icon notika-mail" /> Email</a>
                                </li>
                                <li><a data-toggle="tab" href="#Interface"><i className="notika-icon notika-edit" /> Interface</a>
                                </li>
                                <li><a data-toggle="tab" href="#Charts"><i className="notika-icon notika-bar-chart" /> Charts</a>
                                </li>
                                <li><a data-toggle="tab" href="#Tables"><i className="notika-icon notika-windows" /> Tables</a>
                                </li>
                                <li><a data-toggle="tab" href="#Forms"><i className="notika-icon notika-form" /> Forms</a>
                                </li>
                                <li><a data-toggle="tab" href="#Appviews"><i className="notika-icon notika-app" /> App views</a>
                                </li>
                                <li><a data-toggle="tab" href="#Page"><i className="notika-icon notika-support" /> Pages</a>
                                </li>
                            </ul>
                            <div className="tab-content custom-menu-content">
                                <div id="Home" className="tab-pane in active notika-tab-menu-bg animated flipInX">
                                    <ul className="notika-main-menu-dropdown">
                                        <li><a href="index.html">Dashboard One</a>
                                        </li>
                                        <li><a href="index-2.html">Dashboard Two</a>
                                        </li>
                                        <li><a href="index-3.html">Dashboard Three</a>
                                        </li>
                                        <li><a href="index-4.html">Dashboard Four</a>
                                        </li>
                                        <li><a href="analytics.html">Analytics</a>
                                        </li>
                                        <li><a href="widgets.html">Widgets</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="mailbox" className="tab-pane notika-tab-menu-bg animated flipInX">
                                    <ul className="notika-main-menu-dropdown">
                                        <li><a href="inbox.html">Inbox</a>
                                        </li>
                                        <li><a href="view-email.html">View Email</a>
                                        </li>
                                        <li><a href="compose-email.html">Compose Email</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="Interface" className="tab-pane notika-tab-menu-bg animated flipInX">
                                    <ul className="notika-main-menu-dropdown">
                                        <li><a href="animations.html">Animations</a>
                                        </li>
                                        <li><a href="google-map.html">Google Map</a>
                                        </li>
                                        <li><a href="data-map.html">Data Maps</a>
                                        </li>
                                        <li><a href="code-editor.html">Code Editor</a>
                                        </li>
                                        <li><a href="image-cropper.html">Images Cropper</a>
                                        </li>
                                        <li><a href="wizard.html">Wizard</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="Charts" className="tab-pane notika-tab-menu-bg animated flipInX">
                                    <ul className="notika-main-menu-dropdown">
                                        <li><a href="flot-charts.html">Flot Charts</a>
                                        </li>
                                        <li><a href="bar-charts.html">Bar Charts</a>
                                        </li>
                                        <li><a href="line-charts.html">Line Charts</a>
                                        </li>
                                        <li><a href="area-charts.html">Area Charts</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="Tables" className="tab-pane notika-tab-menu-bg animated flipInX">
                                    <ul className="notika-main-menu-dropdown">
                                        <li><a href="normal-table.html">Normal Table</a>
                                        </li>
                                        <li><a href="data-table.html">Data Table</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="Forms" className="tab-pane notika-tab-menu-bg animated flipInX">
                                    <ul className="notika-main-menu-dropdown">
                                        <li><a href="form-elements.html">Form Elements</a>
                                        </li>
                                        <li><a href="form-components.html">Form Components</a>
                                        </li>
                                        <li><a href="form-examples.html">Form Examples</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="Appviews" className="tab-pane notika-tab-menu-bg animated flipInX">
                                    <ul className="notika-main-menu-dropdown">
                                        <li><a href="notification.html">Notifications</a>
                                        </li>
                                        <li><a href="alert.html">Alerts</a>
                                        </li>
                                        <li><a href="modals.html">Modals</a>
                                        </li>
                                        <li><a href="buttons.html">Buttons</a>
                                        </li>
                                        <li><a href="tabs.html">Tabs</a>
                                        </li>
                                        <li><a href="accordion.html">Accordion</a>
                                        </li>
                                        <li><a href="dialog.html">Dialogs</a>
                                        </li>
                                        <li><a href="popovers.html">Popovers</a>
                                        </li>
                                        <li><a href="tooltips.html">Tooltips</a>
                                        </li>
                                        <li><a href="dropdown.html">Dropdowns</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="Page" className="tab-pane notika-tab-menu-bg animated flipInX">
                                    <ul className="notika-main-menu-dropdown">
                                        <li><a href="contact.html">Contact</a>
                                        </li>
                                        <li><a href="invoice.html">Invoice</a>
                                        </li>
                                        <li><a href="typography.html">Typography</a>
                                        </li>
                                        <li><a href="color.html">Color</a>
                                        </li>
                                        <li><a href="login-register.html">Login Register</a>
                                        </li>
                                        <li><a href="404.html">404 Page</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminMenu;