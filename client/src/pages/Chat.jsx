import React, { useState, useEffect, useRef } from 'react';
import 'boxicons';
import { io } from 'socket.io-client';
import axios from 'axios';
import { getFriend, getSpecificUserData, host, postUserAndFriednData, isUserExistOrNotApi, addFriendApi, deleteFriendApi } from '../utils/ApiRoutes';
import ChatBox from './ChatBox';
import User from '../components/User';
import { useNavigate } from 'react-router-dom';
import exampleImage from '../assets/MaxioIcon.png'; // Import your image
import Loader from '../components/loader/Loader';


const Chat = () => {
  const navigate = useNavigate();
  const [clickedBtn, setClickedBtn] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [rightbarVisible, setRightbarVisible] = useState(false);
  const [inPhoneMode, setInPhoneMode] = useState(false)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useRef(null);
  const [friendUsername,setFriendUsername] = useState('')
  const [toUser, setToUser] = useState('');
  const [from, setFrom] = useState('');
  const [selectTosender, setSelectToSender] = useState(false);
  const [allFriends, setAllFriends] = useState([]);
  const [confirmLogOut, setConfirmLogOut] = useState(false);
  const [isShowProfile, setIsShowProfile] = useState(false);
  const [isSelectedAddFriend, setAsSelectedAddFriend] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  const [popup, setPopup] = useState({
    visible: false,
    message: ''
  });

  const [selectedUserIndex, setSelectedUserIndex] = useState(null); // Add this line

  const handleSetUser = (friendUserName, index) => { // Modify this function
    setToUser(friendUserName);
    setSelectToSender(true);
    setSidebarVisible(false);
    setRightbarVisible(true)
    setSelectedUserIndex(index); // Add this line
    fetchData(from, friendUserName);

    if (!rightbarVisible) {
      setSidebarVisible(false);
      setRightbarVisible(true)
    } else {
      setSidebarVisible(true);
    }
  };

  function handleSidebarAndRightbar(e) {
    setSidebarVisible(true);
    setRightbarVisible(false)
    e.stopPropagation()

  }
  function showPopup(message) {
    setPopup({
      visible: true,
      message: message,

    });

    setTimeout(() => {
      setPopup({
        visible: false,
        message: ''
      });
    }, 2000);
  }


  function minnimizeAllabsoluteDialogue() {
    if (isShowProfile != false) {

      setIsShowProfile(false)
    }

    if (isAddFriendOpen != false) {
      setIsAddFriendOpen(false)
      setAsSelectedAddFriend(false)
      setFriendUsername('');
    }


  }

  function handleCreateFriend(e) {
    //  e.stopPropagation()
    setIsAddFriendOpen(true)
    setAsSelectedAddFriend(true)

  }
  function handleLogOut() {
    localStorage.removeItem('chat-app-user');
    navigate('/login');
  }

  const fetchData = async (username, friendUserName) => {
    try {
      const { data } = await axios.get(getSpecificUserData, {
        params: { username, friendUserName }
      });
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };


  async function deleteFriend(username, friendUserName) {
    try {
      const { data } = await axios.delete(deleteFriendApi, {
        params: { username, friendUserName }
      });
      if (data) {

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }


  async function handleArchiveDeleteCleanChat(friendUserName, Option) {

    if (Option == 'delete') {
      const deletedUserOrNot = await deleteFriend(from, friendUserName);
      if (deletedUserOrNot) {
        console.log("Deleted successfully")
        fetchFriends()
        return {status:true,message:'Deleted successfully'};
      } else {
        return {status:false,message:'Not Deleted successfully'};;
        console.log("Not Deleted successfully")
      }
    }



  }

  async function addFriend(fromUserName, friendUserNme) {
    try {

      const { data } = await axios.post(addFriendApi, {
        username: fromUserName,
        friendUserName: friendUserNme,
        chat: { text: 's', self: true }
      });
      if (data) {
        console.log(data);
        setFriendUsername('');
        return true;
      } else {
        console.log();
        return false;
      }
    } catch (error) {
      console.log('Failed to update friend username.');
    }
  }

  async function isUserExistOrNot(username) {
    try {
      const { data } = await axios.get(isUserExistOrNotApi, {
        params: { username }
      });
      if (data.exist) {
        console.log('Username exists');
        return true;
      } else {
        setClickedBtn(true)
        console.log('Username does not exist');
        return false;
      }
    } catch (error) {
      setClickedBtn(false)
      console.log('Failed to check if username exists.', error);
      return false;
    }
  }

  async function handleAddFriend() {
    setClickedBtn(true)
    const username = friendUsername;
    if (!username) {
      setTimeout(() => {
        showPopup('Enter a username.');
        setClickedBtn(false)
      }, 100);
      return;
    }

    const userExists = await isUserExistOrNot(username);
    if (userExists) {
      if (from == username) {

        setTimeout(() => {
          setClickedBtn(false)
          showPopup("Own can't add")
        }, 100);
        return false;
      }
      const added = await addFriend(from, username);
      if (added) {

        setTimeout(() => {
          setClickedBtn(false)
          showPopup('Friend added successfully!');
        }, 100);
        setIsAddFriendOpen(false)

        setAsSelectedAddFriend(false);
      } else {
        setClickedBtn(false)
        showPopup('Failed to add friend.');
      }
    } else {
      setClickedBtn(false)
      showPopup('User does not exist.');
    }
  }

  useEffect(() => {
    const username = JSON.parse(localStorage.getItem('chat-app-user'));
    setFrom(username);

    socket.current = io(host);

    if (username) {
      socket.current.emit('new-user-joined', username);
    }

    socket.current.on('connect', () => {
      console.log('Connected to server');
    });

    socket.current.on('private_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, { text: message.text, self: false }]);
      postMessage(message.to, message.from, { text: message.text, self: false });

    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  async function fetchFriends() {
    try {
      const { data } = await axios.get(getFriend, {
        params: { username: from }
      });
      setAllFriends(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    if (from) fetchFriends();
    if (isSelectedAddFriend) fetchFriends();
  }, [from, isSelectedAddFriend]);

  async function postMessage(fromUserName, toUserName, inputText) {
    try {
      const { data } = await axios.post(postUserAndFriednData, {
        username: fromUserName,
        friendUserName: toUserName,
        chat: inputText
      });
      if (data) {
        console.log('Data added successfully');
      }
    } catch (error) {
      console.log('Failed to update data.');
    }
  }

  const sendMessage = () => {
    if (input.trim() && toUser) {
      const message = {
        text: input,
        toUser: toUser,
        from: from,
      };
      socket.current.emit('private_message', message);
      setMessages((prevMessages) => [...prevMessages, { text: message.text, self: true }]);
      postMessage(from, toUser, { text: message.text, self: true });
      setInput('');
    }
  };




  const printHiddenSidebar = () => {
    console.log('Sidebar hidden!');
  };

  // Check window width on initial render and resize
  useEffect(() => {
    const handleResize = () => {

      if (window.innerWidth > 750 && window.innerWidth < 800) {
        if (window.innerWidth < 800) {
          setSidebarVisible(true);
          setRightbarVisible(false)
          setInPhoneMode(true)

        } else {
          setSidebarVisible(true);
          setRightbarVisible(true);
          setInPhoneMode(false)
        }
      } else if (window.innerWidth > 800) {
        setSidebarVisible(true);
        setRightbarVisible(true);
        setInPhoneMode(false)
      }

    };

    function phoneMode() {
      if (window.innerWidth <= 800) {
        setInPhoneMode(true)
        setSidebarVisible(true);
        setRightbarVisible(false);
      }
    }
    phoneMode()

    // Listen to resize events
    window.addEventListener('resize', handleResize);
    handleResize()

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      phoneMode()
    };
  }, []); // Empty dependency array ensures this effect runs only on mount and unmount



  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current - touchEndX.current > 50) {
        onSwipeLeft();
      }
    };

    const onSwipeLeft = () => {
      console.log('Left swipe detected');
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    // Clean up the event listeners on component unmount
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);



  return (
    <div onClick={() => minnimizeAllabsoluteDialogue()} className={` ${inPhoneMode ? 'pt-10' : 'pl-11 pt-10'} chatWrapper h-screen w-screen bg-gray-800`}>

      <h1 className="logo absolute top-1 left-2 font-bold text-white text-2xl flex items-center justify-between cursor-pointer"   > <button onClick={(e) => handleSidebarAndRightbar(e)} className={`${!rightbarVisible || sidebarVisible ? 'hidden' : ''}  z-30 transition-all hover:bg-[#1c212c] p-[3px]  px-1 mr-1 flex items-center justify-center rounded`}><box-icon name='arrow-back' color="white"  ></box-icon></button><img className='h-5 mr-1' src={exampleImage} alt="" />Maxor</h1>
      <div className={` ${inPhoneMode ? ' right-4 top-1' : ' bottom-3 left-1 '} profile absolute z-10`}>
        <button className='text-white text-2xl' onClick={() => setIsShowProfile(prev => !prev)}>⚛️</button>
        {isShowProfile && <div onClick={(e) => e.stopPropagation()} className={` ${inPhoneMode ? '-left-36 top-1' : 'bottom-8 left-8'} profileDisplay rounded border border-gray-900 flex-col h-32 w-32 items-center bg-gray-800 absolute `}>
          <div className="profileLogo flex items-center justify-center mt-2">
            <span className='text-2xl'>☯️</span>
          </div>
          <h1 className='flex items-center justify-center mt-2 text-gray-300'>{from}</h1>
          <button className='flex items-center justify-center w-16 rounded p-1 m-auto mt-2 text-gray-300 font-bold bg-[#1c212c] cursor-pointer' onClick={handleLogOut}>Logout</button>
        </div>}
      </div>
      <div className="chatContainer border border-gray-800 h-full rounded-md bg-[#1c212c] flex flex-col custom-scrollbar">
        <div className="usersAndChatBox h-full flex justify-between items-center">
          <div className={`${!sidebarVisible ? 'hidden ' : ''} ${!rightbarVisible ? ' w-full ' : ' w-1/2 '} users border-r border-gray-800 h-full flex flex-col relative`}>
            <div className="chatsAndCreateNew m-2 top-0 relative">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2 relative">
                <span className="text-white">Chats</span>
                <button className={`${isSelectedAddFriend ? ' bg-slate-600 ' : ''} transition-all text-gray-400 border border-gray-400 rounded-md p-1`} onClick={(e) => handleCreateFriend(e)}>New</button>
                {isAddFriendOpen && <div onClick={(e) => e.stopPropagation()} className={` ${isSelectedAddFriend ? 'transition-all ' : ''}  ${!rightbarVisible ? ' top-6 right-14' : 'top-5 -right-48 '} addFriend z-10  border-gray-900 flex-col pt-5 h-36 rounded-md w-44 items-center bg-gray-800 absolute `}>
                  <div className='flex items-center justify-center text-gray-300 p-2'>
                    <input value={friendUsername} type="text" placeholder="Enter username" className="searchBar w-full p-2 rounded-md bg-gray-800 border outline-none border-gray-500 text-gray-400" onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()} onChange={(e) => setFriendUsername(e.target.value.toLowerCase().trim(' '))} />
                  </div>
                  {!clickedBtn ?
                    <button className='flex items-center justify-center w-16 rounded p-1 m-auto mt-2 text-gray-300 font-bold bg-[#1c212c] cursor-pointer' onClick={
                      () => handleAddFriend()}>Add</button>
                    :
                    <div className="flex items-center justify-center w-16 rounded p-1 m-auto mt-2 text-gray-300 font-bold bg-[#1c212c] cursor-pointer">
                      <Loader></Loader>
                    </div>

                  }



                </div>

                }


                {popup.visible && (
                  <div className={` ${!rightbarVisible ? 'right-24 -top-4 ' : ' bottom-0 -right-96 '}popup-message bg-gray-900 text-gray-400 p-1 rounded-2xl mt-4 absolute  w-44 top-1 h-12 text-center h flex items-center justify-center z-20  border border-gray-800 `}>
                    {popup.message}
                  </div>
                )}

              </div>
              <input type="text" name="" id="" placeholder="Search" className="searchBar w-full p-2 rounded-md bg-gray-800 outline-none text-gray-400" />
            </div>
            <div className="transition-all friends overflow-hidden hover:overflow-y-auto p-1 custom-scrollbarForUsers">
              {allFriends.map((friend, index) => (
                <User
                  key={index}
                  handleArchiveDeleteCleanChat={handleArchiveDeleteCleanChat}
                  index={index}
                  handleSetUser={handleSetUser}
                  friend={friend}
                  selected={selectedUserIndex === index} // Add this line
                />
              ))}
            </div>


          </div>


          {selectTosender ? <ChatBox
            messages={messages}
            input={input}
            rightbarVisible={rightbarVisible}
            setInput={setInput}
            sendMessage={sendMessage}
            whFull={'w-full h-full'}
            toUser={toUser}
          /> : <div className={`${!rightbarVisible ? 'hidden' : ''} chats h-full w-full flex items-center justify-center text-white text-2xl`}>
            ChatBox
          </div>}

        </div>
      </div>
    </div>
  );
};

export default Chat;
