import React from "react";
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert} from 'react-native';
import { Button } from 'react-native-elements';
import FlexImage from "react-native-flex-image";
import httpServices from "../../services/http";
import { AsyncStorage } from "react-native"
import * as Facebook from 'expo-facebook'; 



export default class LoginScreen extends React.Component {

    constructor(prop){
        super(prop)

        this.state = { Login:{Tel:'' ,Password:''} ,Email: '' , navigation:this.props.navigation,token:null,input:[]};
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: <Text style={ {fontFamily: 'kanit'} }>Login</Text>,
        headerStyle: {
            backgroundColor: '#fff'
        },
    })

    async  logIn() {
        console.log("LoginFacebook In")
        var me = this;
        const { type, token } = await Facebook.logInWithReadPermissionsAsync(
            "230232821493607",
            {
                permissions: ["public_profile","email"],
                behavior:'browser'
            }
        );
        console.log("LoginFacebook")
        console.log(type)
        if (type === "success") {
            console.log(token)
            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
            const jsondata = await response.json();

                res = jsondata;
            
                httpServices.post("user/facebookLogin.php",{
                    email:res.email
                },function (data) {
                    console.log("LoginFacebook")
                    console.log("---"+data)
                    if(data.success==true) {
                        me._saveUserId(res.email)
                        me._saveToken(data.data.token)
                        me.state.navigation.popToTop()
                    }else{
                        alert("ไม่สามารถเข้าสู่ระบบได้");
                    }
                });
            // Handle successful authentication here
        } else {
            // Handle errors here.
        }
    }
    async _saveToken(token){
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            // Error saving data
        }
    }

    async _saveUserId(user_id){
        try {
            await AsyncStorage.setItem('user_id', user_id);
        } catch (error) {
            // Error saving data
        }
    }

    validateTel(text){
        const reg = /^\d{10}$/;
        if(reg.test(text) == false){
            Alert.alert(                
            'แจ้งเตือน',
            'กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 10 หลัก',
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

    localLogIn(){
        var me = this;
        if(this.state.Login.Tel!=null && this.state.Login.Tel !='' && this.state.Login.Password!=null && this.state.Login.Password!=''){
            if(this.validateTel(this.state.Login.Tel)==true){
                    httpServices.post("user/login.php?email=&password="+this.state.Login.Password+"&user="+this.state.Login.Tel+"&seq=3",{
                        // email:this.state.Email,
                        // password:this.state.Password
                    },function (data) {
                        const result = data
                        console.log(result);
                        if(result.success==true) {
                            me._saveUserId(me.state.Login.Tel)
                            me._saveToken(result.data.token)
                            me.state.navigation.popToTop()
                        }
                        if(result.success==false){
                            console.log(me.state.Login);
                            Alert.alert(
                                "แจ้งเตือน",
                                "กรุณาใส่ Email ที่เคยลงทะเบียน",
                                [
                                    {
                                        
                                        text: 'OK', onPress: () => {
                                            me.state.navigation.push("EmailLogin",{"Login": me.state.Login})
                                        }
                                    },
                                ],
                                {cancelable: false}
                            )
                            // me.state.navigation.push("EmailLogin",{"Login": me.state.Login})
                        }
                    });
            }
        }else{
            alert("กรุณากรอกเบอร์และรหัสผ่าน");
        }
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:"#333333"}}>
                <View  style={{ justifyContent: 'center',
                    alignItems: 'center'}}>
                        <Image resizeMode={'cover'} style={{width:300, height: 200 }}
                            source={require('../../assets/image/logo-web.png')}
                        />
                </View>
                <View style={{flexDirection: 'row'}}>

                    <Image  style={{width:23, height: 23 ,left:12 ,top:10 }}
                           source={require('../../assets/image/Group460.png')}
                    />
                    
                    <TextInput
                        style={styles.fontInputLogin}
                        placeholderTextColor="#5c6573"
                        placeholder='เบอร์โทรศัพท์'
                        onChangeText={(text) => {
                            this.state.Login.Tel = text
                        }}
                    />

                </View>
                <View style={{flexDirection: 'row',top:15}}>
                    <Image resizeMode={'cover'} style={{width:23, height: 23 ,left:12,top:10 }}
                           source={require('../../assets/image/Group461.png')}
                    />
                    <TextInput
                        textContentType={'password'}
                        keyboardType={'default'}
                        placeholderTextColor="#5c6573"
                        placeholder='รหัสผ่าน'
                        style={styles.fontInputLogin}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.state.Login.Password = text;
                            this.setState(this.state);
                        }}
                        value={this.state.Password}
                    />
                </View>
                <View>
                    <Button textStyle={styles.buttonLogin} title={"เข้าสู่ระบบ"} onPress={()=>this.localLogIn()}  backgroundColor='red' buttonStyle={{marginTop:50,marginLeft:20,marginRight:20}} />
                </View>
                <View>
                    <Button textStyle={styles.buttonLogin} title={"เข้าสู่ระบบ ด้วย Facebook"} onPress={()=>this.logIn()}  backgroundColor='#3b5998' buttonStyle={{marginTop:10,marginLeft:20,marginRight:20}} />

                </View>

                <View style={{top:15,bottom:30}}>
                    <Button textStyle={{color:'#5c6573', fontFamily:'kanit'}} title={"ลืมรหัสผ่าน ?"}  transparent={true} />
                </View>
                <View
                    style={{
                        top:15,
                        borderBottomColor: '#5c6573',
                        borderBottomWidth: 1,
                        marginLeft:30,
                        marginRight:30
                    }}
                />
                <View style={{ alignItems: 'center'}}>
                <View style={{flexDirection: 'row',top:15}}>
                    <Button textStyle={styles.buttonLogin} title={"ลงทะเบียนสมัครใช้งาน"}  onPress={()=>this.state.navigation.push("Register1",{register:true})}   transparent={true} />

                </View>
                </View>
            </View>
        )
    }
}
