import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import { setLogin } from "../../state";
import { edit } from "../../icons/icon";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.mixed().required("Picture is required"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: null,
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    //this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("https://connectwave-backend.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (!isLogin) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <>
          <div className="lg:ml-8 mt-8 lg:mt-0 lg:w-1/2 w-full">
            <div className="flex items-center justify-center py-3 w-full mr-0 bg-gradient-to-r from-purple-600 to-pink-500">
              <h2 className="md:text-3xl text-2xl font-semibold text-white">
                {isLogin ? "Login" : "Register"}
              </h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-[87%] lg:mt-28 mt-10 mx-[7%] shadow-2xl pb-10"
            >
              <p className="md:text-xl text-base py-3 px-4 font-semibold text-white flex justify-center items-center bg-gradient-to-r from-purple-600 to-pink-500">
                Welcome to ConnectWave
              </p>
              {/* First Name and Last Name (Only in Registration) */}
              {!isLogin && (
                <div className="flex flex-wrap justify-between">
                  <div className="w-[31%] ml-[18%]">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full mt-4 appearance-none outline-none border-b-2 border-gray-300 py-2 text-gray-700 placeholder-gray-500"
                    />
                    {touched.firstName && errors.firstName && (
                      <div className="text-red-600">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="w-[31%] mr-[16%]">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full mt-4 appearance-none outline-none border-b-2 border-gray-300 py-2 text-gray-700 placeholder-gray-500"
                    />
                    {touched.lastName && errors.lastName && (
                      <div className="text-red-600">{errors.lastName}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Location and Occupation (Only in Registration) */}
              {!isLogin && (
                <>
                  <div>
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={values.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="md:w-8/12 w-[72%] md:mx-[18%] mx-[14%] mt-4 appearance-none outline-none border-b-2 border-gray-300 py-2 text-gray-700 placeholder-gray-500"
                    />
                    {touched.location && errors.location && (
                      <div className="text-red-600">{errors.location}</div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="occupation"
                      placeholder="Occupation"
                      value={values.occupation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="md:w-8/12 w-[72%] md:mx-[18%] mx-[14%] mt-4 appearance-none outline-none border-b-2 border-gray-300 py-2 text-gray-700 placeholder-gray-500"
                    />
                    {touched.occupation && errors.occupation && (
                      <div className="text-red-600">{errors.occupation}</div>
                    )}
                  </div>
                  {/* Picture (Only in Registration) */}
                
                  <Dropzone
                    accept={{
                      "image/jpeg": [],
                      "image/png": [],
                      "image/jpg": [],
                    }}
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className="flex flex-col md:w-8/12 w-[72%] md:mx-[18%] mx-[14%] mt-4 border-2 border-gray-400 border-dashed p-4 hover:cursor-pointer"
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p className="text-gray-500">Add Picture Here</p>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>{values.picture.name}</div>
                            <i>{edit}</i>
                          </div>
                        )}
                      </div>
                    )}
                  </Dropzone>
                  {touched.picture && errors.picture && (
                    <div className="text-red-600">{errors.picture}</div>
                  )}
                </>
              )}

              {/* Common Fields */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="md:w-8/12 w-[72%] md:mx-[18%] mx-[14%] mt-4 appearance-none outline-none border-b-2 border-gray-300 py-2 text-gray-700 placeholder-gray-500"
                />
                {touched.email && errors.email && (
                  <div className="text-red-600 ml-28">{errors.email}</div>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="md:w-8/12 w-[72%] md:mx-[18%] mx-[14%] mt-4 appearance-none outline-none border-b-2 border-gray-300 py-2 text-gray-700 placeholder-gray-500"
                />
                {touched.password && errors.password && (
                  <div className="text-red-600 ml-28">{errors.password}</div>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="md:mx-[18%] mx-[14%] mb-8 mt-6 md:w-8/12 w-[72%] py-2 md:text-xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:text-black"
              >
                {isLogin ? "Login" : "Register"}
              </button>
              <br />

              {/* Toggle Login/Register */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                className="md:mx-[18%] ml-[8%] underline underline-offset-1 text-purple-500"
              >
                {isLogin
                  ? "Don't have an account? Sign Up here"
                  : "Already have an account? Login here"}
              </a>
            </form>
          </div>
        </>
      )}
    </Formik>
  );
};

export default Form;
