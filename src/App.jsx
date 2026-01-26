import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
   return (
      <div className="min-h-screen flex flex-col font-sans bg-paper-texture text-stone-800">
         <Navbar />
         <div className="flex-1 flex flex-col">
            <Outlet />
         </div>
         <Footer />
      </div>
   );
}

export default App;
