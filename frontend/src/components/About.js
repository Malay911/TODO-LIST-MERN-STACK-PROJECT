import React from 'react';
import './About.css';

function About() {
    return (
        <div className='about-container container-fluid p-5'>
            <h1 className='about-title text-center mb-5'>About Our MERN Stack TODO List App</h1>
            
            <section className="about-section">
                <h4 className="section-title">1. Project Overview:</h4>
                <p className="section-content">
                    Our app is designed to help users manage their tasks efficiently. Whether it’s work-related, personal, or just a simple grocery list, our goal is to make task organization a breeze. 
                    We follow the principles of CRUD (Create, Read, Update, Delete) operations to allow seamless task management.
                </p>
            </section>
            
            <section className="about-section">
                <h4 className="section-title">2. Features:</h4>
                <ul className="feature-list">
                    <li>Task Creation: Easily create new tasks, specifying details like due dates and priorities.</li>
                    <li>Task List: Displays a comprehensive list of all tasks, allowing users to view and manage them.</li>
                    <li>Task Deletion: Delete tasks that are no longer relevant or have been completed.</li>
                    <li>Task Editing: Modify task details such as due dates and priorities to keep your list updated.</li>
                </ul>
            </section>
            
            <section className="about-section">
                <h4 className="section-title">3. Technologies Used:</h4>
                <p className="section-content">
                    Our app is built using the MERN stack, which includes MongoDB for database management, Express.js for the backend, React.js for the frontend, and Node.js for server-side execution.
                </p>
            </section>
        </div>
    );
}

export default About;