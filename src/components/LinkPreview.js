import { useState, useEffect } from 'react';
import Enviroment from '../core/Enviroment';

function LinkPreview({ url,size }) {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "Access-Control-Allow-Origin": "*",
        };
        
        const response = await fetch(`${Enviroment.proxyUrl}${url}`, {
          headers: headers
        }
        )
        ;
        const data = await response.text();

        const isYouTubeVideo = isYouTubeURL(url);
        if (isYouTubeVideo) {
          const videoId = extractYouTubeVideoId(url);
          const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          setPreviewData({
            videoId,
            videoThumbnail,
          });
          setLoading(false);
        } else {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
          const title = doc.querySelector('title')?.textContent || '';
          const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
          let image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
          if (!image) {
            // If og:image meta tag is not present, try to find other image elements
            const imgElement = doc.querySelector('img');
            if (imgElement) {
              image = imgElement.getAttribute('src') || '';
            }
          }
          console.log(`title`+title)
          console.log("description"+description)
          console.log("image"+JSON.stringify(image))
          setPreviewData({
            title,
            description,
            image,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const isYouTubeURL = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const extractYouTubeVideoId = (url) => {
    const videoIdRegex = /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : '';
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!previewData) {
    return <p>Failed to fetch link preview.</p>;
  }

  const handleClick = () => {
    window.open(url, '_blank');
  };

  if (previewData.videoId) {
    return (
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img src={previewData.videoThumbnail} alt="Video Thumbnail" />
      </div>
    );
  }
 
  return (
    <div className="link-preview" onClick={handleClick} style={{ cursor: 'pointer' }}>
      
      {previewData.image && <img src={previewData.image} style={{width:"100%"}} alt="Link Preview" />}
      <p>{previewData.description}</p>
      <h4 className='title'>{previewData.title}</h4>
    </div>
  );
}

export default LinkPreview;