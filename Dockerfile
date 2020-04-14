#FROM nginx:1.17-alpine

#RUN apk --no-cache add nodejs

# copy swagger files to the `/js` folder
#COPY ./dist/* /usr/share/nginx/html/

#RUN chmod -R a+rw /usr/share/nginx && \
#    chmod -R a+rw /etc/nginx && \
#    chmod -R a+rw /var && \
#    chmod -R a+rw /var/run

#EXPOSE 8080
#-----------------------------------------------------------
#FROM node:12.16.1-alpine as builder

#COPY package.json package-lock.json ./

#RUN npm install && mkdir /app-ui && mv ./node_modules ./app-ui

#WORKDIR /app-ui

#COPY . .

#RUN npm run ng build # -- --deploy-url=/envapp/ --prod


#FROM nginx:alpine

#RUN rm -rf /usr/share/nginx/html/*

#COPY --from=builder /app-ui/dist/digo /usr/share/nginx/html

#EXPOSE 4200 80

#ENTRYPOINT ["nginx", "-g", "daemon off;"]
#--------------------------------------------------------------------
#FROM node:12.16.1-alpine AS compile-image

#RUN npm install -g yarn

#WORKDIR /opt/ng
#COPY .npmrc package.json yarn.lock ./
#RUN yarn install

#ENV PATH="./node_modules/.bin:$PATH" 

#COPY . ./
#RUN ng build #--prod

#FROM nginx
#COPY --from=compile-image /opt/ng/dist/digo /usr/share/nginx/html
#-------------------------------------------------------------------
FROM node:12.16.1-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9

# add app
COPY . /app
EXPOSE 4200
# start app
CMD ng serve --host 0.0.0.0 --disable-host-check