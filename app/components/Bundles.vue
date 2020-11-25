<template>
  <div>
    <Layout>
      <template v-slot:title>
        {{$config.title}}
      </template>
      <Padding>
        <h2 class="text-xl font-semibold my-8">
          {{$config.description}}
        </h2>
        <div class="grid grid-cols-4 gap-4" v-if="bundles.length">
          <div class="mr-4" v-for="bundle in bundles" :key="bundle._id">
            <a v-bind:href="'/bundles/' + bundle.slug">
              <img v-bind:src="bundle.image_url" />
              <h3 class="mt-4 text-xl font-bold" v-text="bundle.name" />
            </a>
          </div>
        </div>
        <div v-if="!bundles.length" class="border-gray-400 border-4 border-dashed">
          <p class="p-8 text-gray-600 font-semibold">We don't have any active deals right now.</p>
        </div>
      </Padding>
      <InfoPanel />
    </Layout>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { groq } from '@nuxtjs/sanity'
  const query = groq`*[_type == "bundle" && published == true]{'image_url': image.asset->url, ...}`

  @Component({ components: {} })
  export default class Bundles extends Vue {
    bundles: Array<any> = []

    async mounted() {
      const result = await this.$sanity.fetch<any>(query)
      this.bundles = result
    }
  }
</script>