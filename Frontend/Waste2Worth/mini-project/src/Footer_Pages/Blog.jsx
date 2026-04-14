import React from 'react';
import "./blog.css";

function Blog() {
  return (
    <div className='blog-body'>
         <header>
        <h1>My Blog Page</h1>
    </header>

    <section className="blog-container">
        <div className="blog-card">
            <img src="https://source.unsplash.com/300x200/?nature" alt="Blog Image" />
            <h2>Blog Title 1</h2>
            <p>Short description of the blog post. This is a preview of the content.</p>
            <a href="#">Read More</a>
        </div>

        <div className="blog-card">
            <img src="https://source.unsplash.com/300x200/?technology" alt="Blog Image" />
            <h2>Blog Title 2</h2>
            <p>Short description of the blog post. This is a preview of the content.</p>
            <a href="#">Read More</a>
        </div>

        <div className="blog-card">
            <img src="https://source.unsplash.com/300x200/?travel" alt="Blog Image" />
            <h2>Blog Title 3</h2>
            <p>Short description of the blog post. This is a preview of the content.</p>
            <a href="#">Read More</a>
        </div>

        <div className="blog-card">
            <img src="https://source.unsplash.com/300x200/?food" alt="Blog Image" />
            <h2>Blog Title 4</h2>
            <p>Short description of the blog post. This is a preview of the content.</p>
            <a href="#">Read More</a>
        </div>

        <div className="blog-card">
            <img src="https://source.unsplash.com/300x200/?food" alt="Blog Image" />
            <h2>Blog Title 4</h2>
            <p>Short description of the blog post. This is a preview of the content.</p>
            <a href="#">Read More</a>
        </div>

        <div className="blog-card">
            <img src="https://source.unsplash.com/300x200/?food" alt="Blog Image" />
            <h2>Blog Title 4</h2>
            <p>Short description of the blog post. This is a preview of the content.</p>
            <a href="#">Read More</a>
        </div>

        <div className="blog-card">
            <img src="https://source.unsplash.com/300x200/?food" alt="Blog Image" />
            <h2>Blog Title 4</h2>
            <p>Short description of the blog post. This is a preview of the content.</p>
            <a href="#">Read More</a>
        </div>

        <div className="blog-card">
            <img src="https://source.unsplash.com/300x200/?food" alt="Blog Image" />
            <h2>Blog Title 4</h2>
            <p>Short description of the blog post. This is a preview of the content.</p>
            <a href="#">Read More</a>
        </div>
    </section>
    </div>
  )
}

export default Blog;