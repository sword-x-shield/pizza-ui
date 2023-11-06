export interface Snippet {
  prefix: string
  body: string | string[]
  description?: string
  scope?: string | string[]
  'snippet-syntax-highlighting'?: boolean
}
