import { useUsers } from './features/users/hooks/useUsers';
import { usePing } from './features/dashboard/hooks/usePing';

function App() {
  const { data: healthStatus, isLoading: healthIsLoading, error: healthError } = usePing();

  const { data: userList, isLoading: usersIsLoading, error: usersError } = useUsers();

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>MERN + Turborepo Client</h1>

      <section>
        <h2>Status</h2>
        <p>
          <span>
            Backend Status:
          </span>
          &nbsp;
          <strong>
            {healthIsLoading ? 'Loading...' : healthError ? 'Error' : healthStatus}
          </strong>
        </p>
      </section>

      <section>
        <h2>Users</h2>
        {usersIsLoading ? (
          <p>Loading users...</p>
        ) : usersError ? (
          <p>Error loading users</p>
        ) : (
          <ul>
            {userList?.map((user) => (
              <li key={user.id}>
                {user.username} ({user.email})
              </li>
            ))}
            {userList?.length === 0 && <p>No users found.</p>}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;

