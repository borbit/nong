Nong
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
5. Run `sudo ant install`.
   This will symlink nginx config in a proper place (but won't reload it just yet).
6. Run `npm link`.
   This will automatically download required node modules.
   As a side effect, it will also install Nong locally, but we shouldn't worry about this for now.
7. Run `sudo ant restart`.
   At this step nginx will reload it's configs, so frontend will become available.
   Next step would be to run backend websocket server.
   
Running Backend
---------------

    node server/app.js &
    sudo ant restart

Stopping Backend
----------------

    kill `cat server/server.pid`
    sudo ant restart
