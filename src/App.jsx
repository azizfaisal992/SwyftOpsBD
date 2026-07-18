import Footer from "./layout/footer";
import Header from "./layout/header";
import Home from "./pages/Home";

const App = () => (
  <div className="min-h-screen bg-white text-slate-900">
    <Header />
    <main>
      <Home />
    </main>
    <Footer />
  </div>
);

export default App;
