import React from 'react';
import { useRoutes, Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar';
import BookDetails from './Components/BookDetails';
import Search from './Components/Search';
import SavedBooks from './Components/SavedBooks';

function App() {

  let element = useRoutes([
    {
      path:"/",
      element: <Search />
    },
    {
      path:"/book/:id",
      element: <BookDetails />

    },
    {
      path:"/savedbooks",
      element: <SavedBooks />
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