<h1 align="center">♻️ Waste2Worth</h1>
<p align="center">
  <b>A Food Waste Management Platform</b><br/>
  Connecting food donors with NGOs to turn waste into worth.
</p>


---

## 📌 About the Project

> "Waste2Worth" is a full-stack food donation platform that bridges the gap between **food donors**, **NGOs**, and **admins**. The goal is to reduce food waste by making it easy to donate surplus food and help those in need.

---

## 🚀 Features

- 🧍 User, NGO, and Admin roles with redirection
- 📦 Real-time donation submission and status updates
- 🗺️ Map-based location selection (Leaflet.js)
- 🖼️ Image uploads with previews
- ✅ NGO approval system with email notifications
- 📧 Automated emails on registration, approval, and donation status
- 📊 Clean and responsive UI built with React

---

## 🧠 Tech Stack

| Frontend   | Backend         | Database  | Tools/Libs        |
|------------|------------------|-----------|--------------------|
| React (Vite) | Spring Boot (Java) | MySQL/PostgreSQL | Leaflet.js, Email API, GitHub |

---

## 🧭 Project Structure



Waste2Worth/
├── Backend/
│ └── project/ # Spring Boot app
├── Frontend/
│ └── Waste2Worth/
│ └── mini-project/ # React frontend
└── README.md



---

## ⚙️ Setup Instructions

### 🔧 Backend (Spring Boot)
1. Navigate to `Backend/project`
2. Open in your IDE (e.g., IntelliJ or Eclipse)
3. Run the `ProjectApplication.java` file
4. Ensure database is set up & connected in `application.properties`

### 💻 Frontend (React)
1. Navigate to `Frontend/Waste2Worth/mini-project`
2. Run:
   ```bash
   npm install
   npm run dev
3.Open http://localhost:5173/ in your browser


## 🧪 Sample Credentials

| Role  | Email             | Password   |
|-------|-------------------|------------|
| User  | user@example.com  | user123    |
| NGO   | ngo@example.com   | ngo123     |
| Admin | admin@example.com | admin123   |

> 🔐 Note: Customize these in your database or registration logic.


📮 API Highlights
POST /register – Register a new user

POST /login – Authenticate and redirect based on role

GET /donations – Fetch all food donation requests

POST /donate – Submit food donation form

🧑‍💻 Contribution Guide
Fork the repo

Create your feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m 'Add feature')

Push to the branch (git push origin feature/YourFeature)

Open a Pull Request ✅

🙌 Support
If you like this project, consider ⭐ starring the repo and sharing it with others.
Feel free to open an issue for bugs or ideas.

📜 License
This project is licensed under the MIT License.
See the LICENSE file for details.

<p align="center"> Made with ❤️ by <a href="https://github.com/miteshdhabekar">Mitesh Dhabekar</a> </p> 

