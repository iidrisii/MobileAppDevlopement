import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';

class MainAppScreen extends Component 
{
  constructor(props)
  {
    super(props);

    this.state = 
    {
      isLoading: true,
      listData: [],
      makePost: "",
      changePost: ""
    }
  }

  getPosts = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
    method: 'get', 
    'headers': 
    {
      'X-Authorization':  value
    }
  })
  .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
    this.setState({
      isLoading: false,
      listData: responseJson
    })
  })
  .catch((error) => {
      console.log(error);
  })
}

addPost = async () => {
  const value = await AsyncStorage.getItem('@session_token');
  const user_id = await AsyncStorage.getItem('@user_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
  method: 'post', 
  'headers': {
    'X-Authorization':  value,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({text:this.state.makePost})
})
.then((response) => {
    if(response.status === 201){
        this.getPosts()
    }else if(response.status === 401){
      this.props.navigation.navigate("Login");
    }else{
        throw 'Something went wrong';
    }
})
.then((responseJson) => {
  this.setState({
    isLoading: false,
    listData: responseJson
  })
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
  
    this.getPosts();
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
          <Text>Loading..</Text>
        </View>
      );
    }else
    {
      return (
        <View>
          <View>
            <TextInput
            placeholder="Write post"
            onChangeText={(makePost) => this.setState({makePost})}
            value={this.state.makePost}
            />
            <TouchableOpacity
              onPress={() => this.addPost()}>
              <Text>Post</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.listData}
            renderItem={({item}) => (
          <View>
            <Text>{item.timestamp + '\n' + "New post from: " + item.author.first_name + " " + 
            item.author.last_name + " \n" + item.text + '\n' + "Likes: " + item.numLikes}
            </Text>
          </View>
            )}
          />
        </View>
      );
    }
  }
}

export default MainAppScreen;