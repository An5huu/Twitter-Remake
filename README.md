# 🎨 Twitter (X) Remake (Portfolio Project) 🌟

## License
📜 This project is licensed. Read the LICENSE file for more information. 🔓

## Disclaimer
Important: This project is an independent effort created for educational and demonstrative purposes only. It is not officially affiliated with Twitter or any of its subsidiaries. The use of Twitter’s logo, colour scheme, and any other proprietary elements in this project is solely for illustrative purposes, to provide context and visual identity. All trademarks, logos, and brand names are the property of their respective owners. No copyright infringement is intended. 🛡️📜

## Overview
This project is a vibrant personal portfolio work focusing on redesigning the popular social media platform, Twitter (X). The redesign offers a fresh perspective on the user interface and user experience of Twitter, showcasing modern design concepts and enhanced usability features in a kaleidoscope of colours and creativity. 🌈✨

## Features
- 🎨 Revamped Interface: A fresh, modern design approach to the existing layout, painted with new hues and textures.
- 📱 Responsive Design: Optimised for various devices, including mobiles and tablets, ensuring the design dances beautifully across screens.
- 🐦 Real-Time Tweets: Seamlessly view and interact with tweets as they are posted, offering a dynamic and up-to-date social experience.
- ❤️ Live Likes System: Instantly like and see updates on tweet interactions in real-time, reflecting immediate engagement.
- 📤 Working Posts: Effortlessly create and share posts, integrated with the redesigned interface to enhance user expression and connectivity.

### Technologies Used:
- 💻 Languages: Tailwind, TypeScript, JavaScript, HTML, CSS, JSON
- ⚙️ Frameworks: Next.js
- 🎨 Styling: Tailwind.css
- 🛢️ Database: MongoDB with Prism ORM

### Installation
- 🛠️ Clone the repository:
- Use `git clone https://github.com/An5huu/Twitter-Remake.git`

### 📂 Navigate into the project directory:
- `cd Twitter-Redesign`

### 🔧 Install dependencies:
- `npm install`

### 🕵🏽‍♂️ Environment variables
- Discord
    - Go to [Discord Applications](https://discord.com/developers/applications) and press `New Application`, navigate to Oauth2 and copy the `CLIENT ID` and `CLIENT SECRET`. Note that copying the Client Secret may require Discord authentication.
    - In the Discord bot page, create another redirect link and provide this link http://localhost:3000/api/auth/callback/discord
***
- Next Auth
    - Go to your terminal and run `openssl rand -base64 32`. The provided output will be your `NEXTAUTH_SECRET`
    - Your `NEXTAUTH_URL` will be the base URL of your provided site link. Most commonly: http://localhost:3000/
***
- Database
    - To get your Database URL, go to MongoDB and create a cluster and generate the cluster link.
    - Refer to [MongoDB connection string documentation](https://www.mongodb.com/docs/manual/reference/connection-string/) for a complete list of connection string arguments. There are no Prisma ORM-specific arguemnts.

`.env` - Example
```
DISCORD_CLIENT_SECRET=xxx
DISCORD_CLIENT_ID=xxx
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=xxx
DATABASE_URL="xxx"
```

***

### 🗄️ Setup database
- `npx prisma init`
- `npx prisma generate`

### 🚀 Run the project:
- `npm run build`
- `npm run start`

Open your browser and go to http://localhost:3000 (or the provided URL in terminal) to see the redesign in action, a symphony of colours and innovation. 🎉

### Acknowledgements
💙 Twitter (X) for the foundational inspiration of this project, a canvas that sparked this artistic endeavour.

***
Thank you for your interest in this project. Please explore and enjoy the redesign, keeping in mind the educational intent behind its creation. Let the colours guide you through this innovative experience! 🌟🎨