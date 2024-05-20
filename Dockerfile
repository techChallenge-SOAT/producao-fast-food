FROM node:latest

WORKDIR /app
COPY package*.json tsconfig.json /app/
RUN npm install --ignore-scripts
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
