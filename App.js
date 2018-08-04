
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';


import Route from './App/Config/Router'
import { Provider } from 'react-redux'
import {store, persistor} from './App/redux/createStore'

export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <Route/>
            </Provider>
        );
    }
}