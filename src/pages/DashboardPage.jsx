// /src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { getTrends, getAvailableData } from '../api/backendApi';
import VideoTable from '../components/VideoTable';
import SortDropdown from '../components/SortDropdown';

export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // (신규) 필터 옵션 상태
  const [availableData, setAvailableData] = useState([]); // [{ id, time, region, label }, ...]
  const [regions, setRegions] = useState([]); // ["KR", "US", "IN", ...]
  
  // (신규) 선택된 필터 상태
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sort, setSort] = useState({ sortBy: 'vpi', order: 'desc' });

  // 1. (최초 1회) 필터 목록을 불러옵니다.
  useEffect(() => {
    getAvailableData()
      .then(data => {
        if (data.length === 0) {
          setError('분석된 데이터가 없습니다. 백엔드 `npm run batch`를 실행하세요.');
          return;
        }
        
        // 사용 가능한 데이터 목록 저장
        setAvailableData(data);
        
        // 고유한 지역(Region) 목록 추출
        const uniqueRegions = [...new Set(data.map(d => d.region))];
        setRegions(uniqueRegions);
        
        // (기본값) 최신 데이터(index 0)로 필터 설정
        setSelectedTime(data[0].time);
        setSelectedRegion(data[0].region);
      })
      .catch(err => setError(err.message));
  }, []);

  // 2. 필터 또는 정렬이 변경되면 데이터를 다시 불러옵니다.
  useEffect(() => {
    // 필터가 아직 설정되지 않았으면(최초 로딩 중) 실행 안 함
    if (!selectedTime || !selectedRegion) return;

    setLoading(true);
    setError(null);
    setVideos([]);
    
    getTrends(selectedTime, selectedRegion, sort.sortBy, sort.order)
      .then(data => {
        setVideos(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
      
  }, [selectedTime, selectedRegion, sort]); // 필터와 정렬 상태가 바뀔 때마다 실행

  // (신규) 현재 선택된 지역에서 사용 가능한 시간 목록
  const timeOptions = availableData.filter(d => d.region === selectedRegion);

  return (
    <div>
      <h2>트렌드 대시보드 (순위표)</h2>
      
      {/* --- 필터링 기능 --- */}
      <div className="filter-controls">
        <label>국가:</label>
        <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        
        <label>시간:</label>
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
          {timeOptions.map(t => (
            <option key={t.id} value={t.time}>{t.label.replace(`(${t.region})`, '')}</option>
          ))}
        </select>
      </div>

      {/* --- 정렬 기능 --- */}
      <SortDropdown sort={sort} setSort={setSort} />
      
      {loading && <p>로딩 중...</p>}
      {error && <p className="error-msg">{error}</p>}
      
      <VideoTable videos={videos} />
      <p>안녕하세요</p>
    </div>
  );
}