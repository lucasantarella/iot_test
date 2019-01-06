FROM resin/raspberrypi3-node:8
WORKDIR /usr/src/app
COPY package.json package.json
RUN JOBS=MAX npm install --production --unsafe-perm
COPY . ./
ENV INITSYSTEM on
CMD ["npm", "start"]
