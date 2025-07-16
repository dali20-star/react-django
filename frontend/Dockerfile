FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Fix for React not binding correctly inside Docker
ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["npm", "start"]
