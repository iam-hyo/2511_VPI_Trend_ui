// /src/components/VideoTable.jsx
import React, { useState } from 'react';
import { generateScript, searchVideos } from '../api/backendApi';


/**
 * [신규] 순위(rank)에 따라 1~5등까지 다른 CSS 클래스를 반환합니다.
 * @param {number} rank - 순위 (1부터 시작)
 * @returns {string} CSS 클래스명
 */
function getRankBadgeClass(rank) {
  if (rank >= 1 && rank <= 5) {
    return `rank-badge rank-${rank}`;
  }
  return 'rank-badge';
}

const YT_CATEGORY_MAP = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '17': 'Sports',
  '20': 'Gaming',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': 'Education',
  '28': 'Science & Technology',
  // 필요하면 더 추가
};

/**
 * [수정] 단일 행(Row) 컴포넌트
 */
function TrendVideoRow({ video, rank }) {
  console.log(video);
  const [relatedVids, setRelatedVids] = useState([]); // 4개 관련 비디오
  const [isLoading, setIsLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState(null); // 스크립트 결과
  const [error, setError] = useState(null);

  /**
   * [Spec] 관련 비디오 생성 기능
   * (키워드로 50개 검색 -> 백엔드가 VPI 상위 4개 반환)
   */
  const handleFetchRelated = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // (백엔드 /api/related-videos가 50개 검색 후 4개 반환)
      const data = await searchVideos(video.keyword);
      setRelatedVids(data);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  /**
   * [Spec] 스크립트 만들기
   * (관련 비디오 4개(또는 생성된 개수)를 모두 사용)
   */
  const handleGenerateScript = async () => {
    if (relatedVids.length === 0) return;

    setIsLoading(true);
    setError(null);
    setScriptResult(null);

    const videosPayload = relatedVids.map((v) => ({
      id: v.id,
      title: v.snippet?.title ?? '',
      description: v.snippet?.description ?? '',
    }));

    try {
      const data = await generateScript(videosPayload, video.keyword);
      setScriptResult({
        new: data.newScript,
        intro: data.introScript,
      });
    } catch (err) {
      setError(err.message);
      setScriptResult(`오류: ${err.message}`);
    }
    setIsLoading(false);
  };

  // [Spec] 근거 Vid 툴팁에 표시될 텍스트
  const tooltipText = `
${video.title}
업로드: ${new Date(video.publishedAt).toLocaleString()}
VPI 점수: ${video.vpiScore ? video.vpiScore.toFixed(2) : 'N/A'}
  `.trim();

  return (
    <tr>
      {/* 1. 순위 (뱃지 적용) */}
      <td>
        <span className={getRankBadgeClass(rank)}>{rank}</span>
      </td>

      {/* 2. 키워드 (뱃지 적용) */}
      <td>
        {/* video.keyword가 배열이므로 [0] (첫 번째 요소)를 표시 */}
        <span className="keyword-badge">
          {(Array.isArray(video.keyword) ? video.keyword[0] : video.keyword) || 'N/A'}
        </span>
      </td>

      {/* 3. VPI Trend */}
      <td>{video.trendScore_VPI.toFixed(2)}</td>

      {/* [신규] 4. 조회수 트랜드 */}
      <td>{video.trendScore_View.toFixed(2)}</td>

      {/* 5. 근거 Video */}
      <td>
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          title={tooltipText}
          className="video-link"
        >
          <img
            src={video.thumbnails?.default?.url || ''}
            alt="썸네일"
          />
          <p>{video.title}</p>
        </a>
      </td>

      {/* 6. 카테고리 */}
      <td>
        <span className="keyword-badge">
          {YT_CATEGORY_MAP[video.categoryId] || video.categoryId || 'N/A'}
      </span>
    </td>

      {/* 7. 관련 비디오 */ }
  <td>
    <button onClick={handleFetchRelated} disabled={isLoading} className="action-button">
      {isLoading ? '생성 중...' : '관련 Vid 생성'}
    </button>
    <div className="related-vids">
      {relatedVids.map(vid => (
        <a
          key={vid.id.videoId || vid.id}
          href={`https://www.youtube.com/watch?v=${vid.id.videoId || vid.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="related-vid-item"
          title={vid.snippet.title}
        >
          <img
            src={vid.snippet?.thumbnails?.default?.url || ''}
            alt={vid.snippet.title}
            className="related-thumbnail"
          />
        </a>
      ))}
    </div>
  </td>

  {/* 8. 스크립트 만들기 */ }
  <td>
    <button
      onClick={handleGenerateScript}
      disabled={isLoading || relatedVids.length === 0}
      className="action-button"
    >
      스크립트 만들기
    </button>
    {error && <p className="error-msg">{error}</p>}
    {scriptResult && <textarea readOnly value={scriptResult} />}
  </td>
    </tr >
  );
}

// 메인 테이블 컴포넌트 
export default function VideoTable({ videos }) {
  if (!videos || videos.length === 0) {
    return <p>표시할 데이터가 없습니다.</p>;
  }

  return (
    <table className="video-table">
      <thead>
        <tr>
          <th>순위</th>
          <th>키워드</th>
          <th>VPI 트렌드</th>
          <th>조회수 트렌드</th> 
          <th>근거 Vid</th>
          <th>카테고리</th>
          <th>관련 Vid</th>
          <th>스크립트</th>
        </tr>
      </thead>
      <tbody>
        {videos.map((video, index) => (
          <TrendVideoRow key={video.videoId} video={video} rank={index + 1} />
        ))}
      </tbody>
    </table>
  );
}