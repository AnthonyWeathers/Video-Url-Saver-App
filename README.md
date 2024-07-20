# Video Url Saver
An app where a user can enter a url for a video, ensure its right then save it to the database for later viewing if needed. Serves as an extra backup for saved videos.

## Technologies used:
* React/Javascript (front-end)
* Python (back-end)
* Flask
* HTML, CSS
* postgresSQL

## Features:
* Upload:
![Upload Page](/src/static/upload_page.png)
    * Requires a url of an acceptable video url
    * Displays an error message if the React Player can not access the url
    * Some urls may not trigger an error but no video gets loaded, indicating the url or urls from the website, may not loadable
    * Two buttons will appear after a video is successfully loaded, to hide/show it, or save it
    * Clicking save opens a text field for the title of the video, for user to make a personal title for them to find it easier later
    * After clicking save, a message will appear saying it was saved
![Upload Success](/src/static/upload_success.png)
    * Shows as an alert if video was successfully saved
![Upload Video Error](/src/static/upload_error.png)
    * Shows as an alert if url triggers an error for the React Player

* Video List:
![Video List page](/src/static/videolist_top.png)
    * Allows to go through all their saved videos
![End of Video List](/src/static/videolist_end_of_list.png)
    * Videos are shown in batches of 5 at most until reaching the end
    * Can click show to see the video, delete to remove a video from their saved list, or edit video title to rename the personal title as desired.
        * Note: Editing title of a video will push it to the end of the list
![Video List Bottom](/src/static/videolist_bottom.png)
    * Has prev and next buttons at the bottom to let users view different batches

## Instructions on how to run a cloned repo
If a user wishes to try this app out on their own device, then there is some requirements needed to run this as I did, or equivalents:
* Programs used (may use equivalents if similar):
    * Visual Studio Code
    * Git
    * PostgreSQL (to setup the basebase name, password, and server port)

* Steps to install:
    * clone repo: git clone {insert github repo link of project}
    * create a virtual environment with python version 3.12.2 
    * at the root of the directory (where you'd see the public, server, and static folders, and other files), open terminal (I used a Git Bash terminal) and run "pip install -r requirements.txt"
    * next is to add/create a 2nd terminal that is also at the root of the directory, and run npm i or npm install to install all dependencies from the package.json that the app needs for the frontend. Also keep that 2nd terminal open for setup/running the app
    * download pgAdmin4 and make a user, make password without a "?", setup a database, and find the server port of it
        * create a config.sh file
            * create "export POSTGRES_URI=" and set = to postgres://postgres:{password}@localhost:{port}/{database name}
                * you would replace {password} with the password you use to access your database
                * replace {username} with the name of user account you created in Login/Group Roles with super user and can login
                * replace {port} with the port assigned to PostgreSQL 16, or the server under Servers that has your database
                * replace {database name} with the name you gave the database that will be used on local device
                * result would be export POSTGRES_URI=postgresql://{username}:{password}@localhost:{port}/{database name}

* To Setup and Run App:
    * in the terminal, enter "source config.sh"
    * then if you're setting up for the first time, or want to reset the database, then enter "python seed_database.py" (if using python 3)
    * After setup, enter "python server.py", the backend of the app will be live
    * Then on the 2nd terminal, enter npm start, which would start the React server for the frontend. Should it work then it would have opened the app at its url on your browser, displaying the login page
    * Now you can use the app
    * Note: If you close visual studio code and relaunch it, you'll need to redo "source config.sh" before "python server.py" and "npm start", because source config.sh establishes the connection to your database