import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';

class SearchScreen extends Component
{

    constructor(props)
    {
        super(props);

        this.state = 
        {
        isLoading: true,
        listData: [],
        SearchForFriends: ""
        }
    }

 SearchFriends = async () => 
    {
      const value = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.SearchForFriends, 
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

  AddFriends = async () => 
  {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user" + user_id + "/friends", 
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
  })
  .catch((error) => 
  {
      console.log(error);
  })
}    

SendFriendRequest = async (user_id) => 
  {
    const value = await AsyncStorage.getItem('@session_token');
    //const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", 
    {
    method: 'post', 
    'headers': 
    {
      'X-Authorization':  value
    }
  })
  .then((response) => 
  {
      if(response.status === 201)
      {
          return response.json()
      }else if(response.status === 401)
      {
        this.props.navigation.navigate("Login");
      }else if(response.status === 403)
      {
          throw 'User is already a friend';
      }else if(response.status === 500)
      {
          throw 'Server Error';
      }else
      {
          throw 'Something wenr wrong';
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
        });        
        this.SearchFriends();
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
        <SafeAreaView style={styles.container}>
            
                <TextInput
                    placeholder = "Enter Friends name: "
                    onChangeText = { (SearchForFriends) => this.setState({SearchForFriends}) }
                    value = {this.state.SearchForFriends}
                />
                <TouchableOpacity style={styles.button}
                    onPress = {() => this.SearchFriends()}>
                    <Text>
                        Search
                    </Text>
                </TouchableOpacity>
                <FlatList 
                    data={this.state.listData}
                    renderItem={({item}) => (
                        
                    <View>
                        <Text> 
                            {item.user_givenname} {item.user_familyname} 
                        </Text>
                        <Button
                            title="Add friend"
                            onPress={() => this.SendFriendRequest(item.user_id)}
                        />
                    </View>
                    )}
                />
           
        </SafeAreaView>
            )
       
    } 
}
}

const styles = StyleSheet.create({
    container: 
    {
      flex: 1,
      //justifyContent: 'center',
      //alignItems: "center",
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#87cefa',
      //paddingTop: 250,
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

export default SearchScreen;