# Youtube and Twitter Backend

Hey there! This is my completed backend project from the Chai Aur Code series. It's been a fantastic journey, and I've learned a ton along the way.

## Functionality 🛠️

This project aims to provide a backend infrastructure for both a YouTube-like application and a Twitter-like application. Here's what it does:

- **User Authentication**: Users can sign up, log in, and log out. User information is securely stored and passwords are hashed for security.

- **Video Upload and Retrieval**: Users can upload videos, which are stored in Cloudinary. Users can also view all videos and specific videos by ID.

- **Commenting**: Users can add comments to videos. Comments can also be viewed by video ID.

- **Tweeting**: Users can create tweets, which are stored in MongoDB. Users can also view all tweets and specific tweets by ID.

- **Following and Unfollowing**: Users can follow and unfollow other users. The list of followers and following users can be retrieved.

- **Liking and Disliking Videos**: Users can like and dislike videos. The total count of likes and dislikes for each video can be retrieved.

- **Retweeting**: Users can retweet other users' tweets. The retweets can be viewed by tweet ID.

## concepts I've learned

Here's a quick rundown of the cool features I've added to this project:

- **Node.js Powered**: The entire backend is powered by Node.js. It's the engine that drives everything on the server side, handling multiple requests efficiently.

- **Express.js Framework**: I've used Express.js, a minimalist web application framework for Node.js. It's super flexible and makes building web apps and APIs a breeze.

- **MongoDB Database**: The project uses MongoDB, a NoSQL database that's perfect for handling large amounts of data. It's like a big, organized filing cabinet for your data.

- **Error Handling**: I've implemented robust error handling in Express.js. It's all about catching mistakes and dealing with them in a neat and tidy way.

- **Mongoose ODM**: Mongoose, an elegant MongoDB object modeling for Node.js, is used in this project. It provides a straightforward, schema-based solution to model your application data.

- **Middleware Usage**: I've designed the API and used middleware extensively. They're like the gatekeepers of our app, checking everything before it gets to the main part of our code.

- **Cloudinary Integration**: The project uses Cloudinary for storing images. It's like a cloud-based gallery for all our app's pictures.

- **Advanced Concepts**: I've applied some advanced concepts like aggregation pipelines and data modeling. It's like building a complex Lego set, piece by piece, until you have a complete model.

## How to setup project

1. **Clone the repository**: Use the following command to clone the repository:

   ```bash
   git clone https://github.com/DheerajShrivastav/youtube-backend.git
   ```

   Replace `<repository_url>` with the URL of your repository.

2. **Navigate to the project directory**: Use the following command to navigate to the project directory:

   ```bash
   cd youtube-backend
   ```

   Replace `<project_directory>` with the name of your project directory.

3. **Install the dependencies**: Use the following command to install the project dependencies:

   ```bash
   npm dev
   ```

4. **Set up the .env file**: Create a new file in the root directory of the project named `.env`. This file will contain all your environment variables. Based on your project structure, you might need to set variables for your database connection, Cloudinary, and any other services your app uses.

   Here's an example of what your `.env` file might look like:

   ```env
   DB_CONNECTION_STRING=mongodb+srv://username:password@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```

   Replace the values with your actual connection strings.

5. **Start the server**: Use the following command to start the server:

   ```bash
   npm start
   ```

   Your server should now be running, and you can access it at `http://localhost:3000` or whatever port you've set in your environment variables.

Remember to never commit your `.env` file to the repository. It contains sensitive information and should be kept private. Make sure `.env` is listed in your `.gitignore` file to prevent it from being committed.

## setup project using the Docker 🐳 image

1.  **Pull the Docker image from Docker Hub**:

    ```bash
    docker pull dheerajshrivastav/youtube-backend
    ```

2.  **Run the Docker image**:

    ```bash
    docker run -p 3000:3000 dheerajshrivastav/youtube-backend
    ```

3.  **Set up the .env file**: Create a new file in the root directory of the project named `.env`. This file will contain all your environment variables. Based on your project structure, you might need to set variables for your database connection, Cloudinary, and any other services your app uses.

    Here's an example of what your `.env` file might look like:

    ```javascript
        PORT=3000
        MONGODB_URI=
        CORS_ORIGIN=*
        ACCESS_TOKEN_SECRET=secret
        ACCESS_TOKEN_EXPIRY=1d
        REFRESH_TOKEN_SECRET=secret
        REFRESH_TOKEN_EXPIRY=10d

        # Cloudinary
        CLOUDINARY_CLOUD_NAME=
        CLOUDINARY_API_KEY=
        CLOUDINARY_API_SECRET=
    ```

    Replace the values with your actual connection strings.

## setup project using the Docker 🐳 compose

1. **Clone the repository**: Use the following command to clone the repository:

   ```bash
   git clone
   ```

   Replace `<repository_url>` with the URL of your repository.

2. **Navigate to the project directory**: Use the following command to navigate to the project directory:

   ```bash
   cd youtube-backend
   ```

   Replace `<project_directory>` with the name of your project directory.

3. **Install the dependencies**: Use the following command to install the project dependencies:

   ```bash
   npm dev
   ```

4. **Run the Docker compose**: Use the following command to run the Docker compose:

   ```bash
   docker-compose up
   ```

5. **Set up the .env file**: Create a new file in the root directory of the project named `.env`. This file will contain all your environment variables. Based on your project structure, you might need to set variables for your database connection, Cloudinary, and any other services your app uses.

   Here's an example of what your `.env` file might look like:

   ```javascript
       PORT=3000
       MONGODB_URI=
       CORS_ORIGIN=*
       ACCESS_TOKEN_SECRET=secret
       ACCESS_TOKEN_EXPIRY=1d
       REFRESH_TOKEN_SECRET=secret
       REFRESH_TOKEN_EXPIRY=10d

       # Cloudinary
       CLOUDINARY_CLOUD_NAME=
       CLOUDINARY_API_KEY=
       CLOUDINARY_API_SECRET=
   ```

   Replace the values with your actual connection strings.
