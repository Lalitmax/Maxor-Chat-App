# Maxor Chat App

Maxor Chat App is a real-time chat application built using modern web technologies. It allows users to send and receive messages, add friends, and manage their profiles.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contribution](#contribution)
- [License](#license)

## Features

- User authentication and management
- Real-time messaging using Socket.io
- Add and manage friends
- Responsive design for mobile and desktop
- Customizable chat interface
- Emoji support in messages

## Tech Stack

- **Frontend:**
  - React.js
  - Tailwind CSS
  - Axios
  - Socket.io-client
  - Emoji-mart

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (or any other database of choice)
  - Socket.io

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/maxor-chat-app.git
   cd maxor-chat-app
   ```

2. **Install dependencies:**

   For the client:
   ```bash
   cd client
   npm install
   ```

   For the server:
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the server directory and add the following variables:
   ```env
   PORT=
   MONGODB_URL=
   MONGODB_PASSWORD=
   ```

4. **Run the application:**

   For the client:
   ```bash
   npm run dev
   ```

   For the server:
   ```bash
   npm run test
   ```

## Usage

1. **Register an account**: Go to the registration page and create a new account.
2. **Login**: Log in with your credentials.
3. **Add friends**: Use the "New" button to add friends by their username.
4. **Start chatting**: Select a friend from the list and start sending messages.
5. **Profile management**: Click on the profile icon to view and manage your profile.

## Project Structure

```bash
maxor-chat-app/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.js
│   └── package.json
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── package.json
└── README.md
```

## Contribution

Contributions are welcome! Here’s how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

Please make sure your code follows the project's coding standards and includes relevant tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Feel free to modify this template to better fit your project's specifics.
