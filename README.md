# Social Media Application

This project is a social media application built using React with Vite for the frontend, Node.js for the backend, MongoDB for database storage, and Cloudinary for media management.

## Features

- **User Authentication**: Sign up, log in, log out functionality.
- **Create and Edit Posts**: Users can create posts with images and edit/delete their own posts.
- **Like and Comment**: Users can like and comment on posts.
- **Follow and Unfollow Users**: Follow other users to see their posts in the feed.
- **Upload Images**: Use Cloudinary API to upload and store images.

## Technologies Used

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: MongoDB (MongoDB Atlas for cloud hosting)
- **Cloud Storage**: Cloudinary API
- **Authentication**: JWT (JSON Web Tokens)

## Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/OmkarAnbhule/SocioLink---Social-Media-Application.git
   cd social-media-app
2. **Setup Frontend**
   ```bash
   cd client
   npm install

3. **Setup Backend**
   ```bash
   cd ../server
   npm install
   
4. **Configure Environment Variables**
   ```makefile
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Replace your_mongodb_uri, your_jwt_secret, your_cloudinary_* with your actual MongoDB URI, JWT secret, Cloudinary credentials respectively.

5. **Run Application**
   *Start Frontend*
      ```bash
      cd client
      npm run dev
  
  *Start Backend*
    ```bash
    cd ../server
    node index.js

6. **Access Application**
  Open your web browser and go to http://localhost:3000 to view the application.

## License
  This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
**React with Vite** - for building the frontend.
**Node.js with Express** - for building the backend API.
**MongoDB** - for database storage (MongoDB Atlas for cloud hosting).
**Cloudinary** - for media management and image uploads.
## Author
 - Omkar Suresh Anbhule
 - GitHub: https://github.com/OmkarAnbhule
 - Live Demo: https://blog-site-chi-pearl.vercel.app/
   
