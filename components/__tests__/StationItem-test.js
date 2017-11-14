import React from 'react'
import 'react-native'

import renderer from 'react-test-renderer'

import StationItem from '../StationItem'
import { stations } from '../../config/jest/mockData'

test('renders an empty station correctly', () => {
  const tree = renderer.create(
    <StationItem
      station={stations[0]}
      selectStation={jest.fn()}
      departureStation={jest.fn()}
    />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders a valid station correctly', () => {
  const tree = renderer.create(
    <StationItem
      station={stations[1]}
      selectStation={jest.fn()}
      departureStation={jest.fn()}
    />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})