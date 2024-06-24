import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { registerRoute } from '../utils/ApiRoutes';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/loader/Loader';

const Register = () => {
    const nameRef = useRef();
    const [username,setUserName] = useState('');
    const [isRegistered,setisRegistered] = useState(false)
    const passwordRef = useRef();
    const [clickedBtn, setClickedBtn] = useState(false)
    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: "",
        name: "",
        password: ""
    });

    const [popup, setPopup] = useState({
        visible: false,
        message: ''
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chat-app-user'));
        if (user) {
            navigate('/');
        }
    }, [navigate]);

    function handleSubmit(e) {
        e.preventDefault();
        setClickedBtn(true)
        const newValues = {
            username: username,
            name: nameRef.current.value,
            password: passwordRef.current.value
        };
        setValues(newValues);
        registerUser(newValues);
    }

    function validation(values) {
        const { username, name, password } = values;
        if (username.length > 3 && name.length > 5 && password.length > 3) {
            return true;
        } else {
            
            setTimeout(() => {
                setClickedBtn(false)
                showPopup('Should username>3 && name>5 && password>3');
            }, 100);
            return false;
        }
    }

    async function registerUser(values) {
        const { username, name, password } = values;

        try {
            if (validation(values)) {
                const { data } = await axios.post(registerRoute, {
                    username,
                    name,
                    password
                });
                console.log(data)
                if (data.message === 'User already exists') {
                    setClickedBtn(false)
                    showPopup(data.message);
                } else if (data.message === 'User registered successfully') {

                    console.log('Registration successful');
                    setisRegistered(!isRegistered)
                    showPopup(data.message)
                    setClickedBtn(false)
                    setTimeout(() => {

                        navigate('/login');
                    }, 1000);

                }
            }
        } catch (error) {
            showPopup('Registration failed. Please check your inputs.');
            setClickedBtn(false)
        }
    }

    function showPopup(message) {
        setPopup({
            visible: true,
            message: message
        });

        setTimeout(() => {
            setPopup({
                visible: false,
                message: ''
            });
        }, 2000);
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-900 p-4'>
            <form onSubmit={handleSubmit} className='border shadow border-gray-700 shadow-slate-800 w-full max-w-md p-8  rounded-xl relative'>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        name='username'
                        value={username}
                        placeholder='username'
                        className='w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e)=> setUserName(e.target.value.toLowerCase().trim(' '))}
                    />
                </div>
                <div className="mb-4">
                    <input
                        ref={nameRef}
                        type="text"
                        name='name'
                        placeholder='Enter Full Name'
                        className='w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className="mb-6">
                    <input
                        ref={passwordRef}
                        type="password"
                        name='password'
                        placeholder='Password'
                        className='w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className="mb-4">
                    {!clickedBtn ?
                    <button
                    id='submit'
                    
                    className='  w-full p-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300'
                >
                    Create Account
                </button>

                :
                <div className=" flex items-center justify-center w-full p-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300">
                    <Loader></Loader>
                </div>
                
                
                
                }
                    
                </div>
                <div className="text-center">
                    <Link to='/login' className='text-blue-400 hover:underline'>
                        Go to Login
                    </Link>
                </div>
                {popup.visible && (
                    <div className={`${isRegistered ? 'bg-green-700 text-white ':'bg-red-700 text-white '} ml-14 text-xl message max-w-md py-2 px-3 rounded-b-xl m-3   rounded-l-xl absolute -top-24 left-10`}>
                        {popup.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Register;
