import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function Consultants() {
  const { setLogin, isLoggedIn } = useContext(AppContext);
  const [consultants, setConsultants] = useState([]);
  const [googleToken, setGoogleToken] = useState(null);
  const { cid } = useParams();
  const navigate = useNavigate();
  console.log(isLoggedIn);

  useEffect(() => {
    async function handleReload() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLogin(data.user, data.consultationDetails);
        }
      } catch (e) {
        console.log(e);
      }
    }

    async function getConsultants() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/${cid}/consultants`
        );
        if (response.ok) {
          const data = await response.json();
          setConsultants(data.data);
        }
      } catch (error) {
        console.error("Error fetching consultants:", error);
      }
    }

    handleReload();
    getConsultants();
  }, [cid]);

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    setGoogleToken(token);
    // You can now use the token to create Google Meet links
  };

  const handleGoogleLoginError = () => {
    console.log("Login Failed");
  };

  const createGoogleMeetEvent = async (consultantId) => {
    if (!googleToken) {
      alert("Please log in to Google first!");
      return;
    }

    try {
      alert("Please provide camera access ");
      const response = await fetch("/api/create-google-meet-event", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultantId: consultantId,
          // You can include additional details such as date/time, etc.
        }),
      });
      const data = await response.json();
      alert(`Google Meet Link created: ${data.meetLink}`);
    } catch (error) {
      console.error("Error creating Google Meet event:", error);
    }
  };

  let serviceName;
  if (consultants.length > 0) {
    serviceName = consultants[0].serviceName;
  }

  const imageBackgroundUrl = cid === '6730a074171d2606ec5392e3' ? 'https://t4.ftcdn.net/jpg/03/73/04/95/360_F_373049549_9IQ1CopFeuw0iufrjrNeiBw1urQzkwij.jpg':cid === '65f7dff26c677bd968f52023'?'https://wallpapers.com/images/featured/hotel-background-sdr508awonqxixqe.jpg':cid ==='65f7e09b6c677bd968f52025' ? 'https://t3.ftcdn.net/jpg/05/16/05/76/360_F_516057644_qMGY5IZoNNOkCLI5vJqtNpXSIU9J5Kmx.jpg':'65f7e0476c677bd968f52024'?'https://t4.ftcdn.net/jpg/08/44/51/97/360_F_844519711_GD9KTgzIk6xAvTsSimjGp8BLdBhwYytH.jpg':''

  return (
    <div className="container mx-auto py-8">
      {serviceName && (
        <p className="text-center text-3xl pb-7">{serviceName} Consultants</p>
      )}
      <div className="fixed top-0 left-0 w-full h-full"><img src={imageBackgroundUrl} className="w-full h-full"/></div>
      <div className="md:flex gap-3 justify-center md:w-3/4 md:mx-auto">
        {consultants.length > 0 ? (
          consultants.map((consultant) => (
            <div
              key={consultant._id}
              className="bg-gray-900 text-white mt-5 rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 mx-auto md:mx-0 hover:scale-105 w-2/3 md:w-80"
            >
              <h2 className="text-2xl font-semibold mb-2">{consultant.name}</h2>
              <p className="text-gray-300 mb-2">
                Experience: {consultant.experience} years
              </p>
              <p className="text-gray-300 mb-2">Age: {consultant.age}</p>
              <p className="text-gray-300 mb-2">
                Rating: {consultant.avgRating}
              </p>
              <p className="text-gray-300 mb-4">Phone: {consultant.contact}</p>
              <div className="flex gap-4">
                <NavLink
                  to={`/consultant/${consultant._id}`}
                  className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded inline-block"
                >
                  Book Now
                </NavLink>
                {/* Add Google Meet Button */}
                <button
                  onClick={() => createGoogleMeetEvent(consultant._id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-block"
                >
                  Create Google Meet
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-2xl">No Consultants Found</p>
        )}
      </div>
      <div className="w-[30%] mt-10 mx-auto">
        {/* Google Login */}
        {!googleToken && (
          <GoogleOAuthProvider clientId="904667711062-sbqj8330jo8nc9da84a5s68kieul9o2t.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
          </GoogleOAuthProvider>
        )}
      </div>
    </div>
  );
}
