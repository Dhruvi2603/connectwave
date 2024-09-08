import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setMode, setLogout } from '../../state/index';
import {
  search, light, chat, notification, question, downarrow, squaredropdown, dark
} from '../../icons/icon';

const Navbar = ({ conversationId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  const toggleMode = () => {
    dispatch(setMode());
  };

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prevState) => !prevState);
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };

  

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`flex justify-between items-center lg:pl-[70px] pl-2 py-3 ${mode === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
      <div className="flex items-center">
        <h2 className={`lg:text-3xl font-rubik md:text-2xl text-lg font-bold md:mr-5 mr-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent hover:cursor-pointer font ${isActive('/home') ? 'text-purple-600' : ''}`} onClick={() => navigate("/home")}>
          ConnectWave
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="md:px-8 px-2 py-1 w-[90%] rounded bg-gray-200 border-none focus:outline-none"
          />
          <i className="absolute top-1/2 right-8 transform -translate-y-1/2 hover:cursor-pointer">{search}</i>
        </div>
      </div>
      <div className="flex items-center lg:mr-[50px] md:mr-3">
        <i className={`mr-10 lg:mr-6 md:mr-5 ${isActive('/mode') ? 'text-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent'} hidden sm:inline hover:cursor-pointer`} onClick={toggleMode}>
          {mode === 'light' ? light : dark}
        </i>
        <i className={`mr-10 lg:mr-6 md:mr-5 ${isActive(`/chat/${conversationId}`) ? 'text-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent'} hidden sm:inline hover:cursor-pointer`} onClick={() => navigate("/chat")} >{chat}</i>
        <i className={`mr-10 lg:mr-6 md:mr-5 ${isActive('/notification') ? 'text-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent'} hidden sm:inline hover:cursor-pointer`}>{notification}</i>
        <i className={`mr-10 lg:mr-6 md:mr-5 ${isActive('/question') ? 'text-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent'} hidden sm:inline hover:cursor-pointer`}>{question}</i>
        <div className={`relative hidden sm:inline ${mode === 'light' ? 'text-black' : 'text-black'}`}>
          <input
            type="text"
            placeholder="Name"
            value={fullName}
            readOnly
            className="px-8 py-1 w-[150px] bg-gray-200 border-none rounded focus:outline-none font-rubik font-500 hover:cursor-pointer"
            onClick={toggleUserMenu}
          />
          <i className="absolute top-1/2 right-2 transform -translate-y-1/2 hover:cursor-pointer " onClick={toggleUserMenu}>{downarrow}</i>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <div className="p-2">
                <p className="cursor-pointer hover:bg-gray-200 p-2 rounded font-rubik font-500 hover:cursor-pointer" onClick={handleLogout}>Log Out</p>
              </div>
            </div>
          )}
        </div>
        <i className="md:hidden ml-7 mr-2 text-2xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent hover:cursor-pointer" onClick={toggleDropdown}>{squaredropdown}</i>
      </div>
      {showDropdown && (
        <div className="absolute top-12 right-2 mt-2 w-48 bg-white rounded-lg shadow-lg md:hidden">
          <div className="flex flex-col items-start p-2">
            <i className={`bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 hover:cursor-pointer ${isActive('/mode') ? 'text-purple-500' : ''}`} onClick={toggleMode}>{mode === 'light' ? light : dark}</i>
            <i className={`bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 hover:cursor-pointer ${isActive('/chat') ? 'text-purple-500' : ''}`} onClick={() => navigate("/chat")}>{chat}</i>
            <i className={`bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 hover:cursor-pointer ${isActive('/notification') ? 'text-purple-500' : ''}`}>{notification}</i>
            <i className={`bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 hover:cursor-pointer ${isActive('/question') ? 'text-purple-500' : ''}`}>{question}</i>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Name"
                value={fullName}
                readOnly
                className="px-8 py-1 w-full bg-gray-200 border-none rounded focus:outline-none font-rubik font-500 hover:cursor-pointer"
                onClick={toggleUserMenu}
              />
              <i className="absolute top-1/2 right-2 transform -translate-y-1/2 hover:cursor-pointer" onClick={toggleUserMenu}>{downarrow}</i>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                  <div className="p-2">
                    <p className="cursor-pointer hover:bg-gray-200 p-2 rounded font-rubik font-500 hover:cursor-pointer" onClick={handleLogout}>Log Out</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
