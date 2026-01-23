FROM node:20-alpine

# ===== Base directory =====
WORKDIR /app

# ===== Backend setup =====
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# ===== Frontend setup =====
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# ===== Copy full source =====
COPY backend ./backend
COPY frontend ./frontend

# ===== Build frontend =====
RUN cd frontend && npm run build

# ===== Install serve for frontend =====
RUN npm install -g serve

# ===== Expose ports =====
EXPOSE 3000 5000

# ===== Start both FE & BE =====
CMD sh -c "\
  node backend/server.js & \
  serve -s frontend/build -l 3000 \
"

