// store/userSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state cho slice, có thể kèm giá trị mặc định ban đầu
const initialState = {
    isLoggedInAdmin: false,
    adminInfo: null,
    language: 'vi',
    username: "Guest",
    email: '',
    roleId: 1,
    avatar: null,
    token: '',
    fullName: ''
};

// Cấu hình slice
export const userSlice = createSlice({
    name: "admin",  // Tên của slice, m  ỗi slice đặt 1 tên khác nhau để phân biệt
    initialState,
    // Reducers chứa các hàm xử lý cập nhật state
    reducers: {
        // Hàm có 2 tham số là state hiện tại và action truyền vào
        updateUsername: (state, action) => {
            // Cập nhật state username với giá trị truyền vào qua action (action.payload)
            // Chạy thử console.log(action) để xem chi tiết giá trị action truyền vào
            state.username = action.payload;
        },

        adminLoginSuccess: (state, action) => {
            state.adminInfo = action.payload;
            state.isLoggedInAdmin = true;
        },

        processLogoutUser: (state) => {
            state.userInfo = null;
            state.isLoggedInAdmin = false;
        }
    }
});

// Export action ra để sử dụng cho tiện.
export const { updateUsername, adminLoginSuccess, processLogoutUser } = userSlice.actions;

// Action là 1 hàm trả về object dạng {type, payload}, chạy thử console.log(updateUsername()) để xem chi tiết

// Hàm giúp lấy ra state mong muốn.
// Hàm này có 1 tham số là root state là toàn bộ state trong store, chạy thử console.log(state) trong nội dung hàm để xem chi tiết
export const selectUser = state => state.admin.isLoggedInAdmin;

export const selectLanguage = state => state.admin.language;
export const userState = state => state.admin;

// Export reducer để nhúng vào Store
export default userSlice.reducer;