<template>
  <div>
    <Layout>
      <template v-slot:title>
        <span v-text="bundle.name" />
      </template>
      <Padding>
        <div class="lg:flex" v-if="bundle.name">
          <div class="lg:w-1/2 lg:max-w-5xl lg:mr-8 mt-8">
            <div class="text-lg max-w-3xl">
              <block-content :blocks="child" v-for="child in bundle.description" v-bind:key="child._id" />
            </div>

            <div class="mt-4" v-if="status() === 'active'">
              <span class="inline-flex rounded-md shadow-sm">
                <button type="button" v-on:click="checkout" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
                  <svg class="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Buy for ${{bundle.price}}
                  <span class="italic" v-if="bundle.savings">&nbsp;({{bundle.savings}})</span>
                </button>
              </span>
              <p class="mt-1 text-sm italic">Payments are securely processed by Stripe.</p>
              <p class="mt-4 font-bold">This bundle ends <time v-bind:datetime="bundle.sale_end">{{new Date(bundle.sale_end).toLocaleString()}}</time>.</p>
            </div>

            <div class="mt-4" v-if="status() === 'upcoming'">
              <span class="bg-blue-200 text-blue-900 font-semibold p-2">This bundle begins <time v-bind:datetime="bundle.sale_start">{{new Date(bundle.sale_start).toLocaleString()}}</time>.</span>
            </div>

            <div class="mt-4" v-if="status() === 'ended'">
              <span class="italic">This bundle ended <time v-bind:datetime="bundle.sale_end">{{new Date(bundle.sale_end).toLocaleString()}}</time>.</span>
            </div>

            <div class="mt-8 mb-4">
              <p>Click on one of the products below to learn more about it and the author:</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div v-for="product in bundle.products" :key="product._id" v-bind:class="activeProductClasses(product._id)">
                <button v-on:click="selectProduct(product._id)" class="focus:outline-none">
                  <img class="h-48 object-contain mx-auto" v-bind:src="product.image_url" />
                  <div class="mt-4">
                    <h2 class="font-bold" v-text="product.name" />
                    <h3 class="text-sm" v-text="product.author.name" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div class="lg:-mt-16 bg-gray-200 lg:w-1/2 p-8" v-if="selectedProduct">
            <h2 class="text-2xl font-bold" v-text="selectedProduct.name" />
            <div class="my-6 blocks">
              <block-content :blocks="child" v-for="child in selectedProduct.description" v-bind:key="child._id" />
            </div>
            <hr />
            <div class="my-6 flex items-center">
              <img class="w-8 h-8 rounded-full mr-2" v-bind:src="selectedProduct.author.image_url" />
              <span class="text-lg font-semibold"><a v-bind:href="selectedProduct.author.url" v-text="selectedProduct.author.name" /></span>
            </div>
            <div class="blocks">
              <block-content :blocks="child" v-for="child in selectedProduct.author.description" v-bind:key="child._id" />
            </div>
          </div>
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
  import { loadStripe } from '@stripe/stripe-js';

  @Component({
    components: {},
    head() { return (this as any).customHead }
  })
  export default class Bundle extends Vue {
    bundle: any = {}
    customHead: any = {}
    selectedProduct: any = null
    carouselActive: boolean = true

    activeProductClasses(id: string) {
      const active = this.selectedProduct && this.selectedProduct._id === id
      return {
        'bg-gray-200': active,
        'flex': true,
        'items-center': true,
        'justify-center': true,
        'p-4': true
      }
    }

    selectProduct(id: string) {
      this.carouselActive = false
      this.selectedProduct = this.bundle.products.find(
        (bundle: any) => bundle._id === id
      )
    }

    status() {
      const now = new Date().getTime()
      const start = new Date(this.bundle.sale_start).getTime()
      const end = new Date(this.bundle.sale_end).getTime()
      if (start > now) { return "upcoming" }
      if (end < now) { return "ended" }
      return "active"
    }

    async checkout() {
      const { stripePublicKey } = this.$config
      let stripe
      if (stripePublicKey) stripe = await loadStripe(stripePublicKey)

      try {
        const resp = await fetch(`/api/session`, {
          body: JSON.stringify({ price_id: this.$data.bundle.stripe_price_id }),
          headers: { 'Content-type': 'application/json' },
          method: 'POST'
        })
        const {session_id} = await resp.json()
        if (stripe) stripe.redirectToCheckout({sessionId:session_id})
      } catch (err) {
        console.log(err)
      }
    }

    updateCarousel() {
      if (!this.carouselActive) return
      const products = this.bundle.products
      const currentProductIdx = this.selectedProduct ? products.findIndex((p: any) => p === this.selectedProduct) : -1
      const size = this.bundle.products.length
      let newIdx = currentProductIdx + 1
      if (newIdx >= size) newIdx = 0
      this.selectedProduct = this.bundle.products[newIdx]

      setTimeout(() => {
        this.updateCarousel()
      }, 5000)
    }

    async mounted() {
      const { slug } = this.$route.params
      const query = groq`*[_type == "bundle" && slug == $slug][0] {
        ...,
        open_graph {
          "image_url": image.asset->url,
          ...
        },
        products[]->{
          ...,
          "image_url": image.asset->url,
          author {
            "image_url": image.asset->url,
            ...
          }
        }
      }`
      const result = await this.$sanity.fetch(query, { slug })
      this.bundle = result
      if (this.bundle.products.length) {
        this.updateCarousel()
      }

      const url = `${this.$config.url}${this.$nuxt.$route.fullPath}`
      this.customHead = {
        title: this.bundle.open_graph.title,
        meta: [
          {
            hid: 'og:title',
            name: 'og:title',
            content: this.bundle.open_graph.title
          },
          {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: this.bundle.open_graph.title
          },
          {
            hid: 'description',
            name: 'description',
            content: this.bundle.open_graph.description
          },
          {
            hid: 'og:description',
            name: 'og:description',
            content: this.bundle.open_graph.description
          },
          {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: this.bundle.open_graph.description
          },
          {
            hid: 'og:url',
            name: 'og:url',
            content: url
          },
          {
            hid: 'twitter:url',
            name: 'twitter:url',
            content: url
          },
          {
            hid: 'og:image',
            name: 'og:image',
            content: this.bundle.open_graph.image_url
          },
          {
            hid: 'twitter:image',
            name: 'twitter:image',
            content: this.bundle.open_graph.image_url
          },
        ]
      }
    }
  }
</script>