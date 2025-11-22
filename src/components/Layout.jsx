// /src/components/Layout.jsx
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <nav className="main-nav">
        <div id="title"><h1>VPI</h1>Video performencce Indicator</div>
        <div id="PageTab">
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
        </div>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
}