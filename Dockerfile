FROM node:18-alpine
WORKDIR /src
COPY . .
RUN npm install && npm install -g typescript
EXPOSE 3000
RUN npm run build
CMD node src/index.js

