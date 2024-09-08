import { useEffect, useState } from "react";
import UserImage from "../../components/useImage/UserImage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { edit, facebook, insta, linkedin, locationIcon, occupationIcon, setting, twitter } from "../../icons/icon";
import state from "../../state";


const UserWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const mode = useSelector((state) => state.mode);
   
    const getUser = async () => {
        const response = await fetch(`https://connectwave-backend.onrender.com/users/${userId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        getUser();
    }, [])

    if (!user) {
        return null;
    }

    const {
        firstName,
        lastName,
        location,
        occupation,
        viewedProfile,
        impressions,
        friends,
    } = user;

    return (
        <div className={`p-6 pb-3.5 rounded-lg ${mode === 'light' ? 'bg-white' : 'bg-slate-700 text-white'}`}>
          <div className="flex items-center justify-between gap-2 pb-4" onClick={() => navigate(`/profile/${userId}`)}>
              <div className="flex items-center justify-between">
                 <UserImage image={picturePath} />
                 <div className="ml-3">
                    <h4 className="text-xl font-medium hover:text-white cursor-pointer ">
                        {firstName} {lastName}
                    </h4>
                    <p>{friends.length} friends</p>
                 </div>
              </div>
              {setting}   
          </div>

              <hr className="border-gray-400" />

              <div className="py-4 px-0">
                <div className="flex items-center gap-4 mb-2">
                  <i className="text-lg ml-1">{locationIcon}</i>
                  <p>{location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <i className="text-lg">{occupationIcon}</i>
                  <p>{occupation}</p>
                </div>
              </div>

              <hr className="border-gray-400" />

              <div className="py-4 px-0">
                <div className="flex items-center justify-between mb-2">
                    <p>Who's viewed your profile</p>
                    <p className="font-medium">{viewedProfile}</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <p>Impressions of your post</p>
                    <p className="font-medium">{impressions}</p>
                </div>
              </div>

              <hr className="border-gray-400" />

              <div className="py-4 px-0">
                  <p className="text-base font-medium mb-4">
                    Social Profiles
                  </p>

                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center justify-between">
                        <i className="text-4xl">{twitter}</i>
                        <div className="ml-3">
                            <p className="font-medium">
                                Twitter
                            </p>
                            <p>Social Network</p>
                        </div>
                    </div>
                    <i className="text-lg">{edit}</i>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center justify-between">
                        <i className="text-4xl">{linkedin}</i>
                        <div className="ml-3">
                            <p className="font-medium">
                                LinkedIn
                            </p>
                            <p>Network Platform</p>
                        </div>
                    </div>
                    <i className="text-lg">{edit}</i>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center justify-between">
                        <i className="text-4xl">{insta}</i>
                        <div className="ml-3">
                            <p className="font-medium">
                                Instagram
                            </p>
                            <p>Social Network</p>
                        </div>
                    </div>
                    <i className="text-lg">{edit}</i>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center justify-between">
                        <i className="text-4xl">{facebook}</i>
                        <div className="ml-3">
                            <p className="font-medium">
                                Facebook
                            </p>
                            <p>Social Network</p>
                        </div>
                    </div>
                    <i className="text-lg">{edit}</i>
                  </div>
                  
              </div>
          
        </div>
    )
};

export default UserWidget;
