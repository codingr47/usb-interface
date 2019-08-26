# usb-interface

## General Description
This project includes a server and a client that communicate through Websockets.
The server serves data about devices connected via USB, to the host machine of the server
application.
Currently it does not support any other features.


## Installation

we assume that you have node >= 8.16 installed.

we assume that you have npm installed.

The first step is to install ts-node, better globally:
````
npm install -g ts-node
````
The next step is to cd to project's root and install the project's dependencies

```
npm install
```

## Server

the server application will first run the DB building script that includes
an import from the online USB DB and a test that verifies that its' behaviour is as expected, and if succeds it will run the server up

in order to start the server:
```
npm run server-start
```


## Client

the client application runs on  a webpack dev server and to run it you need to run this command:

```
npm run client-start
```

## NOTE: USBlib system dependencies

on Linux: make sure you have build-essentials and libudev-dev
installed.

For example, on ubuntu:
```
 apt-get install build-essential libudev-dev
```

