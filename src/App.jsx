import React from 'react';
import { useRoutes, Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar';
import BookDetails from './Components/BookDetails';
import Search from './Components/Search';

function App() {

  let element = useRoutes([
    {
      path:"/",
      element: <Search />
    },
    {
      path:"/book/:id",
      element: <BookDetails />

    }
  ]);

  return (
    <div className="App">
      <div className="Nav">
        <NavBar />
      </div>
      <div className="Page">
        {element}
      </div>
    </div>
  );
}

export default App;