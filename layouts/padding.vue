<template>
  <Header />
  <div class="flex flex-col">
    <div class="header_offset pt-30 md:pt-24 p-5 flex-1 min-h-screen flex flex-col">
      <Breadcrumbs />
      <slot />
    </div>
    <Footer />
  </div>
</template>
