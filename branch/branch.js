import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    FlatList,
    TouchableHighlight,
    AsyncStorage,
    Picker,
    Platform,
    ActivityIndicator,
    Linking,
    Alert
} from 'react-native';
import { Button, Icon, Avatar, Card, Divider, Header, CheckBox } from 'react-native-elements';
import { NavigationBar } from 'navigationbar-react-native';
import httpServices from "../../services/http";
import Images from "../../config1";
import FlexImage from "react-native-flex-image";
import HTML from "react-native-render-html";
import Tags from "react-native-tags/Tags";
import { MapView, Constants, Location, Permissions } from 'expo';


const styles1 = StyleSheet.create({
    lineStyle: {
        borderWidth: 0.5,
        borderColor: 'black',
        margin: 10,
    },
});

export default class BranchViewScreen extends React.Component {

    componentWillMount() {
        console.log("componentWillMount");
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            console.log(this._getLocationAsync());
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        var me = this;
        const subscriber = Location.watchPositionAsync({
            timeInterval: 1000,
        }, (location) => {
            console.log('Location change: ', location);
            me.setState({
                region: {
                    latitude: Number(location.coords.latitude),
                    longitude: Number(location.coords.longitude),
                    latitudeDelta: 0.00500,
                    longitudeDelta: 0.00500
                }
            });
            // //console.log(me.map.getCamera());
            // me.map.animateToCoordinate({
            // latitude: Number(location.coords.latitude),
            // longitude: Number(location.coords.longitude),
            // latitudeDelta: 0.00001,
            // longitudeDelta: 0.000001
            // }, 100);
        });
        this.setState({ subscriber });
    };

    static navigationOptions = ({ navigation }) => ({
        headerTitle: <Text style={{ fontFamily: 'kanit' }}>สาขา</Text>,
        headerStyle: {
            backgroundColor: '#fff'
        },
    })

    state = {
        navigation: this.props.navigation,
        cliam: this.props.navigation.getParam("cliam"),
        branch_data: [],
        children: [],
        location: {
            latitude: null,
            longitude: null
        },
        errorMessage: null,
        // region: {
        // latitude: 15.8700,
        // longitude: 100.9925,
        // latitudeDelta: 0.0922,
        // longitudeDelta: 0.0421,
        // }
        // region: {
        // latitude: 37.78825,
        // longitude: -122.4324,
        // latitudeDelta: 0.0922,
        // longitudeDelta: 0.0421,
        // }
    };



    constructor(props) {
        super(props);

        var me = this;
        httpServices.get("branch/getBranchAll.php", function (data) {
            me.setState({ branch_data: data.data });
            console.log("read api")
            //console.log(data.data);
            me.appendChild(data.data);
        });
        console.log("constructor");
    }

    appendChild(data) {
        console.log("appendChild");
        console.log(data)
        data.map((item, index) => {
            if (item.lat_mps != null && item.lng_mps != null && Number(item.lat_mps) > 0 && Number(item.lng_mps) > 0) {
                console.log(">>> " + index)
                console.log(item);
                this.setState({
                    children: [
                        ...this.state.children,
                        <MapView.Marker
                            key={index + 1}
                            // pinColor={'yellow'}
                            coordinate={
                                {
                                    latitude: Number(item.lat_mps),
                                    longitude: Number(item.lng_mps)
                                }
                            }
                            title={item.branch_name}
                            description={item.address + " " + item.province + " " + item.phone}
                            onPress={() => {

                                Alert.alert(
                                    'นำทาง',
                                    'ต้องการการนำทางหรือไม่',
                                    [
                                        { text: 'ไม่ต้องการ', onPress: () => this.setState({ save: false }), style: 'cancel' },
                                        {
                                            text: 'ต้องการ', onPress: () => {
                                                var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=" + item.lat_mps + "," + item.lng_mps;
                                                Linking.canOpenURL(url).then(supported => {
                                                    if (!supported) {
                                                        console.log('Can\'t handle url: ' + url);
                                                    } else {
                                                        return Linking.openURL(url);
                                                    }
                                                }).catch(err => console.error('An error occurred', err));

                                            }
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            }}
                        />
                    ]
                });
            }
        })
    }

    render() {
        var width = Dimensions.get('window').width;
        if (this.state.region == null) {
            return <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={this.state.region}
                        ref={map => {
                            this.map = map
                        }}
                    >
                        <MapView.Marker
                            key={0}
                            // pinColor={'yellow'}
                            coordinate={
                                {
                                    latitude: this.state.region.latitude,
                                    longitude: this.state.region.longitude
                                }
                            }
                            title={"คุณอยู่ที่นี้"}
                        />
                        {this.state.children.map(child => child)}
                        {/* {
this.state.branch_data.map((item, index) => (

(item.lat_mps != null && item.lng_mps != null)?


(
<MapView.Marker
key={index + 1}
// pinColor={'yellow'}
coordinate={
{
latitude: Number(item.lat_mps),
longitude: Number(item.lng_mps)
}
}
title={item.branch_name}
description={item.address + " " + item.province + " " + item.phone}
onPress={()=>{

Alert.alert(
'นำทาง',
'ต้องการการนำทางหรือไม่',
[
{text: 'ไม่ต้องการ', onPress: () => this.setState({save:false}), style: 'cancel'},
{
text: 'ต้องการ', onPress: () => {
var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination="+item.lat_mps+","+item.lng_mps;
Linking.canOpenURL(url).then(supported => {
if (!supported) {
console.log('Can\'t handle url: ' + url);
} else {
return Linking.openURL(url);
}
}).catch(err => console.error('An error occurred', err));

}
},
],
{cancelable: false}
)



}}
/>):null

))} */}
                    </MapView>

                </View>
            );
        }
    }
}