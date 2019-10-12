<template>
  <Vssue
    v-if="commentService === 'vssue'"
    v-bind="propsWithoutEmptyProperties"
    :title="$page.title"
  />
  <vue-disqus
    v-else-if="commentService === 'disqus'"
    v-bind="propsWithoutEmptyProperties"
    :identifier="$page.key"
  />
</template>

<script>
  import identity from 'lodash/identity'
  import pickBy from 'lodash/pickBy'

  export default {
    props: {
      // vssue's props
      title: {
        type: String | Function,
        required: false
      },
      issueId: {
        type: String | Number,
        required: false
      },
      options: {
        type: Object,
        required: false
      },
      // vue-disqus's props
      shortname: {
        type: String,
        required: false
      },
      identifier: {
        type: String,
        required: false
      },
      url: {
        type: String,
        required: false
      },
      title: {
        type: String,
        required: false
      },
      remote_auth_s3: {
        type: String,
        required: false
      },
      api_key: {
        type: String,
        required: false
      },
      sso_config: {
        type: Object,
        required: false
      },
      language: {
        type: String,
        required: false
      }
    },

    data () {
      return {
        commentService: COMMENT_SERVICE
      }
    },

    computed: {
      propsWithoutEmptyProperties () {
        return pickBy(this.$props, identity);
      }
    },

    mounted () {
      if (typeof COMMENT_SERVICE === 'undefined') console.warn("There's no comment service!")
    },
}
</script>

