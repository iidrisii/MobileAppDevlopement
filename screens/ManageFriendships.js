import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';

class ManageFriendshipsScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
        isLoading: true,
        listData: [],
        }
    }

    acceptFriendRequeset = async (user_id) => 
  {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, 
    {
    method: 'post', 
    'headers': 
    {
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
      }else
      {
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => 
  {
    this.setState({
      isLoading: false,
      listData: responseJson
    })
    console.log(this.state.listData)
  })
  .catch((error) => 
  {
      console.log(error);
  })
}    

    getFriendRequest = async () => 
  {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", 
    {
    method: 'get', 
    'headers': 
    {
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
      }else
      {
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
    }
    else
    {
      return (
            <View>
                <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View>
                            <Text > 
                              {"New friend request from " + item.first_name + item.last_name} 
                            </Text>
                            <TouchableOpacity
                              onPress = {() => this.acceptFriendRequeset(item.user_id)}>
                              <Text>
                                Accept user
                              </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
      )
                    } 
}
}

export default ManageFriendshipsScreen;