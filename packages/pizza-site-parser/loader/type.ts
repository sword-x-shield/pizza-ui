export interface ComponentPartsType {
  title: string
  language: string
  fileName: string
  template: string
  script: string
  style: string
  content: string
  code: string
}

export type ExampleListType = Array<{
  id: string
  variable: string
  title: string
  tag: string
  fileName: string
}>
