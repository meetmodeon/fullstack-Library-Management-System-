const fs = require('fs');
const path = require('path');

// Function to generate Markdown for images in a folder
function generateImageMarkdown(folderPath, label) {
    if (!fs.existsSync(folderPath)) return '';

    const files = fs.readdirSync(folderPath)
        .filter(file => /\.(png|jpe?g|gif|svg)$/i.test(file)); // only image files

    if (files.length === 0) return '';

    let md = `### ${label}\n\n`;

    files.forEach(file => {
        // Rename file to remove spaces
        const newFileName = file.replace(/ /g, '_');
        const oldPath = path.join(folderPath, file);
        const newPath = path.join(folderPath, newFileName);
        if (file !== newFileName) {
            fs.renameSync(oldPath, newPath);
        }

        const relativePath = path.relative('D:/LBM', newPath).replace(/\\/g, '/');
        md += `![${label}](${relativePath})\n\n`;
    });

    return md;
}


// Ensure folders exist
const adminFolder = 'D:/LBM/docs/images/admin';
const userFolder = 'D:/LBM/docs/images/user';
fs.mkdirSync(adminFolder, { recursive: true });
fs.mkdirSync(userFolder, { recursive: true });

// Generate README content
const content = `
# 📚 LBM Library Management System

A full-stack Library Management System built with Angular and Spring Boot.

---

## 🅰️ Frontend (Angular)

### Tech Stack
- Angular
- TypeScript
- SCSS
- Docker + Nginx

### Run Development
\`\`\`
npm install
ng serve
\`\`\`

Open: [http://localhost:4200](http://localhost:4200)

### Auto Documentation
Generate docs: \`npm run docs\`  
Serve docs: \`npm run docs:serve\`  
Open: [http://localhost:4300](http://localhost:4300)

### Screenshots

${generateImageMarkdown(adminFolder, 'admin', 'Admin Dashboard')}
${generateImageMarkdown(userFolder, 'user', 'User Dashboard')}

---

## ☕ Backend (Spring Boot)

### Tech Stack
- Spring Boot
- Spring Security
- MySQL
- Docker

### Run Backend
[http://localhost:8080](http://localhost:8080)

### API Documentation (Swagger)
[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 🐳 Docker Full System

Run all services: \`docker-compose up -d\`  

Frontend: [http://localhost:4200](http://localhost:4200)  
Backend API: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)

---

## 👤 Author

Sharwan Mahato  
Full Stack Java + Angular Developer  
Nepal 🇳🇵
`;

// Write README.md to project root
fs.writeFileSync('D:/LBM/README.md', content.trim());
console.log("✅ README.md generated successfully with all images!");
