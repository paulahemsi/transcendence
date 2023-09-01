# transcendence
:sparkles:

* [Setup](#Setup)
* [FrontEnd](#FrontEnd)
* [BackEnd](#BackEnd)
* [Architecture](#Architecture)
* [CORS](#Cors)
* [Login_flow](#Login_flow)
* [Encryption_and_Hashing](#Encryption_and_Hashing)
* [Study_Resources](#Study_Resources)


![amigo-rejeita-jogo](https://github.com/paulahemsi/transcendence/assets/63563271/90b45fe2-a56d-4a0f-a5b5-21d3c0d0a5a4)


![game-funcionandoooo](https://github.com/paulahemsi/transcendence/assets/63563271/e2a33317-0661-479c-9b58-0d56a9159cd6)


![blocked-blur](https://github.com/paulahemsi/transcendence/assets/63563271/092ccf48-84e2-4226-aa6e-a64f808fc4bf)


## Setup

**NodeJS Installation step-by-step:**

* Install curl

`sudo apt-get install curl`

* Install nvm

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

* Verify installation 

`command -v nvm` prompt should return `nvm`, if not close your current terminal, reopen it, and try again

* Install the current stable LTS release of Node.js

`nvm install --lts`

**Usefull commands:**

* List what versions of Node are installed

`nvm ls`

* Check node version

`node --version`

* Check npm version

`npm --version`


### FrontEnd

**Create React App:**

* Start a new Create React App project with TypeScript

`npx create-react-app my-app --template typescript`

**Running the application**

`npm start`

**Material UI Installation**

`npm install @mui/material @emotion/react @emotion/styled`

**Roboto font Installation**

`npm install @fontsource/roboto`

**Icons Installation**

`npm install @mui/icons-material`

**Import Icon**

`import IconNameIcon from '@mui/icons-material/IconName';`

**Colors theme Installation**

`npm install material-ui-colors`

### BackEnd

**Create a new Nest project** 

`npm i -g @nestjs/cli`

`nest new project-name`

**Running the application**

* To watch for changes in your files

`npm run start`

* Command will watch your files, automatically recompiling and reloading the server

`npm run start:dev`

## Architecture

Benefits achieved by dividing the software into layers:

* Independent of Frameworks. The architecture does not depend on the existence of some library of feature laden software. This allows you to use such frameworks as tools, rather than having to cram your system into their limited constraints.

* Testable. The business rules can be tested without the UI, Database, Web Server, or any other external element.

* Independent of UI. The UI can change easily, without changing the rest of the system. A Web UI could be replaced with a console UI, for example, without changing the business rules.

* Independent of Database. You can swap out Oracle or SQL Server, for Mongo, BigTable, CouchDB, or something else. Your business rules are not bound to the database.

* Independent of any external agency. In fact your business rules simply don’t know anything at all about the outside world.

From [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

**Nest.js layer architecture**

![image](https://user-images.githubusercontent.com/63563271/184553647-a02ee6b1-0ac9-480f-855e-33f1d9c2669f.png)


## Cors

Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.

CORS defines a way in which a browser and server can interact to determine whether it is safe to allow the cross-origin request. It allows for more freedom and functionality than purely same-origin requests, but is more secure than simply allowing all cross-origin requests.

From [wikipedia](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)

**Enable Cors in Nest.js**

To enable CORS, call the enableCors() method on the Nest application object:

```ts
const app = await NestFactory.create(AppModule);
app.enableCors();
await app.listen(3000);
```

## ORM

`@JoinColumn` must be set only on one side of relation - the side that must have the foreign key in the database table

## Login_flow

![image](https://user-images.githubusercontent.com/63563271/183547441-88032c14-87a4-45d2-9e51-b2b379e818ea.png)

## Encryption_and_Hashing

**Encryption** is the process of *encoding information*. 

This process **converts** the original representation of the information, known as **plaintext**, **into** an alternative form known as **ciphertext**. 

Ideally, *only authorized parties can decipher a ciphertext back to plaintext and access the original information*. Encryption does not itself prevent interference but denies the intelligible content to a would-be interceptor. Encryption is a two-way function; what is encrypted can be decrypted with the proper key.

**Hashing** is the process of *converting a given key into another value*. A hash function is used to generate the new value according to a *mathematical algorithm*. Once hashing has been done, it should be **impossible to go from the output to the input**.

## Study_Resources

### FrontEnd

* [npm vs npx](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/)
* [An introduction to atomic state management libraries in React](https://dev.to/tomlienard/an-introduction-to-atomic-state-management-libraries-in-react-4fhh)
