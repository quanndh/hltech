FROM node:16 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./wait-for-it.sh

RUN npm run build

RUN git clone https://github.com/vishnubob/wait-for-it.git

CMD [ "node", "dist/main.js" ]