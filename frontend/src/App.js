import "./App.css";

import Home from "./components/Home";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <Home />
      </div>
      <Footer />
    </div>
  );
}

export default App;
