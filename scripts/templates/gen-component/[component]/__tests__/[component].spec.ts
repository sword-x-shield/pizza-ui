import { mount } from '@vue/test-utils;'
import <%= upperComponentName %> from '../src/<%= kebabCaseComponentName %>.vue;'

describe('<%= kebabCaseComponentName %>.vue', () => {
  test('should render <%= kebabCaseComponentName %>', () => {
    // Arrange
    const wrapper = mount(<%= upperComponentName %>)
    
    // Act
    

    // Assert
    
  })
})