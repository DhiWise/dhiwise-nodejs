# Server

To run: ```node app```

## About

Backend Service wil run on 3053 Port.

This backend service is used to store input to generate the code. Using the front-end You can add your custom Inputs and code will be generated According to your inputs.

- For Data Store, Memory-Db with Mongoose ORM is used.

- Eslint rules are used in Server as well as in Generated code.

- When you will call the generate api it will store the input file inside the input folder (server -> input) and code will be generated inside the output folder (server -> output).

## Folder Structure

```
  ├── app.js       - starting point of the application
  ├── assets
  ├── config
  │   ├── db.js    - contains api database connection
  ├── constants    - contains commonly used constants 
  ├── controllers               
  │   ├── web      - contains usecases call with dependency injection
  ├── models       - models of application
  ├── output       - generated code
  ├── repo         - classes of models
  ├── responses 
  ├── routes       - contains all the routes of application
  ├── usecase      - contains business logic
  └── util-service - conatins utility functions     
  ```

  - You can find the readme of generated code inside the generated code folder.
