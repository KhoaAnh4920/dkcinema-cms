export default function authHeader() {
    const data = JSON.parse(localStorage.getItem("persist:admin"));


    const dataLocal = JSON.parse(data.admin)

    //  console.log("Check dataLocal: ", dataLocal);

    if (dataLocal && dataLocal.adminInfo && dataLocal.adminInfo.accessToken) {
        return { Authorization: 'Bearer ' + dataLocal.adminInfo.accessToken };
        // return { "x-auth-token": dataLocal.adminInfo.accessToken };
    } else {
        return {};
    }
}


