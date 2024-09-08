import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import state, { setMode, setPost } from "../../state";

import { comment, like, liked, share } from "../../icons/icon";
import Friend from "../../components/friend/Friend";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath = "",
  userPicturePath,
  likes = {},
  comments = [],
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);
  const loggedInUserId = useSelector((state) => state.user._id);

  const [isComments, setIsComments] = useState(false);
  const [isLiked, setIsLiked] = useState(Boolean(likes[loggedInUserId]));

  useEffect(() => {
    setIsLiked(Boolean(likes[loggedInUserId]));
  }, [likes, loggedInUserId]);

 
  const patchLike = async () => {
    // Save the current like state before updating
    const wasLiked = isLiked;
  
    try {
      // Optimistically update the UI
      setIsLiked(!wasLiked);
  
      const response = await fetch(`https://connectwave-backend.onrender.com/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update like: ${errorText}`);
      }
  
      const updatedPost = await response.json();
  
      // Debug the updated post data
      console.log("Updated post from server:", updatedPost);
  
      // Dispatch the updated post to the global state
      dispatch(setPost({ post: updatedPost }));
  
      // Update local state based on the server response
      setIsLiked(Boolean(updatedPost.likes[loggedInUserId]));
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert the UI state if an error occurs
      setIsLiked(wasLiked);
    }
  };
  

  // Recalculate like count based on the updated likes
  const likeCount = Object.keys(likes).length;

  return (
    <div className={`p-6 pb-3.5 rounded-lg xl:my-8 my-3 mx-0 ${mode === 'light' ? 'bg-white' : 'bg-slate-700 text-white'}`}>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <p className={` mt-4 ${mode === 'light' ? 'text-gray-800' : 'text-white'}`}>{description}</p>
      {picturePath && (
        <img
          src={`http://localhost:3001/assets/${picturePath}`}
          alt="post"
          className="w-full h-auto rounded-xl mt-3"
        />
      )}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-[0.3rem]">
            <div onClick={patchLike}>
              {isLiked ? (
                <i className="text-pink-600">{liked}</i>
              ) : (
                <i>{like}</i>
              )}
            </div>
            <p>{likeCount}</p>
          </div>

          <div className="flex items-center justify-between gap-[0.3rem]">
            <div onClick={() => setIsComments(!isComments)}>
              <i>{comment}</i>
            </div>
            <p>{comments.length}</p>
          </div>
        </div>
        <div>
          <i>{share}</i>
        </div>
      </div>
      {isComments && (
        <div className="mt-2">
          {comments.map((comment, i) => (
            <div key={`${name}-${i}`}>
              <hr />
              <p className="m-2 pl-4">{comment}</p>
            </div>
          ))}
          <hr />
        </div>
      )}
    </div>
  );
};

export default PostWidget;
