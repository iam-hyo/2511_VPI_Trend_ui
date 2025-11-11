// /src/pages/SearchPage.jsx
import { useState } from 'react';
import { searchVideos } from '../api/backendApi';
import VideoGrid from '../components/VideoGrid';
import SortDropdown from '../components/SortDropdown';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // 원본 결과
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState({ sortBy: 'vpi', order: 'desc' });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    
    // (참고: searchVideos는 현재 /api/related-videos (4개)를 호출합니다)
    // (50개를 원하면 백엔드 API 수정이 필요합니다)
    searchVideos(query)
      .then(data => {
        // (Spec 5.3의 응답은 snippet, vpiScore를 포함한 배열)
        setResults(data); 
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  // 정렬 로직 (클라이언트 사이드)
  const sortedResults = [...results].sort((a, b) => {
    let valA, valB;
    if (sort.sortBy === 'vpi') {
      valA = a.vpiScore;
      valB = b.vpiScore;
    } else if (sort.sortBy === 'view') {
      // (참고: /related-videos 응답에 statistics가 없을 수 있음. 백엔드 수정 필요)
      valA = a.statistics?.viewCount || 0;
      valB = b.statistics?.viewCount || 0;
    } else { // 'date'
      valA = new Date(a.snippet.publishedAt);
      valB = new Date(a.snippet.publishedAt);
    }
    return (sort.order === 'desc' ? (valB - valA) : (valA - valB));
  });

  return (
    <div>
      <h2>키워드 검색 (그리드 뷰)</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="5일 이내 영상 검색..."
        />
        <button type="submit" disabled={loading}>
          {loading ? '검색 중...' : '검색'}
        </button>
      </form>
      
      {results.length > 0 && (
        <SortDropdown sort={sort} setSort={setSort} />
      )}

      {loading && <p>검색 중...</p>}
      {error && <p className="error-msg">오류: {error}</p>}
      
      <VideoGrid videos={sortedResults} />
    </div>
  );
}