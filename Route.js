export default class Route {
  constructor (abbr, color, hexcolor, name, number, routeID, origin, destination, direction, holidays, num_stns, stations) {
    this.abbr = abbr
    this.color = color
    this.hexcolor = hexcolor
    this.name = name
    this.number = number
    this.routeID = routeID
    this.origin = origin
    this.destination = destination
    this.direction = direction
    this.holidays = holidays
    this.num_stns = num_stns
    this.stations = stations
  }
}