import Cookies from 'js-cookie';

export const path = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/sign-up',
    LOG_OUT: '/logout',
    ADMIN: '/admin',
    ADMIN_LOGIN: '/admin-login',

};

// Chưa sửa //

export const ROLES_TYPE = {
    ALL: 0,
    MASTER_ADMIN: 1,
    SUPPLIER_PRODUCT: 2,
    BOCONGTHUONG: 3,
};
export const CHANGE_ROLES_TYPE = {
    MASTER_ADMIN: 'VRS_ADMIN',
    SUPPLIER_PRODUCT: 'SUPPLIER',
};

export const tokenVRS = Cookies.get('___vrsToken');
export const infoUserVRS = Cookies.get('__infoUserVrs');
export function getPermission() {
    if (!infoUserVRS) return null;
    const info = JSON.parse(infoUserVRS) ?? null;
    console.log('info.userInfo', info.userInfo);

    const { email } = info?.userInfo;
    const { id: role } = info?.userInfo?.role;

    switch (role) {
        case 1:
            if (email && email === 'bocongthuong_vrs@vrs.vn') {
                return ROLES_TYPE.BOCONGTHUONG;
            }
            return ROLES_TYPE.MASTER_ADMIN;
        case 2:
            return ROLES_TYPE.SUPPLIER_PRODUCT;
        default:
            return null;
    }
}
export function getPermissionRole() {
    let roles = tokenVRS ? JSON.parse(infoUserVRS).userInfo.role.code : null;
    switch (roles) {
        case 'VRS_ADMIN':
            return CHANGE_ROLES_TYPE.MASTER_ADMIN;
        case 'SUPPLIER':
            return CHANGE_ROLES_TYPE.SUPPLIER_PRODUCT;
        default:
            return null;
    }
}
