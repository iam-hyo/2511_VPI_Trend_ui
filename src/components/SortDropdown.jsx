// /src/components/SortDropdown.jsx
export default function SortDropdown({ sort, setSort }) {
  
  const handleSortChange = (e) => {
    setSort(prev => ({ ...prev, sortBy: e.target.value }));
  };

  const handleOrderChange = (e) => {
    setSort(prev => ({ ...prev, order: e.target.value }));
  };

  return (
    <div className="sort-controls">
      <select value={sort.sortBy} onChange={handleSortChange}>
        <option value="vpi">VPI 점수순</option>
        <option value="view">조회수순</option>
        <option value="date">최신순</option>
      </select>
      <select value={sort.order} onChange={handleOrderChange}>
        <option value="desc">내림차순</option>
        <option value="asc">오름차순</option>
      </select>
    </div>
  );
}