import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Location from 'expo-location';
import api from '../services/api';

export default function Main({ navigation }) {
    const [currentRegion, setCurrentRegion] = useState(null);
    const [inputBottomValue, setInputBottomValue] = useState(20);
    const [devs, setDevs] = useState([]);
    const [techSearchParams, setTechSearchParam] = useState('');

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;
        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: techSearchParams
            }
        });

        if (response.data.result === 'success') {
            devsArray = response.data.devs;
            setDevs(response.data.devs);    
        }
        if (response.data.result === 'fail' && response.data.message === 'no dev found around with these techs') {
            alert('Não encontramos devs na região que utilizem essas tecnologias!');
        }
           
        
    }
    function handleRegionChanged(Region) {
        setCurrentRegion(Region);
    }

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await Location.requestPermissionsAsync();
            if (granted) {
                const { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                });
            }
        }
        loadInitialPosition();
    }, []);

    if (!currentRegion) {
        return null;
    }

    return (
        <>
            <MapView
                initialRegion={currentRegion}
                style={styles.map}
                onRegionChangeComplete={handleRegionChanged}>
                {devs.map(dev => (
                    <Marker
                        key={dev._id}
                        coordinate={
                            {
                                longitude: dev.location.coordinates[0],
                                latitude: dev.location.coordinates[1]
                            }
                        }>
                        <Image
                            source={
                                {
                                    uri: dev.avatar_url
                                }
                            }
                            style={styles.avatar} />
                        <Callout
                            onPress={() => {
                                navigation.navigate('Profile', { github_username: dev.github_username })
                            }
                            }>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={[styles.searchForm, { bottom: inputBottomValue }]}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Buscar por tecnologias'
                    placeholderTextColor='#999'
                    autoCapitalize='words'
                    autoCorrect={false}     
                    value={techSearchParams}
                    onChangeText={setTechSearchParam}
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={loadDevs}>
                    <MaterialIcons
                        name='my-location'
                        size={20}
                        color='#fff'
                    />
                </TouchableOpacity>
              <KeyboardSpacer topSpacing={50}/>
            </View >
            </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5
    },
    devTechs: {
        marginTop: 5,
    },
    searchForm: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 58,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    searchButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
});