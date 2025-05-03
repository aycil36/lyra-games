import './App.css';
import React, { useState, useEffect } from "react"; // useState ve useEffect'i ekledik
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import GameCard from "./components/GameCard";
import GamePage from "./pages/GamePage"; // GamePage'i import ettik
import GameDetailPage from "./pages/GameDetailPage"; 
import Home from "./pages/Home"; // HomePage'i import ettik
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";



function App() {
  const [games, setGames] = useState([]); // Oyun verileri için state
  const [loading, setLoading] = useState(true); // Yüklenme durumu için state

  useEffect(() => {
    console.log("API URL:", "https://localhost:5001/api/games"); // API URL'sini kontrol etmek için

    // Backend API'den oyunları fetch ile çek
    fetch(`https://localhost:5001/api/games`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data[0]); // Gelen veriyi konsola yazdır
        setGames(data); // Veriyi state'e kaydet
        setLoading(false); // Veri çekildikten sonra yüklenme durumunu false yap
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
        setLoading(false); // Hata durumunda da yüklenme durumunu false yap
      });
  }, []); // Boş bağımlılık dizisi, sadece bir kez çalışır

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="background"></div>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Anasayfa */}
          <Route path="/games" element={<GamePage games={games} loading={loading} />} /> {/* GamePage rotası */}
          <Route path="/games/:id" element={<GameDetailPage />} /> {/* Dinamik rota */}
          <Route path="/about" element={<AboutPage />} /> {/* Hakkında */}
          <Route path="/contact" element={<ContactPage />} /> {/* İletişim */}
          <Route path="/user" element={<UserPage />} /> {/* Kullanıcı */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfile />} />

          {games.map((game) => (
            <Route
              key={game._id}
              path={game.link}
              element={<div>{game.title} Sayfası</div>}
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;