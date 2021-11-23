# Node.JS,Express Project in MVC Architecture with Mongoose/Sequelize

**supported version of nodejs > 12**,
**supported version of mongoose-4.0**,
**supported version of sequelize-6.6.5**

## About 
- This is a Node application, developed using MVC pattern with Node.js, ExpressJS.

## Initial
1. ```$ npm install```
2. ```$ npm start```

## Folder structure:
```
  ├── app.js       - starting point of the application
  ├── config       - application configuration files
  ├── constants    - contains commonly used constants 
  ├── controller   - contains business logic
  ├── model        - models of application (DB schema files)
  ├── postman      - API documentation - postman collection files
  ├── routes       - contains all the routes of application
  ├── services     - contains commonly used services
  ├── views        - templates
  └── utils        - contains utility functions    
```

### Detail Description of Files and folders

1. app.js
- entry point of application.

2. config
- passport strategy files
- database connection files

3. constants
- constants used across application.

4. controllers
- Controller files that contains Business logic
```
	├── controller
		└── platform
			└── <model>Controller.js   - contains CRUD Operations
```

5. middleware
- Middleware files for authentication, authorization and role-access.

6. models
- Database models 

7. postman
- Postman collection of APIs (Import this JSON in Postman to run the APIs)

8. public 
- Assets used in application

9. routes
```
	├── routes
		├── platform
			├── <model>Routes.js  - contains CRUD operation routes
			└── index.js              - exports model Routes
		└── index.js                - exports platform routes

```
- index.js file, exports platform routes, imported into app.js to access all the routes.

10. services
```
	├── services
		├── jobs                     - cron jobs
		└── auth.js                  - Authentication module service

```

11. utils
```
	├── utils
		├── validations              - joi validations files for every model
		├── dbService.js             - Database functions 
		├── messages.js              - Messages used in sending response 
		├── responseCode.js          - response codes 
		└── validateRequest.js       - validate request based on model schema

```

12. env files
- You can add credentials, port, database-name etc as per your environment(Development/Production).
- If you are running test environment then test cases will run using test database,and its configuration is there inside app.js
