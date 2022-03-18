import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class CameraScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = 
    {
      hasPermission: null,
      photo: null,
      isLoading: true,
      type: Camera.Constants.Type.back
    }
  }

  async componentDidMount()
  {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
    this.get_profile_image();
  }

  sendToServer = async (data) => 
  {
      const token = await AsyncStorage.getItem('@session_token');
      const user_id = await AsyncStorage.getItem('@user_id');
      let res = await fetch(data.base64);
      let blob = await res.blob();

      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", 
      {
          method: "post",
          headers: 
          {
              "Content-Type": "image/png",
              "X-Authorization": token
          },
          body: blob
      })
      .then((response) => 
      {
          console.log("Picture added", response);
      })
      .catch((err) => 
      {
          console.log(err);
      })
  }

    takePicture = async() => 
    {
        if(this.camera)
        {
            const options = 
            {
                quality: 0.5, 
                base64: true,
                onPictureSaved: (data) => this.sendToServer(data)
            };
            await this.camera.takePictureAsync(options); 
        } 
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

  render(){
    if(this.state.hasPermission)
    {
      return(
        <View style={styles.container}>
          <Camera 
            style={styles.camera} 
            type={this.state.type}
            ref={ref => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => 
                {
                  this.takePicture();
                }}>
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }else
    {
      return(
        <Text>No access to camera</Text>
      );
    }
  }
}

export default CameraScreen;

const styles = StyleSheet.create(
  {
  container: 
  {
    flex: 1,
  },
  camera: 
  {
    flex: 1,
  },
  buttonContainer: 
  {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: 
  {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: 
  {
    fontSize: 18,
    color: 'white',
  },
});
