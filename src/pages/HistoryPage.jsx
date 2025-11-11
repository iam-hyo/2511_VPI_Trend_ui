// /src/pages/HistoryPage.jsx
import { useState, useEffect } from 'react';
// import { getHistoryList } from '../api/backendApi'; // (API 구현 후 주석 해제)

export default function HistoryPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // (백엔드에 GET /api/history 엔드포인트 구현 필요)
    // setLoading(true);
    // getHistoryList()
    //   .then(setList)
    //   .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>검색/분석 히스토리</h2>
      <p>(이 기능은 백엔드에 `GET /api/history` 엔드포인트 구현이 필요합니다.)</p>
      {loading && <p>로딩 중...</p>}
      <ul>
        {/* (임시 Mock 데이터) */}
        <li>(분석) 20251110_1500_KR</li>
        <li>(검색) 20251110_1430_AI반도체</li>
      </ul>
    </div>
  );
}