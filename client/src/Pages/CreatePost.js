import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';

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

function CreatePost() {

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(event) {

        event.preventDefault();
        
        const data = {
            title: title,
            summary: summary,
            content: content,
            file: files
        };

        console.log(data);

        const response = await fetch('http://localhost:8000/post', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <form onSubmit={createNewPost}>
            <input type='title' placeholder={'Title'} value={title} onChange={event => setTitle(event.target.value)} />

            <input type='summary' placeholder={'Summary'} value={summary} onChange={event => setSummary(event.target.value)} />

            <input type='text' placeholder={'Image Address'} value={files} onChange={event => setFiles(event.target.value)} />

            <ReactQuill value={content} modules={modules} formats={formats} onChange={newValue => setContent(newValue)} />

            <button style={{ margin: '5px 0' }}>create the Post</button>
        </form >
    );
}

export default CreatePost;