import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import AccountList from './pages/AccountList';
import Dashboard from './pages/Dashboard';
import Match from './pages/Match';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ClientList from './pages/ClientList';
import ResultList from './pages/Result';
import Register from './pages/Register';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'acc_management', element: <AccountList matchmode={'openrank'}/> },
      { path: 'acc_management/openrank', element: <AccountList matchmode={'openrank'}/> },
      { path: 'acc_management/onlylose', element: <AccountList matchmode={'onlylose'}/> },
      { path: 'acc_management/level', element: <AccountList matchmode={'level'}/> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'client', element: <ClientList /> },
      { path: 'result', element: <ResultList matchmode={'openrank'} /> },
      { path: 'result/openrank', element: <ResultList matchmode={'openrank'} /> },
      { path: 'result/onlylose', element: <ResultList matchmode={'onlylose'} /> },
      { path: 'result/level', element: <ResultList matchmode={'level'} /> },
      { path: 'match', element: <Match /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
