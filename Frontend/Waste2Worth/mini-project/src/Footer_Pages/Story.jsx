import React from 'react'
import "./story.css";

function Story() {
  return (
    <div>
        <header>
        <h1>Our Story</h1>
        <p>How we started, our mission, and the impact we&#39;re making.</p>
    </header>

    <section className="story-section">
        <div className="story-image">
            <img src="https://source.unsplash.com/600x400/?food,helping" alt="Helping hands" />
        </div>
        <div className="story-content">
            <h2>Our Journey</h2>
            <p>It all started with a simple yet powerful idea—no one should go hungry. 
                Founded in 2015, our food donation organization began as a small community initiative. 
                Over the years, we have partnered with restaurants, farmers, and individuals 
                to rescue surplus food and distribute it to those in need.</p>
        </div>
    </section>

    <section className="mission-vision">
        <div className="story-mission">
            <h2>Our Mission</h2>
            <p>To eliminate food waste and fight hunger by distributing nutritious meals to communities in need.</p>
        </div>
        <div className="vision">
            <h2>Our Vision</h2>
            <p>A world where no one sleeps hungry and where food surplus is effectively utilized.</p>
        </div>
    </section>

    <section className="cta-section">
        <h2>Join Us in Making a Difference</h2>
        <p>Your support can help feed thousands. Be a part of the change today.</p>
        <a href="#" className="cta-button">Donate Now</a>
        <a href="#" className="cta-button volunteer">Become a Volunteer</a>
    </section>
    </div>
  )
}

export default Story