import React, { useEffect } from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams } from 'react-router-dom';


const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ]
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];

function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8000/post/' + id)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                    setFiles(postInfo.file);
                })
            })
    }, [])

    async function updatePost(event) {
        event.preventDefault();

        const data = {
            id : id,
            title: title,
            summary: summary,
            content: content,
            file: files
        };

        console.log(files);

        const response = await fetch('http://localhost:8000/post', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
    }


    if (redirect) {
        return <Navigate to={'/post/' + id} />
    }

    return (
        <form onSubmit={updatePost}>
            <input type='title' placeholder={'Title'} value={title} onChange={event => setTitle(event.target.value)} />

            <input type='summary' placeholder={'Summary'} value={summary} onChange={event => setSummary(event.target.value)} />

            <input type='url' value={files} placeholder={'Image Address'} onChange={event => setFiles(event.target.value)} />

            <ReactQuill value={content} modules={modules} formats={formats} onChange={newValue => setContent(newValue)} />

            <button style={{ margin: '5px 0' }}>Update the Post</button>
        </form >
    );
}

export default EditPost