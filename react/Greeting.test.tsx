import React from 'react'
import { render } from '@vtex/test-tools/react'

import Speech from './Speech'

test('greets Fred', () => {
  const { queryByText } = render(<Speech name="Fred" />)

  expect(queryByText('Hey, Fred')).toBeInTheDocument()
})
