import React, { useState } from "react";
import spotifyLogo from "../assets/spotifyLogo.png";
import { useNavigate } from "react-router-dom"


const SpotifyAuth = () => {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  }


  // Function to get the auth token
  const getAuthToken = async () => {

    //if I can't get the auth to work then ima just use my client id and secret so i can atleast see the project somewhat through
    const clientId = "12ed23b64caa401299d408c9643b2616";
    const clientSecret = "151e0a72b7654b1abc008c54a790963a";

    const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
      });

      const data = await response.json();
      
      //need to use local storage so it persists over multiple components
      localStorage.setItem("spotify_token", data.access_token);
      //setAuthToken(data.access_token); // Store the auth token in state

      goToHome();
      console.log("Successfully got token");
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  return (
    <div className="bg-[url('https://i.redd.it/8u4i48fl58h71.png')] bg-cover bg-center h-screen w-full flex items-center justify-center">
      <div className="bg-white bg-opacity-80 rounded-xl py-12 px-8 shadow-lg text-center space-y-8">
        {/* Spotify Logo */}
        <img
          src={spotifyLogo}
          alt="Logo"
          className="h-24 w-auto mx-auto"
        />
  
        {/* Header */}
        <h2 className="text-3xl font-semibold">
          Space Playlist Recommendation
        </h2>
  
        {/* Button */}
        <button className="bg-green-500 text-black px-6 py-2 rounded hover:bg-gray-800 transition"
            onClick = {getAuthToken}
        >
          Login
        </button>
      </div>
    </div>
  );
  
};

export default SpotifyAuth;
