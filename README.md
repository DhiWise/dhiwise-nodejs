[![GitHub stars](https://img.shields.io/github/stars/DhiWise/nodejs-code-generator?style=flat-square&color=yellow)](https://github.com/DhiWise/nodejs-code-generator)
[![Issues](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square&color=66bb6a)](https://github.com/DhiWise/nodejs-code-generator/issues)

# Nodejs Code Generator
<p>
Node Code Generator accelerates your existing app development process and helps you build web apps instantly with production ready source code. With this package you can create configurable nodejs applications.
<br/>
</p>

## Table of contents

* [Get started](#get-started)

* [Folder Structure](#folder-structure)

* [Features](#features)

<br/>

## Get started 
After Successful run, A user can configure different settings using UI, and build an app to generate the code.
1. To run 
  ```npm i && npm run start```
2. With ```npm run start``` project will run on 3000 port.
3. APIs will run on 3053 port in the backend
4. After a Successful build, Generated code will resides inside the **packages/server/output** folder.


## Folder Structure
```
├── packages
│   ├── client -- UI
│   ├── server -- APIs cosumed from UI
```

## Development
Nodejs-code-generator is build using two packages, one is client and other is server. run ```npm i ``` to install all the dependencies from both the packages. 

## <a href="https://github.com/DhiWise/nodejs-code-generator/blob/master/packages/client/README.md">Client</a>
Client is the front end of the platform that provides you with an easy to use UI for building your next pro-code application. The client is based on React.

## <a href="https://github.com/DhiWise/nodejs-code-generator/blob/master/packages/server/README.md">Server</a>
Server packages holds the backend APIs that will process and store the user configuaration to build the procode nodejs application and generate the source code. server is build using technologies like nodejs, mongodb, mongoose and many more.

## Features of generated code
1. User Authentication and Authorization (using Passport)
2. Social Login APIs
3. CRUD APIs with middleware and Attribute selection
4. List API with pagination, populate and queries
5. Upload attachment API with size and mime-type validation (local and s3)
6. Role-Permission
8. Hooks and Indexes
9. Policy/middleware
10. Request body validator (using joi)
11. Standard error and response messages
12. Test cases
13. Postman collection and API documentation
15. Constants
17. Environment Variables for development, qa and production
18. Custom Routes
19. Multiple Platform selection and User type Configuration
20. MVC and Clean-code Architecuture 

### Supported Databases
1. MongoDB
2. SQL Server
3. MYSQL
4. PosgreSQL

## Contribution

Have you found a bug :lady_beetle: ? Or maybe you have a nice feature 💡 to contribute ? The <a href="https://github.com/DhiWise/nodejs-code-generator/blob/master/CONTRIBUTING.md">Contribution guide </a> will help you get your development environment ready in minutes.

## Support
If you have problems or questions go to our Discord channel, we will then try to help you asap:
https://discord.gg/hTuNauNjyJ
