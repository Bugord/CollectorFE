const ADD_TODO = 'ADD_TODO'

export function addTodo(text) {
    return {
      type: ADD_TODO,
      text
    }
  }

  const initialState = {
    todo: [],
    aa: "awfaf",
    todos: []
  };

    export function todoApp(state = initialState, action) {
        switch (action.type) {
        case ADD_TODO:
          return Object.assign({}, state, {
            todo: {a: action.text}
          })
        default:
          return state
  }}