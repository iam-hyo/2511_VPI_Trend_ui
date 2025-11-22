// /src/api/backendApi.js

/**
 * API 호출을 위한 범용 헬퍼 함수
 * @param {string} endpoint - API 엔드포인트 (예: /trends)
 * @param {object} options - fetch 옵션 (method, body 등)
 * @returns {Promise<any>} JSON 응답 데이터
 */
async function fetchApi(endpoint, options = {}) {
  // Vite 프록시가 /api를 http://localhost:3000/api로 변환해 줌
  const res = await fetch(`/api${endpoint}`, options);
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `HTTP ${res.status} 오류가 발생했습니다.`);
  }
  return res.json();
}

/**
 * [Spec 5.2] 트렌드 조회
 */
export const getTrends = (time, region, sortBy = 'vpi', order = 'desc') => {
  return fetchApi(`/trends?time=${time}&region=${region}&sortBy=${sortBy}&order=${order}`);
};

/**
 * [신규] 검색 페이지용 API (50개)
 * (참고: 백엔드 Spec 5.3의 /api/related-videos는 4개만 반환합니다.)
 * (따라서 이 UI가 작동하려면 백엔드에 50개를 반환하는 새 API가 필요합니다.)
 * (여기서는 /api/related-videos가 50개를 반환한다고 임시 가정합니다.)
 */
export const searchVideos = (keyword) => {
  // (임시) Spec 5.3을 사용. 4개만 반환될 것입니다.
  // 50개를 받으려면 백엔드의 /related-videos 컨트롤러를 수정해야 합니다.
  return fetchApi('/related-videos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword }),
  });
};

/**
 * [Spec 5.4] 스크립트 생성
 */
export const generateScript = (videos, query) => {
  return fetchApi('/generate-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // 보낸값
    body: JSON.stringify({ videos, query }),       // 보낸 실제 값
  });
};

/**
 * [신규] 히스토리 목록 조회
 * (참고: 이 API는 백엔드에 새로 구현해야 합니다. 예: /data 폴더 목록 읽기)
 */
export const getHistoryList = () => {
  // (가정) /api/history 엔드포인트
  return fetchApi('/history'); 
};

// 사용 가능한 분석 데이터 목록 조회
export const getAvailableData = () => {
  return fetchApi('/available-data');
};