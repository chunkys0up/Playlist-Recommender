import { React, useState } from "react";
import {
  Zap,
  Heart,
  Leaf,
  Flame,
  Trophy,
  Moon,
  Cpu,
  Cloud,
  Ghost,
} from "lucide-react";

export default function Home() {
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [showThirdBox, setShowThirdBox] = useState(false);

    const planetData = [
        { name: "Mercury", icon: <Zap /> },
        { name: "Venus", icon: <Heart /> },
        { name: "Earth", icon: <Leaf /> },
        { name: "Mars", icon: <Flame /> },
        { name: "Jupiter", icon: <Trophy /> },
        { name: "Saturn", icon: <Moon /> },
        { name: "Uranus", icon: <Cpu /> },
        { name: "Neptune", icon: <Cloud /> },
        { name: "Pluto", icon: <Ghost /> },
      ];


  const token = localStorage.getItem("spotify_token");

  // template code from spotify documentation
  async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body),
    });
    return await res.json();
  }

  // template code form spotify documentation
  async function getTopTracks() {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (
      await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
    ).items;
  }

  if (!token) {
    return <div>Please log in to see the home page.</div>;
  }

  return (
    <div className="h-screen flex justify-center items-center bg-[url('https://i.redd.it/8u4i48fl58h71.png')] bg-cover bg-center">
      <div className="flex gap-10 items-start">

        {/* First Box */}
        <div className="w-[300px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col">
          <h1 className="mt-6 text-center text-3xl font-bold">
            Select a Planet
          </h1>

          {/* Button List */}
          <div className="flex-grow flex justify-center items-center">
            <div className="flex flex-col ">
              {planetData.map((planet, index) => (
                <button
                  key={index}
                  className=" text-black py-4 px-25 hover:bg-neutral-600 transition flex items-center gap-2"
                  onClick={() => {
                    setSelectedPlanet(planet.name);
                    setShowThirdBox(false); // Reset third box on new selection (fix)
                  }}
                >
                  {planet.icon} {planet.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Second Box */}
        {selectedPlanet && (
          <div className="w-[500px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Info about {selectedPlanet}
            </h2>
            <p className="text-gray-600 mb-6">
              This is where details about {selectedPlanet} would go.
            </p>
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
              onClick={() => setShowThirdBox(true)}
            >
              Show More Info
            </button>
          </div>
        )}

        {/* Third Box */}
        {showThirdBox && (
          <div className="w-[500px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Deep Dive into {selectedPlanet}
            </h2>
            <p className="text-gray-600 text-center px-8">
              This is more in-depth information about {selectedPlanet}, maybe including moons, atmosphere, or interesting facts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
