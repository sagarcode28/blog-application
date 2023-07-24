import './App.css';
import CreatePost from './Pages/CreatePost';
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { UserContextProvider } from './UserContent';
import Header from './component/Header';
import Layout from './component/Layout';
import Post from './component/Post';
import PostPage from './Pages/PostPage';
import { Route, Router, Routes } from 'react-router-dom';
import EditPost from './Pages/EditPost';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={
            <IndexPage />
          } />
          <Route path='/login' element={
            <LoginPage />
          } />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage/>} />
          <Route path="/edit/:id" element={<EditPost/>} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
