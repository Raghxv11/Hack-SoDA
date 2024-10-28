<h1 align="center">GRADIFY</h1>

![WhatsApp Image 2024-10-27 at 11 58 59](https://github.com/user-attachments/assets/948d4597-1ffb-4f97-924d-63cbc4d49bb5)

## About Us
Gradify is an AI integrated Grading tool that allows professors and educators to grade assignments using AI. With our bulk upload functionality, plagiarism detection, and advanced PDF and image detection software, our application streamlines the grading process so educators can focus on building personal connections with students and usher in a new educational era.

## Tech Stack
- **Frontend**: Next.js + Typescript
- **Backend**: Python, Flask
- **Other Technologies**: Gemini Pro, LangChain, FAISS

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites
Ensure you have the following installed:
- Node.js
- Python 3.x
- npm (Node Package Manager)
- Conda (for creating a virtual environment)

### Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Raghxv11/Hack-SoDA.git
   cd Hack-SoDA
   ```

2. **Set up the Conda environment:**
   ```bash
   conda create -n venv python=3.10 -y
   conda activate venv
   ```

3. **Install the backend requirements:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the backend server:**
   - Create a `.env` file in the root directory and add your Gemini credentials:
     ```
     GOOGLE_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
     ```

5. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```

## Running the Project

1. **Start the Backend Server:**
   In the `server` directory:
   ```bash
   python server.py
   ```

2. **Start the Frontend Development Server:**
   In another terminal, navigate to the `client` directory and run:
   ```bash
   npm run dev
   ```

3. **Access the Project:**
   Open your web browser and navigate to `http://localhost:3000`.

## Project Structure

- `/server`: Contains the backend server and AI calls
- `/client`: Contains the frontend React application
