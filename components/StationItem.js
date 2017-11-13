import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { ListItem, Text } from 'react-native-elements'

const StationItem = (props) => {
  let item = props.station
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
        title={(<Text style={styles.title}>{item.key}</Text>)}
        subtitle={getSubtitle(item)}
        containerStyle={{borderBottomWidth: 0}}
        onPress={() => props.selectStation(item)}
        underlayColor='#E0F2F1'
        style={(props.departureStation && props.departureStation.abbr && item.abbr.toLocaleLowerCase() === props.departureStation.abbr.toLowerCase()) ? styles.selected : {}}
      />)
  }
  return null
}

export const styles = StyleSheet.create({
  selected: {
    backgroundColor: '#B2DFDB',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 4,
    paddingBottom: 4,

  },
})

export default StationItem