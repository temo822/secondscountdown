import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, NavLink, Redirect, Switch, useLocation, useHistory } from 'react-router-dom';
import data from './data.json';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/wiki" component={Wiki} />
          <Route path="/wiki/search" component={Search} />
          <Route path="/wiki/:topic" component={Topic} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
}

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink exact to="/" activeClassName="active">Home</NavLink>
      <NavLink to="/wiki" activeClassName="active">Wiki</NavLink>
      <NavLink to="/wiki/search" activeClassName="active">Search</NavLink>
    </div>
  );
};

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the wiki!</p>
      <p>Current location: {location.pathname}</p>
    </div>
  );
};

const Wiki = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Wiki";
  }, []);

  return (
    <div>
      <h1>Wiki</h1>
      <p>Current location: {location.pathname}</p>
    </div>
  );
};

const Search = ({ location }) => {
  const history = useHistory();
  const query = new URLSearchParams(location.search).get('q');
  const [searchTerm, setSearchTerm] = useState(query || '');
  const results = data.filter(entry => entry.title.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    document.title = "Search";
  }, []);

  const handleInputChange = e => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      history.push(`/wiki/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={searchTerm} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>
      {results.length > 0 ? (
        <ul>
          {results.map((entry, index) => (
            <li key={index}>{entry.title}</li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

const Topic = ({ match }) => {
  const { topic } = match.params;
  const entry = data.find(item => item.title.toLowerCase() === topic.toLowerCase());

  if (!entry) {
    return <Redirect to={`/not-found/topic-not-found:${topic}`} />;
  }

  useEffect(() => {
    document.title = entry.title;
  }, [entry]);

  return (
    <div>
      <h1>{entry.title}</h1>
      <p>{entry.content}</p>
    </div>
  );
};

const NoMatch = () => {
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default App;
