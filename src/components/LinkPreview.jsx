import { useState, useEffect, useContext } from 'react';
import Enviroment from '../core/Enviroment';
import "../App.css";
import { initGA, sendGAEvent } from '../core/ga4';
import adjustScreenSize from '../core/adjustScreenSize';
import Context from '../context';
import SpotifyEmbed from './SpotifyEmbed';
import { IonImg } from '@ionic/react';
import axios from 'axios';
function LinkPreview({ url, isGrid }) {
  const { isPhone, isHorizPhone } = useContext(Context);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  const size = adjustScreenSize(
    isGrid,
    true,
    " bg-emerald-200 rounded-t-lg overflow-hidden",
    " rounded-t-lg pt-4 overflow-hidden mx-auto ",
    " rounded-t-lg ",
    " rounded-t-lg ",
    " h-[100%] "
  );

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    if (!url) return;

    const isSpotify = url.includes('https://open.spotify.com/');
    const isPlumbum = url.includes("plumubum.app");

    if (isSpotify) {
      setPreviewData({ title: "Spotify" });
      setLoading(false);
    } else {
      fetchPreview(url).catch(err => {
        console.error("Failed to fetch preview:", err);
        setLoading(false);
      });
    }
  }, [url]);


const fetchPreview = async (url) => {
  try {
    const response = await axios.get(
      `${Enviroment.proxyUrl}/preview?url=${encodeURIComponent(url)}`
    );

    const data = response.data; // ✅ axios already gives JSON

    console.log("Fetched preview data:", data);
    setPreviewData(data);
  } catch (error) {
    // console.error('Failed to fetch link preview:', error);
  } finally {
    setLoading(false);
  }
};



  const handleClick = () => {
    sendGAEvent("Click Link Preview", `Navigate to ${previewData?.title || ""}:${url}`);
    window.open(url, '_blank');
  };

  const isYouTubeURL = (url) => url.includes('youtube.com') || url.includes('youtu.be');

  const extractYouTubeVideoId = (url) => {
    const videoIdRegex = /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : '';
  };

  // Spotify special case
  if (url?.includes('https://open.spotify.com/')) {
    return <SpotifyEmbed url={url} />;
  }

  if (loading) return <div className={"skeleton " + size} />;

  if (!previewData) return <p>Failed to fetch link preview.</p>;

  if (isYouTubeURL(url)) {
    const videoId = extractYouTubeVideoId(url);
    const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return <img onClick={handleClick} style={{ cursor: 'pointer' }} className={`rounded-lg p-1 ${size}`} src={videoThumbnail} alt="Video Thumbnail" />;
  }

  const imageView = () => {
    if (previewData.title !== "Spotify") {
      return previewData.image && (
        <a href={url} className={size}>
          <img className='rounded-t-lg' src={previewData.image} alt={previewData.title} />
        </a>
      );
    }
    return <SpotifyEmbed url={url} />;
  };

  const previewTitle = () => {
    if (previewData.title !== "Spotify") {
      return <h4 className={isGrid ? "" : 'text-slate-800 bg-emerald-200 text-[1rem] p-4'}>{previewData.title}</h4>;
    }
    return null;
  };

  const previewDescription = () => {
    if (!isPhone && !isGrid && previewData.title !== "Spotify") {
      return <h6 className={isGrid ? "overflow-scroll pt-2 px-1 mx-auto" : 'text-slate-800 p-3 bg-emerald-200 text-[0.8rem]'}>{previewData.description}</h6>;
    }
    return null;
  };

  return (
    <div className=" w-[90vw] sm:w-page mx-auto" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {imageView()}
      <div className='text-left overflow-clip open-sans-medium'>
        {previewDescription()}
        {isGrid ? null : previewTitle()}
      </div>
    </div>
  );
}

export default LinkPreview;

