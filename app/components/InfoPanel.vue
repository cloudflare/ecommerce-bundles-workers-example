<template>
  <div class="bg-blue-100 mt-16 mb-8 py-16 flex">
    <div class="lg:w-2/3">
      <Padding>
        <h2 class="text-2xl font-semibold">
          How it works
        </h2>
        <p class="text-lg mt-6 max-w-3xl">
          We work with our favorite authors, course creators, and teachers in the software development world to bring their content to you at a great deal.
          When you buy from {{$config.title}}, the proceeds from the sale are split evenly between the authors.
        </p>
        <p class="text-lg mt-2 max-w-3xl">
          <span class="font-bold">Want to work with us on selling your book, course, or software?</span> <a class="text-blue-800 underline" :href="$config.email">Reach out via email</a> and let us know.
        </p>
        <p class="text-lg mt-2 max-w-3xl">
          Developers - curious how this works? The source code for this project is completely open-source. You can take it and build your own e-commerce platform deployed using serverless functions. <a class="text-blue-800 underline" href="https://github.com/signalnerve/ecommerce-bundle-workers">Check it out on GitHub.</a>
        </p>
      </Padding>
    </div>
    <div class="hidden w-1/3 md:flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    </div>
  </div>
</template>