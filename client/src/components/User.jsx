import React, { useEffect, useState } from 'react';
import 'boxicons';
import Loader from './loader/Loader';
const User = ({ handleSetUser, index, friend, selected, handleArchiveDeleteCleanChat }) => {
  const [archiveDeleteCleanChat, setArchiveDeleteCleanChat] = useState(false);
  const [clickedBtn, setClickedBtn] = useState(false)

  const handleClick = () => {
    handleSetUser(friend, index);
    localStorage.setItem('selected-user',friend)
  };


  const handleArchiveDeleteCleanChatClick = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling up to parent elements
    setArchiveDeleteCleanChat(!archiveDeleteCleanChat);
  };

  const handleOptionClick = async (option) => {
    setClickedBtn(true)
    const data = await handleArchiveDeleteCleanChat(friend, option);
    if (data.status) {
      setClickedBtn(false)
      setArchiveDeleteCleanChat(!archiveDeleteCleanChat); // Close the popup after an option is selected
    }
  };

  return (
    <div className={`user h-16 mb-1 w-full flex items-center hover:bg-gray-800 pl-5 border-gray-800 text-white rounded-md cursor-pointer ${selected ? 'bg-gray-800 transition-all' : ''}`}>
      <button onClick={handleClick}
        className="w-full text-left flex justify-items-start items-center relative"
      >
        <span className="flex items-center justify-center h-10 w-10 rounded-full border mr-2 bg-[#1c212d]">
          <box-icon type='solid' name='user-circle' color="white" size='md'></box-icon>
        </span>
        {friend}
        <div onClick={handleArchiveDeleteCleanChatClick} className="archiveDeleteClearData flex items-center justify-center absolute right-0 py-4 px-4 mr-1 rounded-md transition-all hover:bg-[#1c212d]">
          <box-icon name='dots-horizontal-rounded' color="white"></box-icon>
        </div>

        {archiveDeleteCleanChat ?
          <div onClick={e => e.stopPropagation()} className="popup z-30 transition-all right-16 -top-14 addFriend shadow-slate-700 flex flex-col rounded-md w-auto items-center bg-red-900 absolute mt-10 px-2 py-1 ">
            {!clickedBtn ?
              <div className='select-none flex items-center justify-center  text-gray-300 font-bold hover:bg-red-900 cursor-pointer w-full mb-1' onClick={() => handleOptionClick('delete')}>Delete</div>
              :
              <div className="  select-none flex items-center justify-center  text-gray-300 font-bold w-full mb-1 mx-2"><Loader/></div>
            }

          </div>
          : ''

        }
      </button>
    </div>
  );
};

export default User;
