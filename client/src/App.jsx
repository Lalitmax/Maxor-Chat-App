import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import PrivateRoute from './components/PrivateRoute';
import ChatBox from './pages/ChatBox';
import ImageUploader from './pages/ImageUploader';

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/imageuploader' element={<ImageUploader/>} />
                    <Route path='/' element={
                        <PrivateRoute>
                           
                            <Chat />
                        </PrivateRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </>
    );
}
