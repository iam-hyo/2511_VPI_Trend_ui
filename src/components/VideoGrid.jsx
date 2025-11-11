// /src/components/VideoGrid.jsx
import VideoCard from './VideoCard';

export default function VideoGrid({ videos }) {
  if (!videos || videos.length === 0) {
    return <p>검색 결과가 없습니다.</p>;
  }

  return (
    <div className="video-grid">
      {videos.map(video => (
        <VideoCard key={video.id?.videoId || video.id} video={video} />
      ))}
    </div>
  );
}