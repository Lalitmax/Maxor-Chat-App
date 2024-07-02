import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { registerRoute } from '../utils/ApiRoutes';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/loader/Loader';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import app from '../utils/firebase';
import Logo from '../assets/MaxioIcon.png'; // Import your image

const Register = () => {
    const nameRef = useRef();
    const [username, setUserName] = useState('');
    const [isRegistered, setisRegistered] = useState(false);
    const passwordRef = useRef();
    const [clickedBtn, setClickedBtn] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [localImageUrl, setLocalImageUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate();
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageUrl(file);
        setLocalImageUrl(URL.createObjectURL(file));
        setFileName(file.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setClickedBtn(true);

        let imageDownloadURL = '';
        if (imageUrl) {
            try {
                const storage = getStorage(app);
                const storageRef = ref(storage, "images/" + imageUrl.name);
                await uploadBytes(storageRef, imageUrl);
                imageDownloadURL = await getDownloadURL(storageRef);
            } catch (error) {
                console.error("Error uploading image: ", error);
                setClickedBtn(false);
                showPopup('Error uploading image.');
                return;
            }
        }

        const newValues = {
            username: username,
            name: nameRef.current.value,
            password: passwordRef.current.value,
            profileImage: imageDownloadURL
        };

        if (validation(newValues)) {
            registerUser(newValues);
        }
    };

    const validation = (values) => {
        const { username, name, password, profileImage } = values;
        if (username.length <= 3 || name.length <= 5 || password.length <= 3) {
            setClickedBtn(false);
            showPopup('Username > 3, Name > 5, Password > 3');
            return false;
        }
        if (!profileImage) {
            setClickedBtn(false);
            showPopup('Choose Profile Image');
            return false;
        }
        return true;
    };

    const registerUser = async (values) => {
        try {
            const { data } = await axios.post(registerRoute, values);
            if (data.message === 'User already exists') {
                setClickedBtn(false);
                showPopup(data.message);
            } else if (data.message === 'User registered successfully') {
                console.log('Registration successful');
                setisRegistered(true);
                showPopup(data.message);
                setClickedBtn(false);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setClickedBtn(false);
            showPopup('Registration failed. Please check your inputs.');
        }
    };

    const showPopup = (message) => {
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
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-900 p-4'>
            <form onSubmit={handleSubmit} className='border shadow border-gray-700 shadow-slate-800 w-full max-w-md p-8 rounded-xl relative'>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
                <div className="profileImage w-full mb-6 flex items-center justify-center">
                    <img className='rounded-full h-20 w-20 object-cover' src={localImageUrl || Logo} alt="Profile Preview" />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        name='username'
                        value={username}
                        placeholder='Username'
                        className='w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setUserName(e.target.value.toLowerCase().trim())}
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
                <div className="ImageSelecter w-full mb-6 flex items-center justify-center flex-col">
                    <label className=' from-rose-400 via-fuchsia-500 to-indigo-500 bg-gradient-to-r text-white max-w-32 py-2 pr-3 pl-2 rounded-md cursor-pointer hover:bg-purple-800 transition duration-300 '>
                        {fileName ? (fileName.length > 12 ? `${fileName.substring(0, 12)}...` : fileName) : "Profile Image"}
                        <input onChange={handleImageChange} className='hidden' type="file" />
                    </label>
                </div>

                <div className="mb-4">
                    {!clickedBtn ?
                        <button className='w-full p-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300'>
                            Create Account
                        </button>
                        :
                        <div className="flex items-center justify-center w-full p-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300">
                            <Loader />
                        </div>
                    }
                </div>
                <div className="text-center">
                    <Link to='/login' className='text-blue-400 hover:underline'>
                        Go to Login
                    </Link>
                </div>
                {popup.visible && (
                    <div className={`${isRegistered ? 'bg-green-700 text-white ' : 'bg-red-700 text-white '} ml-14 text-xl message max-w-md py-2 px-3 rounded-b-xl m-3 rounded-l-xl absolute -top-24 left-10`}>
                        {popup.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Register;
