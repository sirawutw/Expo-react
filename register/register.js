import React from 'react'
import { ScrollView,View, Button, StyleSheet,Image,TextInput,Dimensions,TouchableOpacity,Text,Alert } from 'react-native'
import axios from 'axios';
import Input from '../components/Input';

export default class Register extends React.Component {

    state = {navigation:this.props.navigation,
                username:"",
                password:"",}

    validateUsername(text){
        const reg = /^[a-zA-Z0-9]{4,12}/;
        if(reg.test(text) == false){
            Alert.alert(                
            'แจ้งเตือน',
            'กรุณากรอก Username จำนวน 4-12 หลักโดยไม่ใช้อักขระพิเศษ',
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
            );
            return false;
        }else{
            return true;
        }
    }

    validatePassword(text){
        const reg = /^[a-zA-Z0-9]{6,12}/;
        if(reg.test(text) == false){
            Alert.alert(                
            'แจ้งเตือน',
            'กรุณากรอก Password จำนวน 6-12 หลักโดยไม่ใช้อักขระพิเศษ',
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
            );
            return false;
        }else{
            return true;
        }
    }
                
    submitdata(){
        var me = this;
        console.log(this.state.username);
        if(this.validateUsername(this.state.username)==true){
            if(this.validatePassword(this.state.password)==true){
                console.log(this.state.username);
                axios({ 
                    method: 'POST',
                    url: 'http://localhost:3000/register',
                    data:{
                        username: this.state.username,
                        password: this.state.password
                    }
                })
                .then(function (response) {
                    if(response.data.result=='success'){
                        Alert.alert('แจ้งเตือน',
                            'สมัครสมาชิกสำเร็จ',
                            [
                            { text: "ตกลง", onPress: () => me.state.navigation.popToTop() }
                            ],
                            { cancelable: false }
                        );
                    }else{
                        console.log('aaa');
                        Alert.alert('แจ้งเตือน',
                            'มีผู้ใช้ username นี้แล้ว',
                            [
                            { text: "ตกลง", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
    }

    render() {
        return (
            <ScrollView style={{backgroundColor:"#0c0c0ced",paddingVertical: "2%",paddingHorizontal: "12%",}}>
                <Text style={styles.text}>Register</Text>
                <Input 
                    style={styles.input} placeholder={"Username"} placeholderTextColor={"#9C9C9C"} 
                    onChangeText={(username) => {
                        this.state.username = username.toLowerCase();
                    }}/>
                <Input style={styles.input} placeholder={"Password"} placeholderTextColor={"#9C9C9C"}
                    secureTextEntry={true}
                    onChangeText={(password) => {
                        this.state.password = password;
                    }}/>

                <TouchableOpacity style={styles.submitButton} onPress={()=>this.submitdata()}>
                {/* onPress={() => Alert.alert('Button with adjusted color pressed')} */}
                <Text style={styles.button}>Submit</Text>
                </TouchableOpacity> 
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#9C9C9C",
        // paddingTop: "2%",
        paddingBottom: "5%",
        marginBottom: "5%",
        fontSize: 18,
        color: "#9C9C9C",
        paddingLeft: "5%",
        paddingRight: "5%",
        marginTop: "2%"
      },
      text:{
        marginTop: "20%",
        marginBottom: "10%",
        fontSize: 25,
        color: "#FFFFFF",
        textAlign: "center",
      },
      submitButton: {
        width: "100%",
        overflow: "hidden",
        borderRadius: 2,
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: "#3CB371"
      },
      button: {
        fontSize: 18,
        textAlign: "center",
        paddingVertical: "3%",
        color: "#FFFFFF"
      },
});