import React, { useState } from "react";
import Dropzone from "react-dropzone";
import UserImage from "../../components/useImage/UserImage";
import { useDispatch, useSelector } from "react-redux";
import state, { setPosts } from "../../state";
import { attatchment, audio, clipIcon, deleteIcon, edit, imageIcon, threeDot } from "../../icons/icon";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState("");
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);

  const handlePost = async () => {
     if (isSubmitting) return; 
    setIsSubmitting(true);
    console.log("Post function called");
    
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
  
    console.log("FormData content:", formData);
  
    try {
      const response = await fetch(`https://connectwave-backend.onrender.com/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posts = await response.json();

      dispatch(setPosts({ posts }));
      setImage(null);
      setPost("");
    } catch (error) {
      console.error("Error posting:", error);
    }finally {
      setIsSubmitting(false); // Reset loading state after submission
    }
  };
  
  return (
    <div className={`lg:p-6 p-3 pb-3.5 rounded-lg ${mode === 'light' ? 'bg-white' : 'bg-slate-700 text-white'}`}>
      <div className="flex items-center justify-between lg:gap-6 gap-3">
        <UserImage image={picturePath} />
        <input
          type="text"
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          className="w-full bg-gray-200 placeholder:text-gray-500 rounded-[2rem] py-4 px-8"
        />
      </div>
      {isImage && (
        <div className=" rounded-md border border-solid mt-4 p-2 border-gray-800 ">
          <Dropzone
            accept={{
              "image/jpeg": [],
              "image/png": [],
              "image/jpg": [],
            }}
            multiple={false}
            onDrop={(acceptedFiles) =>
              setImage(acceptedFiles[0])
            }
          >
            {({ getRootProps, getInputProps }) => (
              <div className="flex items-center justify-between">
              <div
                {...getRootProps()}
                className="flex flex-col w-full md:mx-[3%] mx-[14%] my-4 border-2 border-gray-400 border-dashed px-2 py-6 hover:cursor-pointer"
              >
                <input {...getInputProps()} />
                {!image ? (
                  <p className="text-gray-500">Add Image Here</p>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>{image.name}</div>
                    <i>{edit}</i>
                  </div>
                )}
              </div>
              {image && (
                <i onClick={() => setImage(null)} className="w-[15%]">{deleteIcon}</i>
              )}
              </div>
            )}
          </Dropzone>
        </div>
      )}
      <hr className="my-5 mx-0 border-gray-400"/>

      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-1" onClick={() => setIsImage(!isImage)}>
          <i>{imageIcon}</i>
          <p className="hover:cursor-pointer">
            Image
          </p>
        </div>
        
        
        <div className="hover:cursor-pointer items-center justify-between gap-1 hidden  xl:flex">
          <i>{clipIcon}</i>
          <p>Clip</p>
        </div>

        <div className="hover:cursor-pointer items-center justify-between gap-1 hidden xl:flex">
          <i>{attatchment}</i>
          <p>Attatchment</p>
        </div>

        <div className="hover:cursor-pointer items-center justify-between gap-1 hidden xl:flex">
          <i>{audio}</i>
          <p>Audio</p>
        </div>

        <div className="gap-1 xl:hidden">
          <i>{threeDot}</i>
        </div>

        <button disabled={!post} onClick={handlePost} className="bg-gradient-to-r from-purple-500 to bg-pink-500 text-white rounded-2xl px-3 py-2 hover:cursor-pointer" >{isSubmitting ? "Posting..." : "POST"}</button>

      </div>
    </div>
  );
};

export default MyPostWidget;
