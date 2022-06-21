import React, { useEffect, useState } from 'react';
import Navigator from './Navigator';
import { userState, processLogoutUser } from "../../../redux/userSlice";
import { adminMenu, merchantMenu } from './menuApp';
import { useSelector } from "react-redux";
import _ from 'lodash';



function Sidebar() {
    const [menuApp, setMenuApp] = useState([]);
    let selectUser = useSelector(userState);

    useEffect(() => {
        console.log('userState from header: ', selectUser);
        let menuApp = [];
        if (selectUser && !_.isEmpty(selectUser)) {

            let role = selectUser.adminInfo.roleId;

            console.log(role);
            if (role === 1) {
                menuApp = adminMenu;
            }
            if (role === 2) {
                menuApp = merchantMenu;
            }
        }
        console.log("Check menu: ", menuApp);
        setMenuApp(menuApp);

        console.log(menuApp);
    }, []);

    // Lấy role để set menu động //
    // componentDidMount() {
    //     let { userInfo } = this.props;
    //     let menu = [];
    //     if (userInfo && !_.isEmpty(userInfo)) {
    //         let role = userInfo.roleId;
    //         if (role === USER_ROLE.ADMIN) {
    //             menu = adminMenu;
    //         }
    //         if (role === USER_ROLE.DOCTOR) {
    //             menu = doctorMenu;
    //         }
    //     }

    //     this.setState({
    //         menuApp: menu
    //     })
    // }



    return (
        <>
            <>
                <Navigator menus={menuApp} />

            </>

        </>
    );
}

export default Sidebar;