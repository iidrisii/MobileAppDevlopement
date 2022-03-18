import React, { Component } from 'react';
import { Text, ScrollView, Button, View, TextInput, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      email: "",
      photo: null
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
    headers:
    {
      'X-Authorization':  value,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
    })
  })
  .then((response) => 
  {
      if(response.status === 200)
      {
          return response.json()
      }else if(response.status === 401)
      {
        this.props.navigation.navigate("Login");
      }else
      {
          throw 'Something went wrong';
      }
    })
      .then((responseJson) => 
      {
          console.log("User updated", responseJson);
  })
  .catch((error) => 
  {
      console.log(error);
  })
}

get_profile_image = async () => 
{
  const value = await AsyncStorage.getItem('@session_token');
  const user_id = await AsyncStorage.getItem('@user_id');
  fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", 
  {
    method: 'get',
    headers: 
    {
      'X-Authorization': value
    }
  })
  .then((res) => 
  {
    return res.blob();
  })
  .then((resBlob) => 
  {
    let data = URL.createObjectURL(resBlob);
    this.setState({
      photo: data,
    });
  })
  .catch((err) => 
  {
    console.log("error", err)
  });
}

logout = async () => 
    {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", 
        {
            method: 'post',
            headers: 
            {
                "X-Authorization": token
            }
        })
        .then((response) => 
        {
            if(response.status === 200)
            {
                this.props.navigation.navigate("Login");
            }else if(response.status === 401)
            {
                this.props.navigation.navigate("Login");
            }else
            {
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => 
        {
            console.log("You have been successfuly logged out", responseJson)
            this.props.navigation.navigate("Login");
        })
        .catch((error) => 
        {
            console.log(error);

        })
    }

componentDidMount() 
{
  this.unsubscribe = this.props.navigation.addListener('focus', () => 
  {
    this.checkLoggedIn();
    this.get_profile_image();
  });

  this.getAccountDetails();
  this.get_profile_image();
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
    }else
    {
      return (
          <SafeAreaView style={styles.container}>
            <View>
              <Image style={styles.image}
                source={{uri: this.state.photo,}}
                //style={{width: 200,height: 200, borderWidth: 5, borderRadius: 100, alignItems: 'center'}}
              />
              <Button
                  title="Add photo"
                  color="darkblue"
                  onPress={() => this.props.navigation.navigate("Camera")}
              />
              <View style={styles.UserInformation}>
                <Text style={styles.UserInformationStyle}>{this.state.listData['first_name']}</Text>
                <Text style={styles.UserInformationStyle}>{this.state.listData['last_name']}</Text>
                <Text style={styles.UserInformationStyle}>{this.state.listData['email']}</Text>
              </View>
              <ScrollView>
                  <TextInput
                    placeholder="Enter your new email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
                  />
                  <TextInput
                    placeholder="Enter your new name"
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                  />
                  <Button
                    title="Update details"
                    color="darkblue"
                    onPress={() => this.UpdateAccountDetails()}
                  />
                  <Button 
                    title="Log out"
                    color="red"
                    onPress={() => this.logout()}
                  />
              </ScrollView>        
              </View>
            </SafeAreaView>
        )
      }
  } 
} 

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    //alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#87cefa',
    paddingVertical: 80,
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
  UserInformation:
  {
    alignItems: "center",
    
  },
  UserInformationStyle:
  {
    fontSize: 25,
    fontWeight: '500',
  },
  image:
  {
    width: 200,
    height: 200, 
    borderWidth: 5, 
    borderRadius: 100, 
    alignItems: 'center',
  },
}); 

export default EditViewDetailsScreen;