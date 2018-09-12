import { combineReducers } from 'redux'
import { friendsApp } from './friendsReducers'
import { userApp } from './userReducers'

const App = combineReducers({
    friendsApp,
    userApp
})

export default App