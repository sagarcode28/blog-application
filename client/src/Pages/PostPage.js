import { formatISO9075 } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../UserContent';
import { Navigate } from 'react-router-dom';

function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          setPostInfo(postInfo);
        });
      });
  }, [])

  async function deletePost() {
    await fetch(`http://localhost:8000/deletePost/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    setRedirect(true);
  }

if (!postInfo) return '';

if (redirect) {
  return <Navigate to={'/'} />
}

return (
  <div className='post-page'>
    <h1>{postInfo.title}</h1>
    <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
    <div className='author'>by {postInfo.author.username}</div>
    {userInfo.id == postInfo.author._id && (
      <div className='edit-row'>
        <Link className="edit-btn" to={`/edit/${postInfo._id}`}>Edit this Post</Link>
        <Link className="edit-btn" onClick={deletePost}>Delete this Post</Link>
      </div>
    )}
    <div className="image">
      <img src={postInfo.file} alt="post_image" />
    </div>
    <div className='content' dangerouslySetInnerHTML={{ __html: postInfo.content }} />
  </div>
)
}

export default PostPage