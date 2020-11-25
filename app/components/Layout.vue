<template>
  <div class="min-h-screen text-black">
    <nav>
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <a class="flex items-center flex-shrink-0" href="/">
              <img class="block lg:hidden h-8 w-auto" v-bind:src="$config.logo" v-bind:alt="$config.title">
              <img class="hidden lg:block h-8 w-auto" v-bind:src="$config.logo" v-bind:alt="$config.title">
              <span class="ml-3 font-bold text-xl">{{$config.title}}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="py-10">
      <header>
        <div class="px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight">
            <slot name="title">{{$config.title}}</slot>
          </h1>
        </div>
      </header>
      <main>
        <slot />
      </main>
    </div>
    <div class="py-8">
      <slot name="addtl" />
    </div>
    <Footer />
  </div>
</template>

<style>
ul li { list-style-type: disc; }
.blocks p, .blocks li { margin: 10px 0; }
.blocks a { text-decoration: underline; }
</style>