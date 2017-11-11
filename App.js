import React, { Component } from 'react'
import { View, FlatList, Text, StatusBar } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import { StackNavigator } from 'react-navigation'
import BartAPI from './BartAPI'

import Sentry from 'sentry-expo'
// import { SentrySeverity, SentryLog } from 'react-native-sentry';
Sentry.config('https://0f075a9222c145849a5b3f7d57dbd637@sentry.io/243329').install()

class HomeScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      routes: [],
      error: null,
      refreshing: false
    }

    this.apiKey = 'MW9S-E7SL-26DU-VV8V'
    this.bartAPI = new BartAPI(this.apiKey)

  }

  getRoutes () {
    this.bartAPI.getRoutes()
      .then(routes => {
        this.setState({
          routes: routes
        })
      })
      .catch(error => {

      })
  }

  componentDidMount () {
    StatusBar.setHidden(true)
    this.getRoutes()
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getRoutes()
      }
    )
  }

  renderSeparator = (item) => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: item.leadingItem.hexcolor,
        }}
      />
    )
  }

  render () {
    return (
      <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
        <FlatList
          data={this.state.routes}
          renderItem={({item}) => (
            <ListItem
              roundAvatar
              onPress={() => this.props.navigation.navigate('Details', {route: item})}
              title={item.name}
              subtitle={<Text style={{color: item.hexcolor}}>{item.routeID}</Text>}
              containerStyle={{borderBottomWidth: 0}}
            />
          )}
          keyExtractor={item => item.routeID}
          ItemSeparatorComponent={(item) => this.renderSeparator(item)}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}

        />
      </List>
    )
  }
}

class DetailsScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      route: {
        stations: [
          {
            key: null,
            etd: [
              {
                estimate: [
                  {
                    minutes: null
                  }]
              }]
          }]
      },
      departureStation: {name: null},
      furthestStation: {name: null},
      error: null,
      refreshing: false
    }

    this.apiKey = 'MW9S-E7SL-26DU-VV8V'
    this.bartAPI = new BartAPI(this.apiKey)
  }

  getRouteInfo = (routeNumber) => {
    this.bartAPI.getRouteInfo(routeNumber)
      .then(route => {
        this.getETDs(route)
      })
      .catch(error => {})
  }
  getETDs = (route) => {

    // Retrieve all ETDs and map to stations in the current Route
    this.bartAPI.getETDs()
      .then(updatedStations => {
        route.stations.forEach((preStation, i) => {
          for (let updatedStation of updatedStations) {
            if (route.stations[i].key === updatedStation.key) {
              route.stations[i] = updatedStation
            }
          }
        })

        this.setState({
          route,
          refreshing: false
        })
      })
      .catch(error => {})
  }

  getETD = (station) => {
    if (this.state.route.destination && station.etd) {
      for (let i = 0; i < station.etd.length; i++) {
        let etd = station.etd[i]
        if (etd && etd.estimate.length && etd.abbreviation.toLowerCase() === this.state.route.destination.toLowerCase()) {
          let backETD = this.getBackETD(station, etd.estimate[0].direction) || {estimate: [{minutes: null}]}
          return {destETD: etd.estimate[0], backETD: backETD.estimate[0]}
        }
      }
      return {destETD: null, backETD: null}
    } else {
      return {destETD: null, backETD: null}
    }
  }

  // Given a station with ETDs of trains going both directions, look for the next training going the opposite direction
  getBackETD = (station, destDirection) => {
    let backETDs = []
    for (let i = 0; i < station.etd.length; i++) {
      let etd = station.etd[i]
      if (etd.estimate[0].direction.toLowerCase() !== destDirection.toLowerCase()) {
        // assume a train going the opposite direction and useful for back-barting
        backETDs.push(etd)
      }
    }
    // Which is the next train (lowest etd)?
    if (backETDs.length) {
      let prevMins
      let currMins
      backETDs.reduce((prev, curr) => {
        prevMins = isNaN(parseInt(prev.estimate[0].minutes, 10)) ? 0 : parseInt(prev.estimate[0].minutes, 10)
        currMins = isNaN(parseInt(curr.estimate[0].minutes, 10)) ? 0 : parseInt(curr.estimate[0].minutes, 10)
        return prevMins < currMins ? prev : curr
      })
      return backETDs[0]
    }
    return null
  }

  componentDidMount () {
    this.getRouteInfo(this.props.navigation.state.params.route.number)
    this.refreshInterval = setInterval(() => {
      this.handleRefresh(false)
    }, 10000)
  }

  componentWillUnmount () {
    clearInterval(this.refreshInterval)
  }

  handleRefresh = (showRefresh) => {
    this.setState(
      {
        refreshing: showRefresh
      },
      () => {this.getETDs(this.state.route)}
    )
  }

  selectStation = (station) => {
    if (!station.abbr) {
      return
    }
    console.log(`selected station: ${station.abbr}`)
    this.setState({departureStation: station})

    let stations = this.state.route.stations
    let departureStationIdx
    let totalTravelTime = 0

    // get position in array for depatureStation and work backwards
    for (let i = 0; i < stations.length; i++) {
      if (stations[i].abbr.toLowerCase() === station.abbr.toLowerCase()) {

        // Found selected station
        departureStationIdx = i
        if (departureStationIdx) {

          for (let j = departureStationIdx - 1; j >= 0; j--) {
            // iterate through earlier stations summing time between stations until we run out of time
            let currentStationETD = isNaN(parseInt(this.getETD(stations[j + 1]).destETD.minutes, 10)) ? 0 : parseInt(this.getETD(stations[j + 1]).destETD.minutes, 10)
            let nextStationETD = isNaN(parseInt(this.getETD(stations[j]).destETD.minutes, 10)) ? 0 : parseInt(this.getETD(stations[j]).destETD.minutes, 10)

            if (nextStationETD > currentStationETD) {
              // this is the last stop for this train
              console.log(`Get on the train here: ${stations[i].abbr}`)
              this.setState({furthestStation: stations[j + 1]})
              break
            }
            totalTravelTime = (currentStationETD - nextStationETD) + totalTravelTime
            console.log(`Station: ${stations[j].abbr}; Total Travel Time: ${totalTravelTime}`)

            if (totalTravelTime >= nextStationETD) {
              // not enough time
              console.log('Go back to: ' + stations[j + 1].abbr)
              this.setState({furthestStation: stations[j + 1]})
              break
            }
          }

        }
        break
      }

    }

  }

  getSubtitle = (station) => {
    if (!station.key) {
      return ''
    }
    let etdObj = this.getETD(station)
    let destETDMinsStr
    let backETDMinsStr

    if (etdObj && etdObj.destETD && etdObj.destETD.minutes) {
      destETDMinsStr = etdObj.destETD.minutes
    }

    if (etdObj.backETD && etdObj.backETD.minutes) {
      backETDMinsStr = etdObj.backETD.minutes
    }

    return `Dest: ${destETDMinsStr || ''} | Back: ${backETDMinsStr || ''}`
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: this.state.route.hexcolor,
          marginLeft: '14%'
        }}
      />
    )
  }

  render () {
    return (
      <View>
        <Text>From {this.state.departureStation.name}</Text>
        <Text>Go back to {this.state.furthestStation.name}</Text>
        <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
          <FlatList
            data={this.state.route.stations}
            renderItem={({item}) => (
              <ListItem
                roundAvatar
                title={item.key}
                subtitle={this.getSubtitle(item)}
                containerStyle={{borderBottomWidth: 0}}
                onPress={() => this.selectStation(item)}
              />
            )}
            keyExtractor={item => item.key}
            ItemSeparatorComponent={this.renderSeparator}
            onRefresh={() => this.handleRefresh(true)}
            refreshing={this.state.refreshing}

          />
        </List>
      </View>
    )
  }
}

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home',
    },
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      headerTitle: 'Stations',
    },
  },
})

export default RootNavigator