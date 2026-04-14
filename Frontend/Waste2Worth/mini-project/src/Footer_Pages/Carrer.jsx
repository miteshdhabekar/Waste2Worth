import React from 'react';
import "./carrer.css";

function Carrer() {
  return (
    <div>
        <header>
        <h1>Join Our Mission</h1>
        <p>Be a part of our team and help us fight hunger!</p>
    </header>

    <section className="career-container">
        <div className="career-card">
            <img src="https://source.unsplash.com/300x200/?volunteer,help" alt="Job Image" />
            <h2>Volunteer Coordinator</h2>
            <p><strong>Location:</strong> Multiple Cities</p>
            <p><strong>Experience:</strong> 1+ years</p>
            <p>Help organize and manage our volunteers for food distribution programs.</p>
            <a href="#">Apply Now</a>
        </div>

        <div className="career-card">
            <img src="https://source.unsplash.com/300x200/?food,charity" alt="Job Image" />
            <h2>Food Program Manager</h2>
            <p><strong>Location:</strong> Remote / On-site</p>
            <p><strong>Experience:</strong> 3+ years</p>
            <p>Manage food donation programs and coordinate with donors and recipients.</p>
            <a href="#">Apply Now</a>
        </div>

        <div className="career-card">
            <img src="https://source.unsplash.com/300x200/?teamwork,ngo" alt="Job Image" />
            <h2>Community Outreach Officer</h2>
            <p><strong>Location:</strong> Various Locations</p>
            <p><strong>Experience:</strong> 2+ years</p>
            <p>Engage with local communities and create awareness about our initiatives.</p>
            <a href="#">Apply Now</a>
        </div>

        <div className="career-card">
            <img src="https://source.unsplash.com/300x200/?fundraising,donation" alt="Job Image" />
            <h2>Fundraising Specialist</h2>
            <p><strong>Location:</strong> Remote</p>
            <p><strong>Experience:</strong> 4+ years</p>
            <p>Develop fundraising strategies and secure grants to support our cause.</p>
            <a href="#">Apply Now</a>
        </div>
    </section>
    </div>
  )
}

export default Carrer