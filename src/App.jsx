import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import Favorites from './pages/Favorites';
import Outfits from './pages/Outfits';
import OutfitDetail from './pages/OutfitDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:category" element={<Category />} />
          <Route path="items" element={<Items />} />
          <Route path="items/:id" element={<ItemDetail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="outfits" element={<Outfits />} />
          <Route path="outfits/:id" element={<OutfitDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
