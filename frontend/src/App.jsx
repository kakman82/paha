import { Routes, Route, useNavigate } from 'react-router-dom';
import PrivateRoute from './components/layout/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import Layout from './components/layout/Layout';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import { useSelector } from 'react-redux';
import ResetPassword from './pages/auth/ResetPassword';
import AddTransaction from './pages/AddTransaction';
import Definitions from './pages/Definitions';
import Expenses from './pages/Expenses';
import EditTransaction from './pages/EditTransaction';
import { useToast } from '@chakra-ui/react';
import 'core-js/stable/atob';

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const toast = useToast();

  return (
    <>
      {userInfo?.isVerified && <Navbar />}
      <Routes>
        {/* General route Layout covers every routes */}
        <Route path='/' element={<Layout />}>
          {/* Public Routes */}
          <Route path='/auth/login' element={<Login />} />
          <Route path='/auth/register' element={<Register />} />
          <Route path='/auth/verify-email' element={<VerifyEmail />} />
          <Route path='/auth/forgot-password' element={<ForgotPassword />} />
          <Route path='/auth/reset-password' element={<ResetPassword />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route
              path='/expense/add-transaction'
              element={<AddTransaction />}
            />
            <Route
              path='/expense/edit-transaction/:id'
              element={<EditTransaction />}
            />
            <Route path='/expenses' element={<Expenses />} />
            <Route path='/definitions' element={<Definitions />} />
            <Route path='/user/profile' element={<Profile />} />
          </Route>

          {/* Catch all */}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
      {userInfo?.isVerified && <Footer />}
    </>
  );
}

export default App;
