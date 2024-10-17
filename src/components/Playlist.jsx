import React, { useEffect, useState } from "react";
import "./Playlist.css";
const API_KEY = "AIzaSyA2FB6FH6-aXwyeYeGQLxqP5Hlbuwiy4bk"; // Replace with your actual API key

const VideoDurationCalculator = () => {
  const [playlistUrl, setPlaylistUrl] = useState(""); // Now accepting full URL
  const [playlistId, setPlaylistId] = useState("");
  const [totalDuration, setTotalDuration] = useState(0);
  const [error, setError] = useState(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // code to get total no of videos and fetch the total duration of the playlist
  useEffect(() => {
    if (playlistId) {
      const fetchAllPlaylistItems = async (pageToken = "") => {
        try {
          let allVideoIds = [];
          let totalResults = 0;
          let nextPageToken = pageToken;

          // Fetch all video IDs across multiple pages
          do {
            const playlistItemsResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
            );
            const playlistItemsData = await playlistItemsResponse.json();

            if (playlistItemsData.error) {
              setError(playlistItemsData.error.message);
              return;
            }

            const videoIds = playlistItemsData.items.map(
              (item) => item.contentDetails.videoId
            );
            allVideoIds = [...allVideoIds, ...videoIds]; // Collect all video IDs
            totalResults += playlistItemsData.items.length;

            nextPageToken = playlistItemsData.nextPageToken || ""; // Update token for next page

          } while (nextPageToken);

          setTotalVideos(totalResults);

          // Fetch all video durations in batches of 50
          let totalSeconds = 0;
          for (let i = 0; i < allVideoIds.length; i += 50) {
            const batchIds = allVideoIds.slice(i, i + 50);
            const videoDetailsResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batchIds.join(
                ","
              )}&key=${API_KEY}`
            );
            const videoDetailsData = await videoDetailsResponse.json();

            // Calculate total duration
            videoDetailsData.items.forEach((video) => {
              const duration = video.contentDetails.duration;
              totalSeconds += isoDurationToSeconds(duration);
            });
          }

          setTotalDuration(totalSeconds);
          setError(null);
        } catch (error) {
          console.error("Error fetching playlist or video details:", error);
          setError("Failed to fetch playlist or video details.");
        }
      };

      fetchAllPlaylistItems(); // Fetch all playlist items including pagination
    }
  }, [playlistId]);

  // code to get title of the playlist
  useEffect(() => {
    if (playlistId) {
      const fetchTitle = async () => {
        try {
          const title = await fetch(
            `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
          );

          const titleData = await title.json();

          if (titleData.error) {
            setError(titleData.error.message);
            return;
          }

          setTitle(titleData.items[0].snippet.title);
          setError(null);
          setThumbnail(titleData.items[0].snippet.thumbnails.high.url);
        } catch (error) {
          setError("Failed to fetch playlist title");
        }
      };
      fetchTitle();
    }
  }, [playlistId]);

  // Extract playlist ID from the full URL
  const extractPlaylistId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("list");
  };

  // Convert seconds to hh:mm:ss
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours} Hours : ${minutes} Minutes : ${seconds} Seconds`;
  };

  // Helper function to convert ISO 8601 duration to seconds
  const isoDurationToSeconds = (isoDuration) => {
    const matches = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(matches?.[1]) || 0;
    const minutes = parseInt(matches?.[2]) || 0;
    const seconds = parseInt(matches?.[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleSubmit = () => {
    const id = extractPlaylistId(playlistUrl);
    if (id) {
      setPlaylistId(id);
      setError(null);
    } else {
      setError(
        "Invalid playlist URL. Please enter a valid YouTube playlist link."
      );
    }
  };

  // Calculate adjusted duration based on speed
  const adjustedDuration = Math.floor(totalDuration / 1);

  return (
    <div className="main">
      <div className="hero">
        <div className="input-button">
          <h1>Youtube Playlist Length Calculator</h1>
          <input
            className="input"
            type="text"
            placeholder="Enter Playlist URL"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
          />

          <button className="button" onClick={handleSubmit}>
            Calculate Duration
          </button>

          {!error && totalVideos > 0 && title && (
            <h3 className="h3">Playlist Title: {title}</h3>
          )}

          {!error && totalVideos > 0 && (
            <h4>Total Number of Videos: {totalVideos}</h4>
          )}

          <h4>Total Duration: {formatDuration(adjustedDuration)}</h4>
        </div>

        <div>
          {!error && totalVideos > 0 && setThumbnail}
          {<img className="thumbnail" src={thumbnail} alt="" />}
        </div>
      </div>

      {/* hero end  */}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="content">
        {!error && adjustedDuration > 0 && (
          <div className="durations-grid">
            <div className="cards">
              <h4>Speed = 1.25x</h4>
              <p>Duration: {formatDuration(Math.floor(totalDuration / 1.25))}</p>
            </div>
            <div className="cards">
            <h4>Speed = 1.5x</h4>
            <p>Duration: {formatDuration(Math.floor(totalDuration / 1.5))}</p>
            </div>
            <div className="cards">
            <h4>Speed = 1.75x</h4>
            <p>Duration: {formatDuration(Math.floor(totalDuration / 1.75))}</p>
            </div>
            <div className="cards">
            <h4>Speed = 2x</h4>
            <p>Duration: {formatDuration(Math.floor(totalDuration / 2))}</p>
            </div>
            <div className="cards">
            <h4>Speed = 3x</h4>
            <p>Duration: {formatDuration(Math.floor(totalDuration / 3))}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDurationCalculator;
