import React, { useEffect, useState } from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [forecast, setForecast] = useState(null);

  const apiKey = '247f4df1f41b3e75dbd3577d57c55c53';

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('donne les perms sur le tel');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            const lon = location.coords.longitude;
            const lat = location.coords.latitude;

            fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then((response) => response.json())
                .then((json) => {
                    setWeatherData(json);
                });

            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then((response) => response.json())
                .then((json) => {
                    const dailyForecast = [];
                    for (let i = 0; i < json.list.length; i += 8) {
                        dailyForecast.push(json.list.slice(i, i + 8));
                    }
                    setForecast({ ...json, list: dailyForecast });
                });
        })();
    }, []);
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scroll}>
          {weatherData && (
              <View style={styles.act}>
                <Text style={{fontSize:30, fontWeight: 'bold'}}>Température actuelle</Text>
                <Text style={styles.info}>Heure: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.info}>Ville: {weatherData.name}</Text>
                <Text style={styles.info}>Température: {weatherData.main.temp}°C</Text>
                <Text style={styles.info}>Description: {weatherData.weather[0].description}</Text>
                <Image
                    style={{width: 150, height: 150}}
                    source={{uri: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}}
                />
              </View>
          )}
          {forecast ? (
              forecast.list.map((dayForecast, index) => (
                  <View key={index}>
                      <Text style={styles.date}>{new Date(dayForecast[0].dt_txt).toLocaleDateString()}</Text>
                      <ScrollView horizontal>
                          {dayForecast.map((item, index) => (
                              <View key={index} style={styles.carte}>
                                  <Text>Heure: {new Date(item.dt_txt).toLocaleTimeString()}</Text>
                                  <Text>Température: {item.main.temp}°C</Text>
                                  <Text>Description: {item.weather[0].description}</Text>
                                  <Image
                                      style={{width: 50, height: 50}}
                                      source={{uri: `http://openweathermap.org/img/w/${item.weather[0].icon}.png`}}
                                  />
                              </View>
                          ))}
                      </ScrollView>
                  </View>
              ))
          ) : (
              <Text>Chargement...</Text>
          )}
      </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: 'white',
  },

  info: {
    fontSize: 20,
    color: 'black',
  },

  carte : {
    borderColor: 'black',
    margin: 5,
    padding: 10,
    borderWidth : 1,
      backgroundColor: 'lightblue',
  },

  act: {
    borderColor: 'black',
      borderWidth : 1,
    border : 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',

  },

    date: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        textAlign: 'center',
    },

})

