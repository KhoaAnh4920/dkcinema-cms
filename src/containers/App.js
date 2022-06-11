import logo from '../logo.svg';
import './App.scss';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from '../components/Home'
import Login from '../components/Auth/Login';
import Users from '../components/Users/Users';
import { ToastContainer } from 'react-toastify';
import { path } from '../utils/constant';
import AddUser from '../components/Users/AddUser';
import EditUser from '../components/Users/EditUser';
import 'react-toastify/dist/ReactToastify.css';
import TestModal from '../components/Users/TestModal';
// import { ConnectedRouter as Router } from 'connected-react-router';




function App() {
  return (


    <Router>
      {/* <Route path="/" exact component={Home} /> */}
      <div className="main-container">


        <span className="content-container">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/admin-login" component={Login} />
            <Route path="/users-management" component={Users} />
            <Route path="/add-users" component={AddUser} />
            <Route path="/edit-user/:id" component={EditUser} />
            <Route path="/test-modal" component={TestModal} />
          </Switch>
        </span>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>

  );
}

export default App;
