import React from "react";
import login_img from "../../assets/login_img.jpg";
import Form from "./Form";

const LoginPage = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="lg:w-1/2 w-full">
          <div className="flex border border-purple-600">
            <h2 className="py-3 pl-2 md:text-3xl text-xl font-semibold md:mr-5 mr-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              ConnectWave
            </h2>
            <p className="font-medium opacity-95 md:mt-5 mt-2 md:ml-8 ml-2">
              It helps you to connect and share with the people in your life
            </p>
          </div>
          <div className="relative">
            <img src={login_img} className="w-full md:h-[650px] lg:w-[100rem] md:w-[70rem]" alt="Login" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <p className="md:text-3xl lg:text-xl text-lg font-semibold">
                  Let’s see what’s happening to you and your world. Welcome to ConnectWave.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Form />
      </div>
    </>
  );
};

export default LoginPage;
