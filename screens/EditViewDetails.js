import React, { Component } from 'react';
import { Text, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditViewDetailsScreen extends Component 
{
    constructor(props)
  {
    super(props);

    this.state = 
    {
        isLoading: true,
        listData: [],
        first_name: "",
        last_name: "",
        email: ""
    }
  }
  
  getAccountDetails = async () => 
  {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, 
    {
    method: 'get', 
    'headers': {
      'X-Authorization':  value
    }
  })
  .then((response) => 
  {
      if(response.status === 200)
      {
          return response.json()
      }else if(response.status === 401)
      {
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => 
  {
    this.setState({
      isLoading: false,
      listData: responseJson
    })
  })
  .catch((error) => 
  {
      console.log(error);
  })
}

UpdateAccountDetails = async () => 
{
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, 
    {
    method: 'PATCH', 
    'headers': 
    {
      'X-Authorization':  value
    },
    body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
    })
  })
  .then((response) => 
  {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401)
      {
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
    })
      .then((responseJson) => {
          console.log("User updated", responseJson);
      this.props.navigation.navigate('Login');
  })
  .catch((error) => {
      console.log(error);
  })
}

componentDidMount() 
{
  this.unsubscribe = this.props.navigation.addListener('focus', () => 
  {
    this.checkLoggedIn();
  });

  this.getAccountDetails();
}

componentWillUnmount() 
{
  this.unsubscribe();
}

checkLoggedIn = async () => 
{
  const value = await AsyncStorage.getItem('@session_token');
  if (value == null) 
  {
      this.props.navigation.navigate('Login');
  }
};

  render() 
  {
    if (this.state.isLoading)
    {
      return (
        <View
          style=
          {{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading...</Text>
        </View>
      );
    }else{
      return (
        <View>
                <View>
                  <Text>{this.state.listData['first_name']}</Text>
                  <Text>{this.state.listData['last_name']}</Text>
                  <Text>{this.state.listData['email']}</Text>
                </View>
              
            <ScrollView>
                <TextInput
                    placeholder="Enter your new email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your new first name"
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Update details"
                    color="darkblue"
                    onPress={() => this.UpdateAccountDetails()}
                />
            </ScrollView>        
            </View>
        )
      }
  } 
} 
export default EditViewDetailsScreen;