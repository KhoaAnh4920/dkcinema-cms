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
import { useForm } from "react-hook-form";





export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoadingButton, setLoadingButton] = useState(false);
    const dispatch = useDispatch();
    let history = useHistory();
    let selectUser = useSelector(userState);
    // sử dụng schema đã tạo ở trên vào RHF
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();



    useEffect(() => {
        if (selectUser.isLoggedInAdmin)
            history.push('/');
    }, []);


    const handleLogin = async () => {

        console.log('OK');

        setLoadingButton(true);
        try {
            let data = await hanedleLoginUser(email, password); // goi api login //
            console.log("Check data: ", data);
            if (data && data.errorCode === 0) {
                console.log('---login ok---');

                //this.props.testRedux();

                dispatch(adminLoginSuccess(data.data));
                toast.success("Login success");
                history.push("/");
            } else if (data.errorCode === 4) {
                toast.error(data.message)
                setLoadingButton(false);
            } else {
                console.log("Lỗi: ", data.message);

                setLoadingButton(false);
            }
        } catch (e) {
            // Lấy mã lỗi // 
            console.log(e);
            setLoadingButton(false);
            toast.error("Something error. Please try again");

        }

    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(handleLogin)
        }
    }

    const checkKeyDown = (e) => {
        if (e.code === 'Enter') handleSubmit(handleLogin)();
    };

    return (
        <form onSubmit={handleSubmit(handleLogin)} onKeyDown={(e) => checkKeyDown(e)}>
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
                                name="email"
                                id="email"
                                className="form-control"
                                value={email}
                                placeholder='Enter your email'
                                {...register("email", {
                                    required: true,
                                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                })}
                                onChange={e => setEmail(e.target.value)}
                            />
                            {Object.keys(errors).length !== 0 && (
                                (errors.email?.type === "required" && <span className='error-content'>Email is required</span>) ||
                                (errors.email?.type === "pattern" && <span className='error-content'>Invalid Email Address</span>)
                            )}
                        </div>
                        <div className='col-12 form-group password-input'>
                            <label>Password: </label>
                            <div className='custom-input-password'>
                                <input
                                    type='password'
                                    name="password"
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                    })}
                                    placeholder='Enter your password'
                                    onChange={e => setPassword(e.target.value)}


                                />
                                {Object.keys(errors).length !== 0 && (
                                    (errors.password?.type === "required" && <span className='error-content'>Password is required</span>) ||
                                    (errors.password?.type === "minLength" && <span className='error-content'>Password must be 6 characters long</span>)
                                )}
                                <span style={{ fontSize: '12px', marginTop: '5px', float: 'right' }}>Forgot password ?</span>

                            </div>

                        </div>
                        <div className='col-12'>
                            {/* <button
                            className='btn-login'
                            onClick={handleLogin}
                        >Đăng nhập
                        </button> */}

                            {/* <button type="submit">Đăng nhập</button> */}


                            <Button variant="primary" type="submit" className='btn-login' {...isLoadingButton && 'disabled'} >
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
        </form>
    )
}
