import React, { useEffect, useState } from 'react'
import Post from '../component/Post'

function IndexPage() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/post').then(response => {
      response.json().then(posts => {
        console.log(posts);
        setPosts(posts);
      });
    });
  }, []);

    return (
      <>
        <div className='welcome'>
          <h1 className='user-welcome'>Welcome </h1>
        </div>
        {posts.length > 0 && posts.map(post => (
          <Post {...post} />
        ))}
      </>
    )
  }

export default IndexPage