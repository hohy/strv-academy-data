# STRV Academy - Database layer demos

## Infrastructure setup

Instances of Postgres, Mongo and Redis databases can be created in `Docker` using `docker-compose` file provided with the project. Just run `make infra` or `docker-compose up -d` and it should install and start the databases. 

For Firestore, you need to create a new project in Firebase console (https://console.firebase.google.com/). 

For the Firebase demos, you need to add a service role certificate for your firebase project into `./src/firebase/service-account.json`.

## Running the demos
Install required dependencies (`npm install`).

The project is setup to be executed inside VSCode using the launch task. Just open a file with a demo and hit F5 or use Run and Debug tab.