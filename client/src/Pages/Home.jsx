import React, { useState, useEffect } from "react";
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
  const [playlists, setPlaylists] = useState([]);
  const [playlist_id, setPlaylist_id] = useState("");

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

  const planetVibes = {
    Mercury: "fast chaotic techno Mercury",
    Venus: "romantic soul R&B Venus",
    Earth: "nature folk multicultural Earth",
    Mars: "aggressive trap rock Mars",
    Jupiter: "epic cinematic Jupiter",
    Saturn: "moody ambient Saturn",
    Uranus: "futuristic synthwave Uranus",
    Neptune: "dreamy chill Neptune",
    Pluto: "dark ambient Pluto",
  };

  const token = localStorage.getItem("spotify_token");

  // template from spotify documenation
  async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  }

  // gets the query from the dictionary and uses the spotify search to loopk for playlists that match the vibes
  async function searchPlaylists(vibeQuery) {
    const encodedQuery = encodeURIComponent(vibeQuery);
    const data = await fetchWebApi(
      `v1/search?q=${encodedQuery}&type=playlist&limit=20`,
      "GET"
    );

    // at this point, we need to filter the invalid/null playlists out
    const allPlaylists = data.playlists?.items || [];

    const validPlaylists = allPlaylists
      .filter((p) => p && p.name && p.id)
      .map((p) => ({
        name: p.name,
        id: p.id,
      }));

    console.log("Playlist items are correctly sent");
    //only need 10 playlists
    return validPlaylists.slice(0, 10);
  }

  // after looking through console log in inspect mode, apparently the playlists do show, but some of them are null for who knows why
  useEffect(() => {
    if (planetVibes[selectedPlanet]) {
      searchPlaylists(planetVibes[selectedPlanet]).then((items) => {
        // makes sure the playlist exists
        if (!items || !Array.isArray(items)) {
          console.warn("No playlists returned or data is invalid", items);
          return;
        }
        // the prompt that was put into the spotify search
        console.log(`${selectedPlanet} — "${planetVibes[selectedPlanet]}"`);

        // get the name and url to make sure they are actual playlists and prints them
        items.forEach((p, i) => {
          if (p?.name && p?.id) {
            console.log(` ${i + 1}. ${p.name}: ${p.id}`);
          } else {
            // Used as a notification that the playlist doesn't exist or is null (the error of the 2nd box)
            console.warn(" Invalid playlist object:", p);
          }
        });

        console.log("Finished logging playlists");
        setPlaylists(items);
      });
    }
  }, [selectedPlanet]);

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
          <div className="flex justify-center items-center">
            <div className="flex flex-col w-full">
              {planetData.map((planet, index) => (
                <button
                  key={index}
                  className="text-black w-full py-4 px-6 hover:bg-gray-200 transition flex justify-center items-center gap-2"
                  onClick={() => {
                    setSelectedPlanet(planet.name);
                    setShowThirdBox(false);
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
          <div className="w-[500px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col gap-5">
            <h1 className="mt-6 text-center text-3xl font-bold">
              Playlists for {selectedPlanet}
            </h1>

            <ul className="list-disc list-outside w-full pl-6">
              {playlists.length > 0 ? (
                playlists.map(
                  (p, i) =>
                    p &&
                    p.name &&
                    p.id && (
                      <li key={i} className="w-full">
                        <button
                          className="text-left py-3 px-2 rounded-md hover:bg-gray-200 transition text-black font-medium w-full"
                          onClick={() => {
                            console.log("Clicked playlist ID:", p.id);
                            setPlaylist_id(p.id);
                            setShowThirdBox(true);
                          }}
                        >
                          {p.name}
                        </button>
                      </li>
                    )
                )
              ) : (
                <p className="text-gray-500 text-center w-full mt-4">
                  Loading or no playlists found...
                </p>
              )}
            </ul>
          </div>
        )}

        {/* Third Box */}
        {showThirdBox && (
          <div className="w-[500px] h-[600px] bg-white rounded-xl shadow-lg flex flex-col justify-center items-center">
            
            {/* Displays a live spotify playlist */}
            <iframe
              title="Spotify Embed: Recommendation Playlist "
              src={`https://open.spotify.com/embed/playlist/${playlist_id}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              style={{ minHeight: "360px" }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
