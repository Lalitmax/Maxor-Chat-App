import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginRoute } from '../utils/ApiRoutes';
import Loader from '../components/loader/Loader';

const Login = () => {
    const [clickedBtn, setClickedBtn] = useState(false)

    const passwordRef = useRef();
    const [username, setUserName] = useState('');

    const navigate = useNavigate();
    const [isLoged, setIsLoged] = useState(false)


    const [values, setValues] = useState({
        username: "",
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

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(234)
        setClickedBtn(true)
        const newValues = {
            username: username,
            password: passwordRef.current.value
        };
        if (newValues.username.length == 0) {
            setTimeout(() => {
                showPopup('Enter username')
                setClickedBtn(false)
            }, 100);
            return;
        } else if (newValues.password.length == 0) {
            setTimeout(() => {
                showPopup('Enter password')
                setClickedBtn(false)
            }, 100);
            return;
        }
        setValues(newValues);
        await loginUser(newValues);
    }

    async function loginUser(values) {
        const { username, password } = values;
        try {
            const { data } = await axios.post(loginRoute, {
                username,
                password
            });

            if (data.error) {
                setClickedBtn(false)
                showPopup(data.error);
            } else {
                setIsLoged(!isLoged)
                setClickedBtn(false)
                showPopup(data.message);
                localStorage.setItem('chat-app-user', JSON.stringify(username));
                setTimeout(() => {
                    navigate('/');

                }, 1000);
            }
        } catch (error) {
            setClickedBtn(false)
            showPopup('Login failed. Please check your credentials.');
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
            <form className=' relative border shadow border-gray-700 shadow-slate-800 w-full max-w-md p-8  rounded-xl'>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Join</h2>
                <div className="mb-4">
                    <input
                        value={username}
                        type="text"
                        name='username'
                        placeholder='Username'
                        className='w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setUserName(e.target.value.toLowerCase().trim(' '))}
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
                            onClick={handleSubmit}
                            className='  w-full p-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300'
                        >
                            Join Chat
                        </button>

                        :
                        <div className=" flex items-center justify-center w-full p-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300">
                            <Loader></Loader>
                        </div>



                    }
                </div>
                <div className="text-center">
                    <Link to='/register' className='text-blue-400 hover:underline'>
                        Go to Register
                    </Link>
                </div>
                {popup.visible && (
                    <div className={`${isLoged ? 'bg-green-700 text-white ' : 'bg-red-700 text-white '} ml-14 text-xl message max-w-md py-2 px-3 rounded-b-xl m-3   rounded-l-xl absolute -top-24 left-10`}>
                        {popup.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Login;
