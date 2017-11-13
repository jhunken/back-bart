import React, { Component } from 'react'
import { ListItem } from 'react-native-elements'

const StationItem = (props) => {

  let item = props.station.item
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
        onPress={() => props.selectStation(item)}
      />)
  }
  return null
}

export default StationItem