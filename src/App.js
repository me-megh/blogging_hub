import React from 'react';
import { Routes, Route} from 'react-router-dom'; // No need to import Router here
import Home from './components/home';
import RegisterForm from './components/registerForm';
import LoginForm from './components/LoginForm';
import Profile from './components/profile';
import CreateBlog from "./components/createBlog";
import EditBlog from "./components/editBlog";
import BlogList from "./components/blogList";
import Login from "./components/LoginForm";
import BlogPostDetail from './components/BlogPostDetail'; 
// import StudyBlog from './StudyBlog';
// import MotivationalBlog from './MotivationalBlog';
// import TravelBlog from './TravelBlog';

function App() {
  return (
    <>
    
      {/* <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="#">Study Blog</Link>
          </li>
          <li>
            <Link to="#">Motivational Blog</Link>
          </li>
          <li>
            <Link to="#">Travel Blog</Link>
          </li>
        </ul>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registerForm" element={<RegisterForm/>}/>
        <Route path="/loginForm" element={<LoginForm/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route exact path="/create" element={<CreateBlog/>} />
        <Route exact path="/edit/:id" element={<EditBlog/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/blogs" element={<BlogList/>} />
        <Route path="/blog/:id" element={<BlogPostDetail />} /> 
        {/* <Route path="/study" element={<StudyBlog />} />
        <Route path="/motivational" element={<MotivationalBlog />} />
        <Route path="/travel" element={<TravelBlog />} /> */}
      </Routes>
    </>
  );
}

export default App;