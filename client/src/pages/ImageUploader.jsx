import { useState } from 'react';
// import {getStorage} from '../utils/firebase'
function ImageUploader() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [gotImageUrl,setGotImageUrl] = useState('')

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            setIsUploading(true);
            // Simulate an upload process
            const storage = getStorage
            setTimeout(() => {
                setUploadedImage(URL.createObjectURL(file));
                setIsUploading(false);
            }, 2000); // Simulate a 2 second upload time
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Upload Image</h1>
                <input 
                    type="file" 
                    onChange={handleImageChange} 
                    className="block w-full text-sm text-gray-500 
                    file:mr-4 file:py-2 file:px-4 
                    file:rounded-full file:border-0 
                    file:text-sm file:font-semibold 
                    file:bg-indigo-50 file:text-indigo-700 
                    hover:file:bg-indigo-100 mb-4"
                />
                {isUploading && <p className="text-blue-500 text-center">Uploading...</p>}
             
                {gotImageUrl.length>1 && <div className="publicImgUrl">public Url : {}</div>} 
            </div>
        </div>
    );
}

export default ImageUploader;
