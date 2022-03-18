import React, { Component } from 'react';
import { Button, ScrollView, TextInput, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';

class LoginScreen extends Component
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            email: "",
            password: ""
        }
    }

    login = async () => 
    {
        //Validation here...

        return fetch("http://localhost:3333/api/1.0.0/login", 
        {
            method: 'post',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => 
        {
            if(response.status === 200)
            {
                return response.json()
            }else if(response.status === 400)
            {
                throw 'Invalid email or password';
            }else
            {
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => 
        {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('@user_id', responseJson.id);
                this.props.navigation.navigate("EverythingElse");
        })
        .catch((error) => 
        {
            console.log(error);
        })
    }

    render()
    {
        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <ScrollView>
                        <TextInput style={styles.input}
                            placeholder="Enter your email..."
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            style={{padding:5, borderWidth:1, margin:5}}
                        />
                        <TextInput style={styles.input}
                            placeholder="Enter your password..."
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            secureTextEntry
                            style={{padding:5, borderWidth:1, margin:5}}
                        />
                        <Button
                            title="Login"
                            onPress={() => this.login()}
                            /*style = {{backgroundColor: 'yellow',
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 12,
                            fontWeight: '500',
                            textTransform: 'uppercase',}} */
                        />
                        <Button
                            title="Don't have an account?"
                            color="darkblue"
                            onPress={() => this.props.navigation.navigate("Signup")}
                        /> 
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: 
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: "center",
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#87cefa',
      padding: 80,
    },
    button:
    {
        backgroundColor: 'yellow',
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    input: 
    {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
  }); 

export default LoginScreen;