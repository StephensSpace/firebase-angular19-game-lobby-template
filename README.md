# Multi-User Lobby Template

## Angular 19.x + Firebase First Release (1.0)

**About:**  
This project provides a lightweight, minimal template for building real-time multi-user lobbies  
using Angular and Firebase. It enables users to create, join, and manage rooms where multiple  
participants can interact simultaneously.

The template includes a Home component with a button to create a lobby and generates a shareable  
link to invite others. It features real-time name editing, a ready-status toggle for each member,  
and a start button that currently triggers a placeholder action — ready for you to implement your  
own game or collaborative logic.

Designed for easy customization and extension, this template serves as a solid foundation for  
various real-time multi-user applications, such as games, chats, or live dashboards.

**Motivation:**  
While building a small multiplayer game, I noticed that with a few changes this would be easily 
reusable for multiple purposes – like inviting people to a chat, a live dashboard session, or 
many other collaborative setups.

This inspired me to take a modular approach and turn the lobby into a flexible, standalone template.
That way, it can serve as a starting point for all kinds of real-time multi-user apps.

With clear documentation and this README, I aim to help others use it easily while demonstrating 
my commitment to writing clean, team-friendly code.

## How to Setup

**Connect Firebase:**(required)
In 'app.config.ts' you will find the const 'FirebaseConfig'. This is where you can insert your Firebase 
project data, which you receive when setting up your Firebase project.
Once the app is running (e.g. via 'ng serve --open'), clicking 'Start Lobby' in the Home component will 
create a new lobby instance.  The lobby will create a new document 
using a unique Firebase ID and will be saved by default in 'Firebase/GAMES/'UniqueID''. To customize the 
path, open 'FirebaseService.ts' (located in 'app/services/FirebaseService') and modify the 
'collection(..., "Games")' line inside the 'createLobby()' method.

**Firebase Service:** (optional) 
Thats your central Service in this Template, providing different Methods to e.g. get Observables or update 
your Data to your Firestore backend. In general you dont have to change anything here, if you do, remember 
to change other Methods accordingly:

If you change your Collection name from default 'Games' in 'createLobby()' you will also have to change the 
following Methods accordingly:
-updatePlayerData()
    This method is used to Update partial Fields of the Players Subcollection which has your Lobby Members. 
    You might want to change the Subcollection Name 'Players' here too. If you do so, also remember to do 
    the same in 'getPlayersObservable()' and 'loadPlayers()'.
    This Method can be reused to update any of your costumized Lobby User Fields from the Player class.
-updateGameDataField()
    It does the same as 'updatePlayerData' but for a Field of the Game Object; you can reuse this
    to update settings from Users in your Lobby to your firestore backend. 
-getMaxPlayers
    Helper Method to get the maxPlayers set in the 'Game' class.
-getPlayersObservable()
    Change both ('Games' and 'Players') here if needed. Method to get the Players Subcollection as Observable.
-loadPlayers()
    same as above, change both if necesary. Helper Method to get an array of the Players Subcollection back, 
    to use it local in the Lobby Component.
-getGameObservable()
    gets the Game Collection as an Observable with Player Interface. Change 'Games' here too if you did before. 

in 'createLobby()' you could also change the preset names (Player1-x) in the Loop for the LocalNames Array, 
which renders the Lobby member default names into input fields.

NOTE: The provided methods cover basic data management, but you’ll probably want to add your own delete method 
to remove fields or documents from Firebase collections. This is currently not implemented.

**app.routes.ts:**
The current setup in `app.routes.ts` sets the `HomeComponent` as the landing page (`path: ''`).  
Created lobby URLs will open under `/lobby/:id`.

You can change the route names if needed, but keep in mind:  
Due to routing issues, you **must use a subpath** like `/lobby/`. A route like just `/:id` will
**not work correctly** – it will redirect any user (except the lobby creator) back to the Home component.


## Known Issues

This is the first release, and there are some known bugs I haven't fixed yet (coming soon):

- Reloading the lobby may claim another lobby slot; a fallback is needed.
- Missing catch error blocks for some async functions.
- Firestore API zone warnings.

## Feedback

As a junior frontend developer, I’m always learning and truly appreciate any kind of constructive feedback.
I’ve tried to use modern best practices while keeping the structure simple and easy to follow 
— for example, I chose not to use reactive forms to keep things lightweight and more approachable.

If this template helps you in any way, that makes me really happy!
You can also reach out via GitHub by opening an issue or starting a discussion on the repository.
For anything else, feel free to contact me at webmaster@frontendschaz.de.

Have fun!