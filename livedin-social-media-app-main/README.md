# LivedIn Social Media Web

![logo](https://res.cloudinary.com/hywr5tm6a/image/upload/c_scale,w_200/v1671866225/livedin-no-background_n63bxc.png)

A social media web application with Google OAuth2 based on MERN (MongoDB, Express, React, Node) and Heroku.

## Demo Link

https://livedinapp.surge.sh

Try my site, and share your thoughts!

## Run In Local

Run backend:

```shell
cd backend
npm install
heroku addons:create cloudinary:starter-2 # create your Heroku instance before running this
heroku config # find the CLOUDINARY_URL
export CLOUDINARY_URL="cloudinary:// get value from heroku"
node index.js
```

Run frontend:

```shell
cd frontend
npm install
npm run start
```

Check the front end view on: `http://localhost:3000`

### Deploy with Heroku, Cloudinary, MongoDB Atlas, Google OAuth and Surge

Find the `config.json` in both frontend and backend, fill in with relevant url or client key.

Deploy backend on Heroku:

```shell
cd backend
heroku create [app name]
echo web: node index.js > Procfile
git add .
git commit -m “initial heroku commit”
heroku buildpacks:set heroku/nodejs -a [app name]
# push a part of codes to heroku
git subtree push --prefix backend heroku main
heroku ps:scale web=1
```

Deploy front end on Surge

```shell
cd frontend
npm run build
cd build
surge --domain [surge domain url]
```
