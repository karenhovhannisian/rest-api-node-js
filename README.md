# Test Task

## Getting Started

Project is written in Node + Express using the following useful libs:
* express-validator
* jsonwebtoken
* lodash
* mongoose

### Installation

Go to project directory and install dependencies.

```
npm i
```

### Install nodemon and babel cli globally
npm i -g nodemon
npm i -g babel-cli

### Run in development mode

```
npm start
```
### Run in production mode

```
npm run start-prod
```

### Administrator user credentials
email:  admin@admin.com
password: adminpassword

### Usage
Project supports login, signup endpoints along with user related endpoints (CRUD).
There is default admin user which can be used to get all users, create new one. 
The common user(not admin) can just get his own information, delete or update his profile data.
Admin user can use all endpoints without any permission issue.
Access token should be set in `Authorization` header along with `Bearer`. So it will look like this:
`Authorization`:   `Bearer {TOKEN}`

### Additional information
In project root folder your can find .json file called `testApi.postman_collection.json`, this can be used  to import into postman and see ready endpoints, where you can just change values only and you will not have to write all kind of endpoints manually. Also for security reasons I have added additional password check on some endpoints. For example if user wants to delete his account, he should also send his own password within DELETE request.	`
