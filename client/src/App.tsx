import { Route, Routes } from 'react-router';

import Home from 'pages/Home';
import Languages from 'pages/Languages';
import Typing from 'pages/Typing';
import NotFound from 'pages/NotFound';

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path='languages' element={<Languages />} />
      <Route path='typing/:lang' element={<Typing />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
