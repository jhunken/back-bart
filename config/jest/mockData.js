export const stations = [
  {
    name: 'station 1',
    abbr: 'stn1',
    hasETD: false
  },
  {
    'name': 'Warm Springs/South Fremont',
    'abbr': 'WARM',
    'etd': [{
      'destination': 'Daly City',
      'abbreviation': 'DALY',
      'limited': '0',
      'estimate': [{
        'minutes': 'Leaving',
        'platform': '2',
        'direction': 'South',
        'length': '10',
        'color': 'GREEN',
        'hexcolor': '#339933',
        'bikeflag': '1',
        'delay': '99'
      }, {
        'minutes': '22',
        'platform': '2',
        'direction': 'South',
        'length': '10',
        'color': 'GREEN',
        'hexcolor': '#339933',
        'bikeflag': '1',
        'delay': '0'
      }, {
        'minutes': '37',
        'platform': '2',
        'direction': 'South',
        'length': '10',
        'color': 'GREEN',
        'hexcolor': '#339933',
        'bikeflag': '1',
        'delay': '0'
      }]
    }],
    'key': 'WARM',
    'hasETD': true,
    'destETD': {
      'minutes': 'Leaving',
      'platform': '2',
      'direction': 'South',
      'length': '10',
      'color': 'GREEN',
      'hexcolor': '#339933',
      'bikeflag': '1',
      'delay': '99'
    },
    'backETD': {'minutes': null}
  }
]