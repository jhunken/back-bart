'use strict'

import Route from './Route'

export default class BartAPI {
  constructor (apiKey) {
    this.apiKey = apiKey || 'MW9S-E7SL-26DU-VV8V'
  }

  getRoutes = () => {
    const url = `http://api.bart.gov/api/route.aspx?cmd=routes&key=${this.apiKey}&json=y`

    return fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res && typeof res.root !== 'undefined' && typeof res.root.routes !== 'undefined' && typeof res.root.routes.route !== 'undefined' && res.root.routes.route.length) {
          let route
          let routes = []
          for (let resRoute of res.root.routes.route) {
            route = new Route(resRoute.abbr, resRoute.color, resRoute.hexcolor, resRoute.name, resRoute.number, resRoute.routeID)
            routes.push(route)
          }
          return routes
        } else {
          let error = `error retrieving ${url}`
          console.error(error)
          return Promise.reject(error)
        }

      })
      .catch(error => {
        console.error(error)
        return Promise.reject(error)
      })
  }

  getRouteInfo = (routeID) => {
    const url = `http://api.bart.gov/api/route.aspx?cmd=routeinfo&route=${routeID}&key=${this.apiKey}&json=y`

    return fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res && typeof res.root !== 'undefined' && typeof res.root.routes !== 'undefined' && typeof res.root.routes.route !== 'undefined') {
          let stations = []
          let resRoute = res.root.routes.route
          let route = new Route(resRoute.abbr, resRoute.color, resRoute.hexcolor, resRoute.name, resRoute.number, resRoute.routeID, resRoute.origin, resRoute.destination, resRoute.direction, resRoute.holidays, resRoute.num_stns, [])
          resRoute.config.station.forEach(abbr => {
            stations.push({key: abbr})
          })
          route.stations = stations
          return route

        } else {
          let error = `error retrieving ${url}`
          console.error(error)
          return Promise.reject(error)
        }

      })
      .catch(error => {
        console.error(error)
        return Promise.reject(error)
      })
  }

  getETDs = () => {
    let url = `http://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&key=${this.apiKey}&json=y`

    return fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res && typeof res.root !== 'undefined' && typeof res.root.station !== 'undefined') {

          // returns an array of Stations each containing an array of ETDs. Each ETD is a Train departure with a destination
          let stations = []
          res.root.station.forEach(station => {
            station.key = station.abbr
            stations.push(station)
          })
          return stations
        } else {
          // unexpected response
          let error = `error retrieving ${url}`
          console.error(error)
          return Promise.reject(error)
        }
      })
      .catch(error => {
        console.error(error)
        return Promise.reject(error)
      })
  }

  getNextTrain = (routeDest, stationAbbr) => {
    let url = `http://api.bart.gov/api/etd.aspx?cmd=etd&orig=${stationAbbr}&key=${this.apiKey}&json=y`
    return fetch(url)
      .then(res => {
        console.log(res._bodyText)
        return res
      })
      .then(res => res.json())
      .then(res => {
        if (res && typeof res.root !== 'undefined' && typeof res.root.station !== 'undefined') {
          for (let etdStation of res.root.station) {
            for (let etd of etdStation.etd) {
              if (etd.abbreviation.toLowerCase() === routeDest.toLowerCase()) {
                console.log(etd.estimate[0].minutes)
                return etd.estimate[0].minutes
              }
            }

          }

        } else {
          let error = `error retrieving ${url}`
          console.error(error)
          return Promise.reject(error)
        }
      })
      .catch(error => {
        console.error(error)
        return Promise.reject(error)
      })

  }
}