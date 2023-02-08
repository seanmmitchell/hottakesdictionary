<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const route = useRoute()

const navigation = [
  { name: 'Search', routeName: 'home' },
  { name: 'About', routeName: 'about' }
]
</script>

<template>
    <Disclosure as="nav" class="bg-slate-900" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <DisclosureButton class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="sr-only">Open Main Menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <router-link :to="{name: 'home'}">
                <h2 class="text-lg font-semibold text-white">Hot Takes Dictionary</h2>
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <router-link v-for="item in navigation" :key="item.name" :to="{ name: item.routeName }" :class="[(route.name == item.routeName) ? 'bg-[#176087] text-white' : 'text-gray-300 hover:bg-[#62B7E4] hover:text-white', 'px-8 py-2 rounded-md text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</router-link>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3">
          <router-link v-for="item in navigation" :key="item.name" :to="{ name: item.routeName }"  >
            <DisclosureButton :class="[(route.name == item.routeName) ? 'bg-[#176087] text-white' : 'text-gray-300 hover:bg-[#62B7E4] hover:text-white', 'w-full mb-2 mx-auto block px-3 py-2 rounded-md text-base font-medium']" :aria-current="item.current ? 'page' : undefined">
              {{ item.name }}
            </DisclosureButton>
          </router-link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </template>