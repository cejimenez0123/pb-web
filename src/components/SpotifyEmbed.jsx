import React from 'react';

const getSpotifyEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const type = parts[1]; // 'track', 'album', or 'playlist'
    const id = parts[2];

    const validTypes = ['track', 'album', 'playlist'];
    if (!validTypes.includes(type)) return null;

    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
  } catch (error) {
    return null;
  }
};

const SpotifyEmbed = ({ url, compact = false }) => {
  const embedUrl = getSpotifyEmbedUrl(url);

  if (!embedUrl) {
    return <p>Invalid Spotify URL.</p>;
  }

  return (
    <iframe
      title="Spotify Embed"
      style={{
        borderRadius: "12px",
        width: "100%",
      }}
      src={embedUrl}
      height={compact ? 152 : 352} // 🔥 key change
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
};
export default SpotifyEmbed;