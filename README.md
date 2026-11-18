# QueueLess — Smart Campus Queue Management System

QueueLess eliminates physical waiting lines across campus service counters (College Office, Canteen, Library, Accounts Section, and Lab Equipment) with real-time ticket generation, wait-time prediction, crowd indicators, and staff counter controls.

## Features

- **Student Portal:** Join open queues, receive sequential counter tickets (`A001`, `B001`, etc.), track live queue position, view estimated wait times, and get smart alternative counter recommendations.
- **Staff Portal:** View live system statistics, call next waiting students, mark active services completed, and open/close counters dynamically.
- **Wait-Time Prediction & Crowd Engine:** Calculates wait times from live queue depth and average service duration, classifying crowd levels (`Low`, `Moderate`, `High`).
- **Persistent State:** Automatically saves queue and ticket states to `localStorage` across page reloads.

## Tech Stack

- **Frontend:** React (Vite), Lucide React Icons
- **State & Logic:** Custom React Hooks (`useQueues`), modular prediction & queue helper utilities

## Getting Started

```bash
npm install
npm run dev
```
