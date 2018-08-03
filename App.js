
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';


import Route from './App/Config/Router'

export default class App extends Component<Props> {
    render() {
        return (
                <Route/>
        );
    }
}