import { withInstall } from '@pizza-ui/components/_utils';
import <%= upperComponentName %> from './src/<%= kebabCaseComponentName %>.vue';
export const P<%= upperComponentName %> = withInstall(<%= upperComponentName %>);
export default P<%= upperComponentName %>;
