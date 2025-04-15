# WI2024-Team9  
**Extracurricular Assistant: AI-Powered Tool for Under-Resourced Schools**  

## Overview  
The **Extracurricular Assistant** is an AI-powered platform designed to empower Teach For India (TFI) fellows in conducting structured and engaging extracurricular activities in under-resourced schools. The tool addresses challenges such as limited resources, lack of outdoor space, and the need for instructional support by providing resource-conscious lesson plans, video-based guidance, and customized activity suggestions.  

The platform helps teachers organize students into groups, manage activities, and track student progress, fostering creativity and problem-solving skills in students.  

---

## Features  
- **Dashboard:** Displays extracurricular activity images, a clock, and a calendar for activity scheduling.  
- **Lessons Management:**  
  - Add activities for students with details like activity name, class standard, date, and duration.  
  - Split students into teams for activities.  
- **Feedback System:** Provide marks and feedback for students based on their performance.  
- **Student Management:** Add, edit, delete, and promote students across different class standards.  
- **Classroom Organization:** View and manage students in a classroom setting.  
- **Analytics Dashboard:** Track and analyze student performance across different standards.  
- **Chatbot:** AI-powered chatbot to suggest extracurricular activities.  
- **Timer & Calendar:** Tools to manage activity duration and schedule.  

---

## Tech Stack  
- **Frontend:** Vite React, Tailwind CSS  
- **Backend:** Express.js  
- **Database:** MongoDB  

---

## Prerequisites  
Before running the project, ensure you have the following installed:  
- Node.js  
- MongoDB  
- Git  

---

## Installation  
1. **Clone the Repository**  
   ```bash  
   git clone https://github.com/RCTS-K-Hub/WI2024-Team9.git  
   cd WI2024-Team9  
   ```  

2. **Set Up the Backend**  
   Navigate to the backend directory and install dependencies:  
   ```bash  
   cd backend  
   npm install  
   ```  

   Create a `.env` file in the `backend` directory and add the following environment variables:  
   ```env  
   MONGO_URI="your_mongodb_connection_string"  
   PORT=5000  
   ```  

   Start the backend server:  
   ```bash  
   node server.js  
   ```  
   The backend will be available at: `http://localhost:5001`  

3. **Set Up the Frontend**  
   Navigate to the frontend directory and install dependencies:  
   ```bash  
   cd frontend  
   npm install  
   ```  

   Start the frontend development server:  
   ```bash  
   npm run dev  
   ```  
   The frontend will be available at: `http://localhost:3000`  

---

## Usage  
1. **Signup/Login:**  
   - Teachers can sign up and log in using their email and OTP.  
   - After logging in, they are directed to the dashboard.  

2. **Dashboard:**  
   - View extracurricular activity images, a clock, and a calendar for scheduling.  

3. **Lessons Page:**  
   - Add activities for students with details like activity name, class standard, date, and duration.  
   - Split students into teams for activities.  

4. **Feedback Page:**  
   - Provide marks and feedback for students based on their performance.  

5. **Add Students Page:**  
   - Add, edit, delete, and promote students across different class standards.  

6. **Classroom Page:**  
   - View and manage students in a classroom setting.  

7. **Analytics Page:**  
   - Track and analyze student performance across different standards.  

8. **Chat Page:**  
   - Use the AI-powered chatbot to get suggestions for extracurricular activities.  

---

## Bug Documentation  
- **Solved Bugs:** [List of solved bugs](https://github.com/RCTS-K-Hub/WI2024-Team9/issues?q=is%3Aissue%20state%3Aclosed)  
- **Pending Bugs:**  
  - Only single-user functionality is supported; multiple users cannot use the platform simultaneously.  

---

## Newly Added Features  
- Timer  
- Calendar  
- Classroom Management  
- Student Analytics  

---

## GitHub Repository Link  
[WI2024-Team9 Repository](https://github.com/RCTS-K-Hub/WI2024-Team9)  

---

## Team Members  
- N Uday Kumar  
- S Mohan  



This `README.md` provides a comprehensive guide to the **Extracurricular Assistant** project, including its features, installation steps, usage, and team details. It is designed to help users and developers understand and set up the project efficiently.
