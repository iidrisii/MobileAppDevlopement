import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, Button, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  getPosts = async () => 
  {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", 
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

addPost = async () => 
{
  const value = await AsyncStorage.getItem('@session_token');
  const user_id = await AsyncStorage.getItem('@user_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", 
  {
  method: 'post', 
  'headers': 
  {
    'X-Authorization':  value,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({text:this.state.makePost})
})
.then((response) => 
{
    if(response.status === 201)
    {
        this.getPosts()
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

deletePost = async (post_id) => 
{
  const value = await AsyncStorage.getItem('@session_token');
  const user_id = await AsyncStorage.getItem('@user_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, 
  {
    method: 'delete', 
    'headers': 
  {
    'X-Authorization':  value,
  }
})
.then((response) => 
{
  this.getPosts()
})
.then((res) =>
{
  console.log("Post deleted")
})
.catch((error) => 
{
  console.log(error);
})
}

updatePost = async (post_id, post) => 
{
  const value = await AsyncStorage.getItem('@session_token');
  const user_id = await AsyncStorage.getItem('@user_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, 
  {
    method: 'PATCH', 
    'headers': 
  {
    'X-Authorization':  value,
    'Content-Type': 'application/json'
  },
    body: JSON.stringify({
    text:post
    })
})
.then((response) => 
{
  this.getPosts()
})
.then((res) =>
{
  console.log("Post updated")
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
          <Text>
            Loading..
          </Text>
        </View>
      );
    }else
    {
      return (
          <SafeAreaView style={styles.container}>
            <View>
              <View>
                <TextInput
                  placeholder="Write post"
                  onChangeText={(makePost) => this.setState({makePost})}
                  value={this.state.makePost}
                />
                <TouchableOpacity style={styles.button}
                  onPress={() => this.addPost()}>
                  <Text>
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
                <FlatList
                  data={this.state.listData}
                  renderItem={({item}) => (
                  <View>
                    <Text>
                      {item.timestamp + '\n' + "New post from: " + item.author.first_name + " " + 
                      item.author.last_name + " \n" + item.text + '\n' + "Likes: " + item.numLikes}
                      <Button
                        title="Delete post"
                        onPress={() => this.deletePost(item.post_id)}
                      />
                      <Button
                        title="Update post"
                        onPress={() => this.updatePost(item.post_id, this.state.makePost)}
                      />
                      <ScrollView>
                        <TextInput
                        placeholder="Update your post..."
                        onChangeText={(makePost) => this.setState({makePost})}
                        value={this.state.makePost}
                        style={{padding:5, borderWidth:1, margin:5}}
                        />
                      </ScrollView>
                    </Text>
                  </View>
                  )}
                />
            </View>
          </SafeAreaView>
          );
    }
  }
}

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#87cefa',
    //paddingTop: 250,
  },
  button:
  {
      backgroundColor: 'yellow',
      height: 40,
      //width: 365,
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

export default MainAppScreen;