# Hotel Guest Management System

## Project Overview

The **Hotel Guest Management System** is a simplified module for managing guest information in a hotel. The system enables hotel staff to:

- View the guest list
- Add new guests
- Edit guest details
- Delete guests

All CRUD operations are powered by **PocketBase** as the backend. The frontend is built with **React + TypeScript**, using **Vite** as the build tool and styled with **Tailwind CSS**.

---

## Project Structure

```
hotel-guest-management/
├── client/   # React frontend
├── server/   # PocketBase backend
└── README.md
```

---

## Versions Used

- **Node.js:** v20.6.1
- **npm:** v10.6.1
- **React:** v18.3.0
- **Vite:** v5.0.0
- **Tailwind CSS:** v4.1.13
- **PocketBase:** v0.13.9
- **TypeScript:** v5.2.2

---

## Backend Setup (PocketBase on Windows)

1. Open a terminal and navigate to the `server` folder:

```powershell
cd hotel-guest-management\server
```

2. Run PocketBase:

```powershell
pocketbase.exe serve
```

PocketBase will start on **port 8090**. Access the admin UI at:

```
http://127.0.0.1:8090/_/
```

**Admin Credentials:**

- Email: [rivindupeshara11@gmail.com]
- Password: -Akidora777

---

## Frontend Setup (React + TypeScript + Vite + Tailwind)

1. Open a new terminal and navigate to the `client` folder:

```powershell
cd hotel-guest-management\client
```

2. Install dependencies:

```powershell
npm install
```

3. Start the development server:

```powershell
npm run dev
```

The frontend will start on **[http://localhost:5173](http://localhost:5173)**.

---

## Notes

- Make sure that the backend (PocketBase) is running before using the frontend.

## Screenshots

### Guest List
![Guest List]
<img width="1917" height="1030" alt="image" src="https://github.com/user-attachments/assets/62519a6f-c189-46c6-aa1e-c0ffcf48bc6a" />

### Add New Guest
![Add Guest Form]
<img width="1920" height="908" alt="image" src="https://github.com/user-attachments/assets/e4aa399b-fb82-4479-98ea-b4331d12b856" />

### Guest Detail / Edit
![Guest Detail]
<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/be5d9d9e-0913-4e1e-b7ed-0ff9b2892a70" />

