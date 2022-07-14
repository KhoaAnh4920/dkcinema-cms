import React, { useState, useEffect } from 'react';
import logo from '../../assets/DKCinema.png';
import { useDispatch } from "react-redux";
import './Login.scss';
import { hanedleLoginUser } from '../../services/UserService';
import { adminLoginSuccess } from '../../redux/userSlice';
import { useHistory } from "react-router-dom";
import { userState } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';



export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [isLoadingButton, setLoadingButton] = useState(false);
    const dispatch = useDispatch();
    let history = useHistory();
    let selectUser = useSelector(userState);


    useEffect(() => {
        if (selectUser.isLoggedInAdmin)
            history.push('/');
    }, []);


    const handleLogin = async () => {
        // Clear mã lỗi //
        // setErrMessage('');
        setLoadingButton(true);
        try {
            let data = await hanedleLoginUser(email, password); // goi api login //
            console.log("Check data: ", data);
            if (data && data.errorCode === 0) {
                console.log('---login ok---');
                console.log("Check data: ".data);

                //this.props.testRedux();

                dispatch(adminLoginSuccess(data.data));
                toast.success("Login success");
                history.push("/");
            } else if (data.errorCode === 4) {
                toast.error(data.message)
                setLoadingButton(false);
            } else {
                console.log("Lỗi: ", data.message);
                setErrMessage(data.message);
                setLoadingButton(false);
            }
        } catch (e) {
            // Lấy mã lỗi // 
            console.log(e);
            setLoadingButton(false);
            toast.error("Something error. Please try again");
            if (e.response) {
                if (e.response.data) {
                    setErrMessage(e.response.data);

                }
            }
        }

    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }


    return (
        <div className='login-background'>
            <div className='login-container'>
                <div className='login-admin-content row'>
                    <div className='col-12 text-center text-login'>
                        <img className='img-logo' src={logo} />
                    </div>
                    <div className='col-12 form-group email-input'>
                        <label>Email: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            placeholder='Enter your username'
                            onChange={e => setEmail(e.target.value)}
                        />
                        {errMessage && errMessage !== '' &&
                            <><span style={{ color: 'red', fontSize: '12px' }}>{errMessage}</span></>
                        }
                    </div>
                    <div className='col-12 form-group password-input'>
                        <label>Password: </label>
                        <div className='custom-input-password'>
                            <input
                                type='password'
                                className="form-control"
                                value={password}
                                placeholder='Enter your password'
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={event => handleKeyDown(event)}

                            />
                            {errMessage && errMessage !== '' &&
                                <><span style={{ color: 'red', fontSize: '12px' }}>{errMessage}</span></>
                            }
                            <span style={{ fontSize: '12px', marginTop: '5px', float: 'right' }}>Forgot password ?</span>

                        </div>

                    </div>
                    <div className='col-12'>
                        {/* <button
                            className='btn-login'
                            onClick={handleLogin}
                        >Đăng nhập
                        </button> */}

                        <Button variant="primary" className='btn-login' {...isLoadingButton && 'disabled'} onClick={handleLogin} >
                            {isLoadingButton &&
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="visually" style={{ marginLeft: '10px' }}>Loading...</span>
                                </>

                            }
                            {!isLoadingButton &&
                                <>
                                    <span className="visually">Login</span>
                                </>
                            }
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
}
