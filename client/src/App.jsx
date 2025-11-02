import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import StoreManager from './components/store/StoreManager';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<AdminLogin />} />
        
        {/* Protected route, requires admin login */}
        <Route 
          path="/store"
          element={
            <PrivateRoute>
              <StoreManager />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
