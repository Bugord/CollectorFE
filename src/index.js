import React from 'react';
import ReactDOM from 'react-dom';
import RegistrationForm from './RegistrationForm';
import Header from './Header';
import Footer from './Footer';
import LoginForm from './LoginForm'
import MainPage from './MainPage'
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './components/styles.css';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {friendsApp} from './Reducers/friendsReducers'

const store = createStore(friendsApp, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
store.subscribe(() =>{
  var state = store.getState()
  console.log(state);
  localStorage.setItem("storage", JSON.stringify(state))}

)

var routes = (
    <Provider store={store}>
    <BrowserRouter>
        <main>
            <Header/>
            <div className="Layout">
                <div className="form">
                    <Switch>
                        <Route exact path="/" component={MainPage}/>
                        <Route path="/registration" component={RegistrationForm} />
                        <Route path="/login" component={LoginForm} />
                    </Switch>
                </div>
            </div>
            <Footer/>
        </main>
    </BrowserRouter>
    </Provider>
);
ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();
