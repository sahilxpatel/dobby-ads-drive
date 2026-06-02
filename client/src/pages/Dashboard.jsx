import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>My Drive</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <main style={{ padding: '2rem' }}>
        <p>Your folders and images will appear here (Phase 7).</p>
      </main>
    </div>
  );
};

export default Dashboard;
