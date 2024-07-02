import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import app from '../utils/firebase';

function ImageUploader() {
    const [isUploading, setIsUploading] = useState(false);
    const [gotImageUrl, setGotImageUrl] = useState('');

    const handleImageChange = async (e) => {
        const image = e.target.files[0];
 
        if (image) {
            setIsUploading(true);
            try {
                const storage = getStorage(app);
                const storageRef = ref(storage, "images/" + image.name);
                await uploadBytes(storageRef, image);
                const downloadURL = await getDownloadURL(storageRef);
                setGotImageUrl(downloadURL);
                console.log(downloadURL);
            } catch (error) {
                console.error("Error uploading image: ", error);
            } finally {
                setIsUploading(false);
            }
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
                {gotImageUrl && (
                    <div className="publicImgUrl text-center">
                        <p>Public URL:</p>
                        <a href={gotImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            {gotImageUrl}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUploader;
