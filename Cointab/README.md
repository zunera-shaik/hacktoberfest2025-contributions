# Cointab ChatGPT-style Application

This is a full-stack application that emulates ChatGPT-like behavior using Ollama's gemma:2b model. The app includes a ChatGPT-style UI for chatting, storing chat history, and enabling new chats.

## Technologies Used

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js
- **Database:** PostgreSQL
- **LLM Integration:** Ollama (Local LLM)

## Requirements and Installation

### Prerequisites

- Node.js and npm
- PostgreSQL
- [Ollama Setup](https://ollama.com/download) (set up gemma:1b model)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd repository-url
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL Database:**
   - Create a database named `chatgpt_clone`.
   - Set your PostgreSQL credentials in a `.env` file:
     ```env
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=chatgpt_clone
     ```

4. **Initialize Database:**
   ```bash
   npm run init-db
   ```

5. **Setup Ollama and pull the model:**
   ```bash
   # Start Ollama service
   ollama serve
   
   # Pull the required model
   ollama pull llama3.2:1b
   
   # Test the model (optional)
   ollama run llama3.2:1b "Hello"
   ```

6. **Run the Application:**
   ```bash
   npm run dev
   ```

7. **Open browser** and navigate to `http://localhost:3000`

### Features

- **Chat Interface**: Send and receive messages streamingly.
- **New Chat**: Initialize new conversations with unique IDs.
- **Chat History**: Store chat sessions and access past chats.
- **Stop Generation**: Interrupt ongoing model response generation.
- **Styling**: Clean, minimal UI with TailwindCSS.

### Bonus Features

- **Typing Indicator**
- **Rename or Delete Chats**
- **Retry Sending Message**
- **Auto Chat Titles**
- **Keyboard Shortcuts**

## Video Walkthrough

Link to the video walkthrough: [Google Drive Link](#)

## Contact

For any queries, please reach out to [work-software-engineer-1@cointab.net](mailto:work-software-engineer-1@cointab.net).

---

🛠️ Happy Coding!
