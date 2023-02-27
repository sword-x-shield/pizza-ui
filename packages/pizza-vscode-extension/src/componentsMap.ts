export interface ComponentDescriptor {
  template: string
}

export const componentsMap: Record<string, ComponentDescriptor> = {
  'anchor': {
    template:
`
<p-anchor>
  <p-anchor-link title="default" href="#default" />
</p-anchor>
`,
  },
  'anchor-link': {
    template: '<p-anchor-link title="default" href="#default" />',
  },
  'affix': {
    template:
`
<p-affix :offset-top="50">
  <div>block</div>
</p-affix>
`,
  },
};
