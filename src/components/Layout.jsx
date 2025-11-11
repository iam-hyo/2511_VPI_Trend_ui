// /src/components/Layout.jsx
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <nav className="main-nav">
        <h1>트렌드 분석기</h1>
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          대시보드
        </NavLink>
        <NavLink 
          to="/search" 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          검색
        </NavLink>
        <NavLink 
          to="/history"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          히스토리
        </NavLink>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
}