import React from 'react';
import ReactDOM from 'react-dom';
import RegistrationForm from './registrationForm';
import Header from './header';
import Footer from './footer';
import LoginForm from './loginForm'
import MainPage from './mainPage'
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './Reducers/mainReducer'
import friendListPage from './friendListPage';
import profilePage from './profilePage';
import './components/styles/styles.css'

export const store = createStore(App, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
store.subscribe(() => {
    var state = store.getState()
    //   console.log(state);
    localStorage.setItem("storage", JSON.stringify(state))
}

)

var routes = (
    <Provider store={store}>
        <BrowserRouter>
            <main>
                <Header />
                <Switch>
                    <Route exact path="/" component={MainPage} />
                    <div className="Layout">
                        <div className="form">
                            <Route path="/registration" component={RegistrationForm} />
                            <Route path="/friends" component={friendListPage} />
                            <Route path="/login" component={LoginForm} />
                            <Route path="/profile" component={profilePage} />
                        </div>
                    </div>
                </Switch>
                <Footer />
            </main>
        </BrowserRouter>
    </Provider>
);
ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();
