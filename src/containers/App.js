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
import ListFilms from '../components/Movie/ListFilms';
import AddFilms from '../components/Movie/AddFilms';
import DetailFilm from '../components/Movie/DetailFilm';
import EditFilms from '../components/Movie/EditFilms';
import ListMovieTheater from '../components/MovieTheater/ListMovieTheater';
import AddMovieTheater from '../components/MovieTheater/AddMovieTheater';
import EditMovieTheater from '../components/MovieTheater/EditMovieTheater';
import ListRoom from '../components/Room/ListRoom';
import AddRoom from '../components/Room/AddRoom';
import EditRoom from '../components/Room/EditRoom';
import AddSchedule from '../components/Schedule/AddSchedule';
import ListSchedule from '../components/Schedule/ListSchedule';
import ListFood from '../components/Food/ListFood';
import ListCombo from '../components/Combo/ListCombo';
import AddCombo from '../components/Combo/AddCombo';
import EditCombo from '../components/Combo/EditCombo';
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
            <Route path="/films-management" component={ListFilms} />
            <Route path="/add-new-films" component={AddFilms} />
            <Route path="/detail-film/:id" component={DetailFilm} />
            <Route path="/edit-film/:id" component={EditFilms} />
            <Route path="/movieTheater-management" component={ListMovieTheater} />
            <Route path="/add-new-movieTheater" component={AddMovieTheater} />
            <Route path="/edit-movie-theater/:id" component={EditMovieTheater} />
            <Route path="/room-management" component={ListRoom} />
            <Route path="/add-new-room" component={AddRoom} />
            <Route path="/edit-room/:id" component={EditRoom} />
            <Route path="/add-new-schedule" component={AddSchedule} />
            <Route path="/showTime-management" component={ListSchedule} />
            <Route path="/food-management" component={ListFood} />
            <Route path="/combo-management" component={ListCombo} />
            <Route path="/add-new-combo" component={AddCombo} />
            <Route path="/edit-combo/:id" component={EditCombo} />
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
