// @ts-ignore
import { findPageByKey } from '@app/util'
// @ts-ignore
import frontmatterClassifiedMap from '@dynamic/vuepress_blog/frontmatterClassified'
import { VuePressPage } from '../types/VuePress'

class Classifiable {
  private _metaMap: any

  constructor(metaMap, pages) {
    this._metaMap = Object.assign({}, metaMap)
    Object.keys(this._metaMap).forEach(name => {
      const { pageKeys } = this._metaMap[name]
      this._metaMap[name].pages = pageKeys.map(key => findPageByKey(pages, key))
    })
  }

  get length() {
    return Object.keys(this._metaMap).length
  }

  get map() {
    return this._metaMap
  }

  get pages() {
    return this.list
  }

  get list() {
    return this.toArray()
  }

  toArray() {
    const tags: Array<{
      name: string
      pages: VuePressPage[]
      path: string
    }> = []

    Object.keys(this._metaMap).forEach(name => {
      const { pages, path } = this._metaMap[name]
      tags.push({ name, pages, path })
    })
    return tags
  }

  getItemByName(name) {
    return this._metaMap[name]
  }
}

export default ({ Vue }) => {
  const computed = Object.keys(frontmatterClassifiedMap)
    .map(classifiedType => {
      const map = frontmatterClassifiedMap[classifiedType]
      const helperName = `$${classifiedType}`
      return {
        [helperName]() {
          // @ts-ignore
          const { pages } = this.$site
          const classified = new Classifiable(map, pages)
          return classified
        },
        [`$current${classifiedType.charAt(0).toUpperCase() +
          classifiedType.slice(1)}`]() {
          // @ts-ignore
          const tagName = this.$route.meta.id
          // @ts-ignore
          return this[helperName].getItemByName(tagName)
        },
      }
    })
    .reduce((map, item) => {
      Object.assign(map, item)
      return map
    }, {})

  computed.$frontmatterKey = function() {
    // @ts-ignore
    const target = this[`$${this.$route.meta.id}`]
    if (target) {
      return target
    }
    return null
  }

  Vue.mixin({
    computed,
  })
}
