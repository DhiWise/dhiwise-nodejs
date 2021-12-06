# NodeJS,Express Project in Clean-Code Architecture with Mongoose/Sequelize

**supported version of nodejs > 12**,
**supported version of mongoose-4.0**,
**supported version of sequelize-6.6.5**

## About 
- This is a Node application, developed in Clean-code architecture with Node.js, ExpressJS.

## How to run
1. ```$ npm install```
2. ```$ npm start```

## Folder structure:
```
  ├── app.js              - starting point of the application
  ├── config			        - application configuration files
  ├── constants           - contains commonly used constants 
  ├── controller          - contains business logic 
  ├── entity              - entity of models
  ├── helper              - helper files
  ├── model       		    - models of application (DB schema files)
  ├── postman      		    - API documentation - postman collection files
  ├── routes       		    - contains all the routes of application
  ├── services     		    - contains commonly used services
  ├── views        		    - templates
  ├── utils        		    - contains utility functions   
  └── validation          - contains validations 
```

### Detail Description of Files and folders

1. app.js
- entry point of application.

2. config
- passport strategy files
- database connection files

3. constants
- constants used across application.

4. controller
- Controller files that contains Business logic
```
	├── controller               
      └── platform
			├── <model>.js  - contains business logic
			└── index.js  - contains dependency injection
```

5. entity
- These are the business objects of your application. These should not be affected by any change external to them, and these should be the most stable code within your application. 
These can be POJOs, objects with methods, or even data structures.

6. helpers
- helper function, used to assist in providing some functionality, which isn't the main goal of the application or class in which they are used.

7. middleware
- Middleware files for authentication, authorization and role-access.

8. models
- Database models 

9. postman
- Postman collection of APIs (Import this JSON in Postman to run the APIs)

10. public 
- Assets used in application

11. routes
```
	├── routes
		├── platform
			├── <model>Routes.js   - contains CRUD operation routes
			└── index.js               - exports model Routes
		└── index.js                 - exports platform routes

```
- index.js file, exports platform routes, imported into app.js to access all the routes.

12. services
```
	├── services
		├── jobs                     - cron jobs
		├── dbService.js             - Database service
		└── auth.js                  - Authentication module service

```

13. utils
```
	├── utils
		├── messages.js              - Messages used in sending response 
		├── responseCode.js          - response codes 
		└── validateRequest.js       - validate request based on model schema

```

14. validation
- Joi validations files for every model

15. env files
- You can add credentials and port, database values as per your environment(Development/Production).
- If you are running test environment then test cases will run using test database,and its configuration is there inside app.js

