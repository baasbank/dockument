# dockument
[![Build Status](https://travis-ci.org/baasbank/dockument.svg?branch=staging](https://travis-ci.org/baasbank/dockument)[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/codeclimate/codeclimate)[![Coverage Status](https://coveralls.io/repos/github/baasbank/dockument/badge.svg?branch=staging)](https://coveralls.io/github/baasbank/dockument?branch=staging)

## Introduction

Dockument API is a document management system API, complete with roles and privileges. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published. Users are categorized by roles. Each user must have a role defined for them. 


## Features of Dockument API

This API has the following features.

#### Authentication

* JSON Web Token (JWT) is used to authenticate users.
* The API creates a token everytime a user logs in.
* The user supplies the token created, which is verified by the API before the user can access certain protected endpoints.

#### Users

* New users can sign up.
* Signed up users can login and get an authentication token.
* Users can update their details e.g. Name, email, and password.
* An admin can get all users' data, change a user's role type, and delete a user.

#### Roles

* Every user must have a role defined for him/her (the default role is regular user).
* The admin can create, get all, update and delete roles.
* Restricts a non-admin from tampering with roles.

#### Documents

* Logged in users can create documents.
* All documents must have access type defined for them.
* Admin can view all users' documents that are not private.
* Users can view, update, and delete their documents.
* Users cannot update and/or delete other users' documents.

#### Search

* Users can search for and retrieve any document that is not private.
* An admin can search for and retrieve any user's information.

## Usage
Click [here](https://dockument.herokuapp.com) to access the application.
Or download or clone this repository and run it on your machine.

## For local installation & testing:

* If you don't have NodeJS already installed go [here](https://nodejs.org/en/) and install it.
* Clone this repository by running 
 * `git clone https://github.com/baasbank/dockument.git` on your terminal.
* Navigate into the cloned project directory.
 * For example, if you cloned the project into the desktop directory, then run `cd desktop` which takes you into the desktop, then `cd dockument` to enter the project directory.
* Once in the project directory, install all project dependencies by running `npm install`.
* Run the command `npm start:dev` to start the application.
* To run tests, run the command `npm run server-test`.

## Technologies

* [NodeJS:](https://nodejs.org/en/) is an open-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side.

* [es6(ECMAScript 2015):](https://en.wikipedia.org/wiki/ECMAScript) es6 is the sixth major release of the javascript language specification. It enables features like constants, arrow functions, template literals, etc.

* [Express:](https://expressjs.com/) Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

* [Postgres:](https://www.postgresql.org/about/) PostgreSQL is a powerful, open source object-relational database system. It is used to persist dockument API's data.

* [Babel:](https://babeljs.io/) Babel is used to transpile es6 down to es5. 

* [Sequelize:](http://sequelize.readthedocs.io/en/v3/) Sequelize is a promise-based Obect Relational Mapper (ORM) for Node.js and io.js.

* [Mocha:](https://mochajs.org/) Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha is the testing framework used to test the API's functionalities.  

## Resources

* [JSON Web Token (JWT):](https://jwt.io/introduction/) JWT is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. 

## Contributing
* Please read [here](https://github.com/baasbank/dockument/wiki/Contributing) for details on code of conduct, and the process for submitting pull requests to me.

* Fork this repository by clicking the `Fork` menu item in the top right corner of this repository.
* Go to your github account, and under your repository list, you should find this project listed.
* Open the project, click on the `clone or download` button, then copy the url that pops up.
* Open your terminal and run the command `git clone url` where `url` is the url from the previous step.
* Navigate into the cloned project directory.
 * For example, if you cloned the project into the desktop directory, then run `cd desktop` which takes you into the desktop, then `cd dockument` to enter the project directory.
* Once in the project directory, install all project dependencies by running `npm install`.
* Create your feature branch on your local machine by running `git checkout -b branchName`, where `branchName` is the name of your feature branch.
* Make your changes.
* Add your changes by running `git add filePath`, where `filePath` is path of the file(s) in which the change(s) were made.
* Commit your changes by running `git commit -m "commit message"`.
* Push your changes to your remote branch by running `git push origin branchName`.
* Open a pull request to the staging branch.


## Limitations

* Users cannot sign in through social authentication.
* There's no frontend.

## Author
* This project is authored by Baasbank Akinmuleya.

## License

* This project is licensed under the [MIT](LICENSE) license.

