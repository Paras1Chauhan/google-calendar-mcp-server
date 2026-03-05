FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY dist/ ./dist/
EXPOSE 3000
ENV TRANSPORT=http
CMD ["node", "dist/index.js"]
