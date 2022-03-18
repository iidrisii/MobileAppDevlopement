import React, { Component } from 'react';
import { Button, ScrollView, TextInput, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';

class SignupScreen extends Component
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    signup = () => 
    {
        //Validation here...

        return fetch("http://localhost:3333/api/1.0.0/user", 
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
            if(response.status === 201)
            {
                return response.json()
            }else if(response.status === 400)
            {
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => 
        {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Login");
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
                    <ScrollView >
                        <TextInput style={styles.input}
                            placeholder="Enter your first name..."
                            onChangeText={(first_name) => this.setState({first_name})}
                            value={this.state.first_name}
                            //style={{padding:5, borderWidth:1, margin:5}}
                        />
                        <TextInput style={styles.input}
                            placeholder="Enter your last name..."
                            onChangeText={(last_name) => this.setState({last_name})}
                            value={this.state.last_name}
                            //style={{padding:5, borderWidth:1, margin:5}}
                        />
                        <TextInput style={styles.input}
                            placeholder="Enter your email..."
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            //style={{padding:5, borderWidth:1, margin:5}}
                        />
                        <TextInput style={styles.input}
                            placeholder="Enter your password..."
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            secureTextEntry
                            //style={{padding:5, borderWidth:1, margin:5}}
                        />
                        <Button
                            title="Create an account"
                            onPress={() => this.signup()}
                        />
                    </ScrollView>
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
      paddingTop: 250,
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

export default SignupScreen;