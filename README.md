<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  
  <h1>🎓 Academic Report Generator</h1>
  <p><strong>A powerful, full-stack application designed to streamline the creation, management, and export of academic reports with high-fidelity document processing.</strong></p>

  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
  [![Version](https://img.shields.io/badge/version-1.0.0-blue)](#)
  [![License](https://img.shields.io/badge/license-ISC-lightgrey)](#)
</div>

---

## 🌟 Overview

**Academic Report Generator** solves the tedious process of formatting and generating academic reports by automating the pipeline. With a blazing fast React frontend and a robust Node/Express backend, it offers seamless file uploads, rich document manipulation (generating both `.pdf` and `.docx`), and dynamic image processing capabilities. 

## ✨ Key Features

- 📄 **Rich Document Processing**: Generate, format, and manipulate `.docx` and `.pdf` files dynamically using `docx` and `pdfkit`.
- 🖼️ **Advanced Image Handling**: High-performance image processing using `sharp` and PDF parsing using `pdf-poppler`.
- ⚡ **Modern Frontend Engine**: Blazing fast UI powered by **React 19** and **Vite**, offering an incredibly smooth user experience.
- ⚙️ **Robust Backend API**: Secure and scalable REST API built on **Node.js** and **Express 5**.
- 🗄️ **Database Integration**: Seamless data persistence and querying utilizing **MySQL2**.
- 📁 **File Uploads**: Efficient multipart handling via `multer` for robust document and image uploads.

## 🛠️ Technology Stack

### Frontend 💻
- **Core**: React 19
- **Build Tool**: Vite (powered by Rolldown)
- **Linting**: ESLint 9 for pristine code quality

### Backend ⚙️
- **Server**: Node.js, Express 5.2.1
- **Database**: MySQL2
- **Document Gen**: pdfkit, docx
- **Image/PDF Processing**: sharp, pdf-poppler
- **Middleware**: cors, multer, dotenv

## 🚀 Quick Start

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AryaKSuryavanshi25/academic-report-generator.git
   cd academic-report-generator
   ```

2. **Backend Setup**
   Configure your environment variables and start the server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   Spin up the lightning-fast Vite development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🤝 Contributing

Contributions, issues, and feature requests are highly encouraged and welcome! Feel free to check the [issues page](#) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the ISC License. See `LICENSE` for more information.

---
<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/AryaKSuryavanshi25">AryaKSuryavanshi25</a></sub>
</div>
