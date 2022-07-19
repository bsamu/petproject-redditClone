# README.md

## Short procejt description

This is my petproject for the Full-Stack API developer exam.
The concept is pretty simple, I want to reproduce reddit with its functionalities. After the exam I will keep refining the code and give more functions.

To see the program working follow the upcoming steps or [click here](https://jellyfish-app-qjhwm.ondigitalocean.app/) to see the dockerized version.

## To start the program, follow this guide:

#### 1. step

clone the repository and open with vsc

#### 2. step

at the terminal:

```
cd backend
npm install
cd ..
cd frontend
npm install
cd ..
```

#### 3. step

create .env at the backend folder with the following data

```
PORT = 3000
APP_URL=
CONNECTION_STRING=

SECRET_KEY=

LOGFLARE_SOURCE_ID=
LOGFLARE_API_KEY=

GOOGLE_REDIRECT_URI = http://localhost:3000/callback/google
GOOGLE_CLIENT_ID =
GOOGLE_CLIENT_SECRET =
```

#### 4. step

create .env at the frontend folder with the following data

```
REACT_APP_REDDIT=domain
REACT_APP_GOOGLEBASEURL=https://accounts.google.com/o/oauth2/v2/auth
REACT_APP_CLIENT_ID=
```

#### 5. step

update app.config.js in frontend folder with your datas

#### 6. step

```
cd frontend
npm start
cd ..
cd backend
npm start
cd ..
```

To see the framework, [click here](https://www.figma.com/file/7MWbf0kSZyxNzL4d46tPyY/Reddit-clone?node-id=0%3A1)!

Enjoy! :innocent:
