README

Simple movie picker app. Put what category and the lowest rating you want, and it randomly pulls from the database a movie to watch.

This project is set up currently for my EC2 production, you will have to make some changes for different situations.

This app uses the dotenv module for hiding security credentials on the database connection, so if you clone the app and run npm install, you will also have to run: touch .env and then run: sudo touch .env and make the following variables: 

  * DB_USER={USERNAME}
  * DB_PASS={PASSWORD}
  * EC2=URL Of EC2 Database
  * PORT=Port used for Database connection.

In the app.js under public/javascript in my main controller, i have commented out the code that parses the two csv files from Grouplens. The current live url uses the 20m review dataset. 

I used this guide to put this on AWS so its live: https://scotch.io/tutorials/deploying-a-mean-app-to-amazon-ec2-part-1

I havent currently included the forever.js as i dont intend to have this up permanently. 

If the instance this is running on is stopped and then restarted, the only information that should have to change is the url in the .env hosted online. 