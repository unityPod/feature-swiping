FROM node:18-alpine
WORKDIR /src
COPY . .
RUN npm install && npm install -g typescript
EXPOSE 3000
RUN tsc 
CMD node src/index.js
