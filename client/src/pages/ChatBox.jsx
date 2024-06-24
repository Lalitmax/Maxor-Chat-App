import React, { useEffect, useRef, useState } from 'react';
import 'boxicons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import exampleImage from '../assets/MaxioIcon.png'; // Import your image

const ChatBox = ({ messages, input, setInput, rightbarVisible, sendMessage, whFull, toUser, hideEmojiPicker, handleSidebarAndRightbar, selectTosender }) => {
  const messageEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fromUserName = JSON.parse(localStorage.getItem('chat-app-user'));
  const [isInPhoneMode, setInPhoneMode] = useState(false)
  function hideEmojiPicker() {
    setShowEmojiPicker(false)
  }
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addEmoji = (emoji) => {
    setInput((prevInput) => prevInput + emoji.native);
  };

  function phoneMode() {

    handleSidebarAndRightbar()


  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) {

        setInPhoneMode(true)

      }else{
        setInPhoneMode(false)
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize()

  }, [toUser])

  return (
    <div onClick={() => hideEmojiPicker()} className={`${!rightbarVisible ? 'hidden' : ''} chatBox rounded-md flex flex-col relative ${whFull}`}>
      <button onClick={() => phoneMode()} className={`${!isInPhoneMode ? 'hidden' : ''} absolute top-3 left-3 hover:bg-gray-800 z-30 transition-all  p-[3px]  px-1 mr-1 flex items-center justify-center rounded`}><box-icon name='arrow-back' color="white"  ></box-icon></button>

      <div className="displayUserName text-white p-2 border-b border-gray-800 flex items-center justify-center w-full">
        <span className="flex items-center justify-center h-10 w-10 rounded-full border mr-2 bg-[#1c212d]">
          <box-icon type="solid" name="user-circle" color="white" size="md"></box-icon>
        </span>
        <span className="text-xl">{toUser}</span>
      </div>
      <div className="messages flex-1 overflow-y-scroll custom-scrollbar pl-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={` ml-14 relative message max-w-sm p-2 rounded-b-xl m-3 clear-both ${msg.self ? 'float-right bg-gray-700 text-white rounded-l-xl' : 'rounded-r-xl text-white ml-10 float-left bg-gray-800'}`}
            ref={messageEndRef}
            style={{ wordBreak: 'break-word' }} // Ensure long words break appropriately
          >
            <div className="chaterLogo absolute -left-10">
              <box-icon type="solid" name="user-circle" color="white" size="md"></box-icon>
            </div>
            {msg.text}
          </div>
        ))}


        <div ref={messageEndRef} />
      </div>
      <div className="sendMessage flex-none w-full flex p-2 border-t border-gray-800 bg-gray-800 relative">

        <button
          className=" text-gray-200 rounded-full h-10  w-12 flex items-center justify-center mr-2"
          onClick={(e) => { setShowEmojiPicker(!showEmojiPicker); e.stopPropagation() }}
        >
          <box-icon name='smile' color="white"></box-icon>
        </button>


        <input
          type="text"
          className="w-full h-10 rounded-full p-4 bg-gray-700 outline-none text-gray-200"
          placeholder="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="bg-green-500 text-black rounded-2xl ml-2 px-4" onClick={sendMessage}>
          Send
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-14 right-2">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
