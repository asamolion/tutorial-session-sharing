# tutorial-session-sharing

Session sharing / SSO tutorial between a Flask app and an Express.js app

**NOTE:** The code in this repo is just a sample application which is not production ready. You can contact me at [https://alazierplace.com/contact-us/](https://alazierplace.com/contact-us/) if you wish to build a complete production ready solution.

# Related blog post:

[https://alazierplace.com/2019/05/session-sharing-how-login-state-is-shared-between-systems/](https://alazierplace.com/2019/05/session-sharing-how-login-state-is-shared-between-systems/)

# How to run

## Node App

Run the following commands from the root of the repo to run the node application.

```
cd node-app
npm install
npm run start
```

The app server will be listening on `http://localhost:3000`

## Python App

Run the following commands from the root of the repo to run the Python app

```
cd python-app
pip install -r requirements.txt # make sure your python virtualenv is loaded
flask run
```

The app server will be listening on `http://localhost:5000`
