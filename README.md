# transcendence
:sparkles:

* [Setup](#Setup)
	* [FrontEnd](#FrontEnd)
	* [BackEnd](#BackEnd)
* [CORS](#Cors)
* [Study_Resources](#Study_Resources)

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


### BackEnd

**Create a new Nest project** 

`npm i -g @nestjs/cli`

`nest new project-name`

**Running the application**

* To watch for changes in your files

`npm run start`

* Command will watch your files, automatically recompiling and reloading the server

`npm run start:dev`

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

## Study_Resources

### FrontEnd

* [npm vs npx](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/)
* [An introduction to atomic state management libraries in React](https://dev.to/tomlienard/an-introduction-to-atomic-state-management-libraries-in-react-4fhh)
