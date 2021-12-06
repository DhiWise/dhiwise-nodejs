[![GitHub stars](https://img.shields.io/github/stars/DhiWise/nodejs-code-generator?style=flat-square&color=yellow)](https://github.com/DhiWise/nodejs-code-generator)
[![Issues](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square&color=66bb6a)](https://github.com/DhiWise/nodejs-code-generator/issues)

# Node.js Code Generator
<p>
Node.js code generator is a developer-centric platform to build backend CRUD APIs along with other essential features to boost developers' productivity time by twofold!

Developers just need to add their schema data to reduce their work related to models into a few simple configurations. Developers can also configure platforms , routes, role access, authentication & more for their application.

Most importantly, the Node.js code generator gives developers total code ownership. The code it generates is bug-free and easily customizable
</p>

## Table of contents

* [Get started](#get-started)

* [Supported Architectures](#supported-architectures)

* [Features](#features-of-generated-code)

* [Documentation](#documentation)

## Get started 
After a successful run, a user can configure different settings using UI, and build an app to generate the code.
1. To run 
  ```npm i && npm run start```
2. With ```npm run start``` project will run on 3000 port.
3. Run http://localhost:3000 and you will see "create application" form. After creating an application you can configure modules and build the app to get the source code.
<img src="https://development-dhvs.s3.ap-south-1.amazonaws.com/uploads/user-profile/open-source.gif" alt="create-application"/>
4. After a successful build, Generated code will resides inside the **packages/server/output** folder.

## Supported architectures

This project provides two architectures to choose from, while creating an application.
### <a href="https://github.com/DhiWise/nodejs-code-generator/blob/master/CLEAN_CODE.md">Clean Code</a>
The main rule of clean architecture is that code dependencies can only move from the outer levels inward. Code on the inner layers can have no knowledge of functions on the outer layers.

### <a href="https://github.com/DhiWise/nodejs-code-generator/blob/master/MVC_ARCHITECTURE.md">MVC - Model-View-Controller</a>
The Model-View-Controller (MVC) is an architectural pattern that separates an application into three main logical components: the model, the view, and the controller. Each of these components are built to handle specific development aspects of an application.

## Features of generated code
1. User Authentication and Authorization (using Passport)
2. Social Login APIs
3. CRUD APIs with middleware and attributes' selection
4. List API with pagination, populate and queries
5. Upload attachment API with validation and storage options like (Local server or S3 public/private bucket)
6. Role-Permission
8. Hooks and Indexes
9. Policy/middleware
10. API request body validation (Using joi)
11. API response with standard error and message pattern
12. Test cases
13. Postman collection and API documentation
15. Constants
17. Environment Variables for development, QA and production
18. Custom API setup
19. Multiple Platform selection and User type configuration
20. MVC and Clean-code architecture 
21. Supported Databases <br>
    a. MongoDB<br>
    b. SQL Server<br>
    c. MYSQL<br>
    d. PostgreSQL

## Documentation

Here's the Documentation of <a href="https://docs.dhiwise.com/knowledgehub/generated-node.js-apis">How you can use generated APIs</a>

## Contribution
Have you found a bug? :lady_beetle: <a href="https://github.com/DhiWise/nodejs-code-generator/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title=">Please report it here</a>
or have a nice feature 💡 to contribute? Add it <a href="https://github.com/DhiWise/nodejs-code-generator/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title="> here </a> 
<br/>
Our <a href="https://github.com/DhiWise/nodejs-code-generator/blob/master/CONTRIBUTING.md">Contribution guide </a> will help you how to contribute.

## Support
If you have problems or questions go to our Discord channel, we will then try to help you as quickly as possible: https://discord.gg/hTuNauNjyJ
