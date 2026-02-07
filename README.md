# Kejah - AI-Powered Real Estate Platform

**Kejah** is a modern, AI-driven real estate platform designed to simplify the home-buying and renting experience in Kenya. By leveraging artificial intelligence, we connect users with verified properties, trusted agents, and provide deep insights into neighborhoods.

## 🚀 Key Features

*   **AI Assistant (Gemini)**: A built-in chatbot to answer property-related questions and guide users.
*   **Property Listings**: Browse a wide range of properties for sale and rent with detailed filtering.
*   **Verified Agents**: Connect with professional real estate agents.
*   **Interactive Maps**: View property locations and neighborhood amenities.
*   **User Authentication**: Secure signup and login via Email/Password and Google.
*   **Responsive Design**: A seamless experience across desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript
*   **Styling**: Tailwind CSS
*   **Backend Services**: Firebase (Authentication, Firestore, Storage)
*   **AI Integration**: Google Gemini API
*   **Routing**: React Router DOM
*   **Icons**: Lucide React

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/levisbarua/kejah-.git
    cd kejah
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env.local` file in the root directory and add your API keys:

    ```env
    # Firebase Configuration (Get these from your Firebase Console)
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

    # Google Gemini AI API Key (Get this from Google AI Studio)
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

    > **Note**: If you do not provide valid Firebase keys, the app will automatically fallback to **Demo Mode** using mock data.

4.  Run the development server:
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
