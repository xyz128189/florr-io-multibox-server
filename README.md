# Multibox server
Simple Multibox server that allows you to broadcast your actions to connected clients.

You can connect different PC to server by hosting it on Replit or Glitch (or other).

*If you encountered a bug, please consider opening an issue to help me fix it.*
# Documentation
### Installation
Download/clone this repo.
### Config
In `config.json` you can set host client ID and whitelist client IDs.

To set host ID, you need to paste it in `""` in `hostFlorrKey` property.

To whitelist an ID, you need to add `"ID here"` to `[]` brackets in `allowedFlorrKeys` property. Separate IDs by commas: `["1", "2", "3"]`.

If in Florr.io Utils custom client ID not set, `cp6_player_id` from Local Storage will be used instead.

You can get `cp6_player_id` by opening DevTools (`F12` or `Ctrl + Shift + I`), going to Application tab (if not shown, click on dropdown button) and then selecting Local Storage. If it's not in the list, then you're probably not logged in.
### Running
Open command line in Multibox server folder and run `npm i` to install required modules.

After modules are installed, run `node dist/index`.

You should see message `Server listening on port 8080.`.

Note: If you're hosting it on your local machine then to connect to it using Florr.io Utils you need to set server URL to `localhost:8080`. Otherwise, set it to your hosting server URL.
