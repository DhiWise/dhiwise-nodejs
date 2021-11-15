[![GitHub stars](https://img.shields.io/github/stars/DhiWise/nodejs-code-generator?style=flat-square&color=yellow)](https://github.com/DhiWise/nodejs-code-generator)
[![Issues](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square&color=66bb6a)](https://github.com/DhiWise/nodejs-code-generator/issues)

# Nodejs Code Generator
<p>
Node Code Generator is a Open-source package with Ui and APIs to Generate a Backend application using nodejs with different architectures and databases. 
<br/>
<a href="https://github.com/DhiWise/nodejs-code-generator/issues">Report Bug/Request Feature</a>
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

## Features
### Modules
1. Models along with template models, hooks, indexes, private attribute settings
2. CRUD APIs with middleware and Attribute selection
3. Constants
4. Policy
5. Environment Variables Setup
6. Role-Permission
7. Authentication
8. Custom Routes
9. Platform and User Configuration
10. File Upload
11. Rate Limit
12. Data Formatting on models
### About Generated Code
- ORMs Provided
  1. mongoose  - for noSQL Database
  2. sequelize - SQL Databases.
- Database Covered
  1. MongoDB
  2. MySQL
  3. PostgreSQL
  4. SQL server
- Architecture Covered
  1. MVC
  2. Clean-Code
