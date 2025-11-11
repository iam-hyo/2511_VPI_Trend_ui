// /src/components/VideoCard.jsx
export default function VideoCard({ video }) {
  const snippet = video.snippet;
  const videoId = video.id?.videoId || video.id;

  return (
    <a 
      href={`https://www.youtube.com/watch?v=${videoId}`} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="video-card"
    >
      <img src={snippet.thumbnails.medium.url} alt={snippet.title} />
      <div className="video-card-info">
        <h3>{snippet.title}</h3>
        <p>{snippet.channelTitle}</p>
        <p>{new Date(snippet.publishedAt).toLocaleDateString()}
          {/* vpiScore가 있는 경우 (검색 API)에만 표시 */}
          {video.vpiScore != null && (
            <strong className="vpi-score">VPI: {video.vpiScore.toFixed(1)}</strong>
          )}
        </p>
      </div>
    </a>
  );
}