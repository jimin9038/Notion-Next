# Note Taking App (Notion Clone)

## Introduction

This project is a note-taking and management app inspired by 'Notion' using Next.js and SQLite
Users can create, edit, and delete notes, with additional features including:

- **Text Formatting**: Markdown-based text formatting.
- **Profile Image**: Change user profile images.
- **Comments**: Add comments to notes.
- **Favorite and Pin**: Mark notes as favorites and pin them.
- **Theme/Font Change**: Switch app themes and fonts.
- **Table of Contents**: Automatically generate a table of contents for notes.

The app is built using Next.js for both frontend and backend, and it uses SQLite as the database.

---

## Project Setup

### Clone the Repository
```bash
git clone <repository_url>
cd <project_directory>
```

### Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Database Migration
```bash
npx prisma migrate dev
```

### Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to access the app.

---

## Core Features

### **User Authentication**

- Users can sign up or log in to create a personalized account.
- Authenticated users can create, manage, and organize their notes.

### **Note Management**

- **Create Notes**: Click the "New Note" button to add a new note.
- **Edit Notes**: Select an existing note to modify its title or content.
- **Delete Notes**: Remove notes as needed.

---

## Additional Features

### **Text Formatting**

- Supports Markdown for formatting (e.g., headings, bold, lists, tables).
- MDX is used to handle rich text formatting.

### **Profile Image**

- Users can upload and update their profile pictures, which are stored in the database.

### **Comments**

- Add and manage comments for notes.
- Comments are displayed in a collapsible sidebar for better organization.

### **Favorite and Pin**

- Mark notes as favorites, and pinned notes will appear at the top of the list for easy access.

### **Theme/Font Change**

- Users can toggle between light and dark themes.
- Choose from three different font styles (serif, sans-serif, monospace).

### **Table of Contents**

- Automatically generates a table of contents based on headings within a note.
- The table of contents is displayed in a dedicated sidebar.

---

## Project Structure

```
├── app/                # Next.js pages and core functionality
│   ├── _components/    # Reusable components
│   ├── actions.tsx     # Note-related actions
│   ├── auth.ts         # Authentication functions
│   ├── db.tsx          # SQLite database connection and queries
│   └── globals.css     # Global styles
├── components/         # UI components
│   └── ui/             # Specific UI-related components
├── lib/                # Utility functions
├── public/             # Static assets
├── prisma/             # Prisma schema and migrations
└── README.md           # Project documentation
```

---

## Database Schema

### **Users Table**

| Column     | Type      | Description                     |
|------------|-----------|---------------------------------|
| id         | INTEGER   | Primary key                    |
| username   | TEXT      | Unique username                |
| password   | TEXT      | User password (hashed)         |
| theme      | TEXT      | User theme preference (light/dark) |
| font       | TEXT      | User font preference (serif/sans-serif/monospace) |

### **Page Table**

| Column     | Type      | Description                     |
|------------|-----------|---------------------------------|
| id         | INTEGER   | Primary key                    |
| userId     | INTEGER   | Foreign key referencing Users  |
| title      | TEXT      | Note title                     |
| content    | TEXT      | Note content                   |
| pin        | BOOLEAN   | Whether the note is pinned     |

### **Comments Table**

| Column     | Type      | Description                     |
|------------|-----------|---------------------------------|
| id         | INTEGER   | Primary key                    |
| pageId     | INTEGER   | Foreign key referencing Pages  |
| content    | TEXT      | Comment content                |
| userId     | INTEGER   | Foreign key referencing Users  |

---

## Feature Implementation Details

- **Text Formatting**: MDX enables rich text formatting with Markdown syntax (e.g., headings, bold, lists).
- **Profile Image**: Allows users to upload and update profile pictures.
- **Comments**: Utilizes a `Comments` table to associate user comments with specific notes.
- **Favorite and Pin**: Notes can be marked as favorites, with a `pin` flag determining their order in the list.
- **Theme/Font Change**: User preferences for themes and fonts are stored in the database.
- **Table of Contents**: Automatically generates a TOC from note headings (e.g., H1, H2).

---

## License

This project is licensed under the MIT License.

