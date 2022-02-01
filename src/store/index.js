import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filtersSlice';
import { configureStore } from '@reduxjs/toolkit';

const stringMiddleware = (store) => (dispatch) => (action) => {
    if(typeof action === 'string') {
        return dispatch({
            type: action
        })
    }
    return dispatch(action);
}

// const store = createStore(
//                 combineReducers({heroes, filters}),
//                 compose(applyMiddleware(ReduxThunk, stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) 
// );

const store = configureStore({
    reducer: {heroes, filters},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production'
})

export default store;