import {
    LOGOUT,
    LOGIN,
} from './action'

const initialState = {
    user: null,
    acceptedTerm: false
};

export default function reducer (state = initialState, action) {
    // NOTE: DEBUG REDUX. Don't remove
    // console.warn(action.type, JSON.stringify(action, (key, value) => {
    // if (key === 'socket') return 'socket val'
    // return value
    // }, 2))

    switch (action.type) {
        case LOGIN:
            return { ...state, user: action.payload };
        case LOGOUT:
            return { ...state, user: null };
        default:
            return state
    }
}