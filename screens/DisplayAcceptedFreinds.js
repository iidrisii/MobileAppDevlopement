import React, {Component} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';

class DisplayAcceptedFriendsScreen extends Component
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
    
    getAcceptedFriends = async () =>
    {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", 
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

    componentDidMount()
    {
        this._unsubscribe = this.props.navigation.addListener('focus', () => 
        {
            this.checkLoggedIn();
            this.getAcceptedFriends();
        });        
        this.getAcceptedFriends();
    }

    componentWillUnmount()
    {
        this._unsubscribe();
    }

    checkLoggedIn = async () => 
    {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) 
        {
          this.setState({token:value});
        }else
        {
            this.props.navigation.navigate("Login");
        }
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
                            <Text>
                                {item.user_givenname + " " + item.user_familyname}
                            </Text>
                            <TouchableOpacity
                              onPress = {() => this.props.navigation.navigate("ViewFriendsPosts" , {"friend_id": item.user_id})}>
                              <Text>
                                View
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

export default DisplayAcceptedFriendsScreen;