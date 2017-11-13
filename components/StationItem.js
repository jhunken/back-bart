import React, { Component } from 'react'
import { ListItem } from 'react-native-elements'

const StationItem = (props) => {

  let item = props.station.item

  let selectStation = (station) => {
    if (!station.abbr) {
      return
    }
    console.log(`selected station: ${station.abbr}`)
    props.updateDepartureStation(station)

    let stations = props.stations
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
            let currentStationETD = isNaN(parseInt(stations[j + 1].destETD.minutes, 10)) ? 0 : parseInt(stations[j + 1].destETD.minutes, 10)
            let nextStationETD = isNaN(parseInt(stations[j].destETD.minutes, 10)) ? 0 : parseInt(stations[j].destETD.minutes, 10)

            if (nextStationETD > currentStationETD) {
              // this is the last stop for this train
              console.log(`Get on the train here: ${stations[i].abbr}`)
              props.updateFurthestStation(stations[j + 1])
              break
            }
            totalTravelTime = (currentStationETD - nextStationETD) + totalTravelTime
            console.log(`Station: ${stations[j].abbr}; Total Travel Time: ${totalTravelTime}`)

            if (totalTravelTime >= nextStationETD) {
              // not enough time
              console.log('Go back to: ' + stations[j + 1].abbr)
              props.updateFurthestStation(stations[j + 1])
              break
            }
          }

        }
        break
      }
    }
  }

  let getSubtitle = (station) => {
    if (!station.key) {
      return ''
    }
    let destETDMinsStr
    let backETDMinsStr

    if (station && station.destETD && station.destETD.minutes) {
      destETDMinsStr = station.destETD.minutes
      if (destETDMinsStr !== 'Leaving') {
        destETDMinsStr = destETDMinsStr + 'm'
      }
    }

    if (station.backETD && station.backETD.minutes) {
      backETDMinsStr = station.backETD.minutes
      if (backETDMinsStr !== 'Leaving') {
        backETDMinsStr = backETDMinsStr + 'm'
      }
    }

    return `▼ Dest: ${destETDMinsStr || 'n/a'}  ▲ Back: ${backETDMinsStr || 'n/a'}`
  }

  if (item.hasETD) {
    return (
      <ListItem
        roundAvatar
        title={item.key}
        subtitle={getSubtitle(item)}
        containerStyle={{borderBottomWidth: 0}}
        onPress={() => selectStation(item)}
      />)
  }
  return null
}

export default StationItem