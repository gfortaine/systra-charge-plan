import { HttpLink } from 'apollo-link-http'

export default function createUploadLink (options) {
  return new HttpLink(options)
}
