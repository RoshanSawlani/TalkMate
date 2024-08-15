import './App.css';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/chats" component={ChatPage} />
      </Switch>
    </Router>
  );
}

export default App;
