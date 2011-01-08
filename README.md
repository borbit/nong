Pong
====

Installation
------------

1. Open `config/config` for reference.
2. Create empty `config/config.local`.
3. Override any properties you wish from `config/config` in `config/config.local`.
4. Run `ant config`.
   This will generate nginx config.
5. Run `sudo ant install restart`.
   This will symlink nginx config in a proper place and then tell nginx to
   reload its configs.
