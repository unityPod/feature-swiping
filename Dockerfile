FROM node:18-alpine
WORKDIR /src
COPY . .
RUN npm install && npm install -g typescript
EXPOSE 3000
RUN tsc 
RUN npx tailwindcss -i ./client/app.css -o ./client/style.css
CMD node src/index.js

