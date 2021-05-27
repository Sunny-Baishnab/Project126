import * as React from 'react'
import {Button , Image , View , Platform} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class Camera extends React.Component{
    state = {
        image:null
    }

    getPermissionAsync = async()=>{
        if(Platform.OS!=='web'){
            const {status} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
            if(status!=='granted'){
                alert('sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    componentDidMount(){
        this.getPermissionAsync()
    }

    _pickImage = async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({
                    image:result.data
                })
                this.uploadImage(result.uri)
            }
        }
        catch(error){
            console.log(error)
        }
    }

    uploadImage = async(uri) =>{
        const data = new FormData()
        let filename = uri.split('/')[uri.split('/').length-1]
        let type = `image/${uri.split('.')[uri.split('.').length-1]}`
        const filetoupload = {
            uri:uri,
            name:filename,
            type:type
        }
        data.append('digit',filetoupload)
        fetch('',{
            method:'POST',
            body:data,
            headers:{
                'content-type':'multipart/form-data'
            }
        })
        .then((response)=>{
            response.json()
        })
        .then((result)=>{
            console.log('success:',result);
        })
        .catch((error)=>{
            console.log('Error:',error);
        })
    }

    render(){
        let {image}=this.state
        return(
            <View style = {{flex:1 , alignItems:'center' , justifyContent:'center'}}>
                <Button title = 'Pick any Image from camera roll'
                color = 'yellow'
                onPress = {this._pickImage}/>
            </View>
        )
    }
}