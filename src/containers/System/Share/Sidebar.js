import React, { useState } from 'react';
import Navigator from './Navigator';
import { adminMenu } from './menuApp';

function Sidebar() {


    return (
        <>
            <>
                <Navigator menus={adminMenu} />

            </>

        </>
    );
}

export default Sidebar;