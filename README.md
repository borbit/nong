Pong
====

Installation
------------

Prerequisites:
* nginx
* node & npm

Steps:

1. Open `config/config` for reference.
2. Create empty `config/config.local`.
3. Override any properties you wish from `config/config` in `config/config.local`.
4. Run `ant config`.
   This will generate various configs.
5. Run `npm bundle`.
   This will automatically download required node modules into `node_modules` dir.
6. Run `sudo ant install`.
   This will symlink nginx config in a proper place.
   
Running
-------

    node server/server.js &

Stopping
--------

    kill `cat server/server.pid`