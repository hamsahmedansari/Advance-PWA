# Advance Progressive Web App

Advance Progressive Web App (PWA) with all important feature like

## Demo

[Click Here](https://hamsahmedansari-pwa.herokuapp.com)

![](https://media.giphy.com/media/OqFBKjuAqMsbyfBrtQ/giphy.gif)

## Feature's

- Offline Access
- Add to Home
- Advance Cache System
- Cache Strategy
- Background Sync
- Push Notification
- Native Device Feature's
- FallBack

### Offline Access

![](https://media.giphy.com/media/fnK1YpqUPUzcUrlb4p/giphy.gif)
![](https://media.giphy.com/media/7FfNlhUeDAbOQF5sCN/giphy.gif)
You can access offline complete web

### Add to Home

![](https://i.imgur.com/XSqs19F.png)

### Advance Cache System

![](https://i.imgur.com/EGuYbEL.png?1)
We are Caching All Important Files like .html,.css,.js to static cache in order to get access app offline

### Cache Strategy

![](https://media.giphy.com/media/8UGEza6cD3QbuNqqey/giphy.gif)
We use First Cache Then Server with little bit of enhancement app first check is cache and load view. and in mean time it request to server for data and if request success it overwrite view and we got latest data so if app failed to request to server (probably user is offline) then it will keep data from cache.

### Background Sync

![](https://media.giphy.com/media/EOIw9U9Qv5jJxPnigu/giphy.gif)
If user is offline and he request to server the request save in indexedDB and wait till network connect. indexedDB hold data until request complete or user delete from indexedDB so Window or Tab closing doesn't effect.(NOTE: during testing some time it fail to request but data is in indexedDB)

### Push Notification

![](https://media.giphy.com/media/OqFBKjuAqMsbyfBrtQ/giphy.gif)
![](https://i.imgur.com/5v20jav.png)
Push Notification for all subscribe device (tested in chrome only both desktop and in android) when user create post it post to all subscriber

### Native Device Feature

![](https://media.giphy.com/media/28mZgacNLkTAxJYinY/giphy.gif)
Camera and GeoLocation Access but NOT save in database to protect user and image is loremImg

### FallBack

![](https://media.giphy.com/media/4N5nuiJmb7hnYM42iS/giphy.gif)
if app is offline and user try tu navigate to the page which is not loaded or not in cache it show fallback page for better experience
