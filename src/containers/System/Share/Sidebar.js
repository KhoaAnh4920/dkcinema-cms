import React, { useState } from 'react';
import Navigator from './Navigator';
import { adminMenu } from './menuApp';

function Sidebar() {


    return (
        <>
            <div className="main-menu-area mg-tb-40">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <Navigator menus={adminMenu} />

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Sidebar;