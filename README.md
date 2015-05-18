# TicTacToe with Flask, Reactjs, Flux, and Redis

A simple tic tac toe game built with Flask, with Flux and Reactjs on the frontend, and Redis to maintain the state of the game. 

## Setting it up on your Environment:

1. Clone the repo,
2. Make sure you have Flask installed
3. In the root directory, run `pip install -r requirements.txt`
4. In the root directory, run `npm install`
5. In the root directory, run `bower install`
6. Start the app by running start.sh: `sh start.sh`

## Some questions perhaps?

### Why not just have everything on the client side without Flask or Redis?
A: The server determines the next move for the AI and also maintains the state of the game. This ensures that the player can't cheat their way to a win by modifying anything on the front end. 

### Why Flux?
A: Because it's a nice way to maintain the flow of dynamic data throughout the game. 