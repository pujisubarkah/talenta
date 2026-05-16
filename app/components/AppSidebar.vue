<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  mini: { type: Boolean, default: false }
})
import { useRoute } from 'vue-router'
import {
  IconLayoutDashboard,
  IconBook2,
  IconUsers,
  IconTrendingUp,
  IconChevronDown,
} from '@tabler/icons-vue'

const route = useRoute()

type SubMenu = {
  label: string
  href: string
}

type Menu = {
  label: string
  icon: unknown
  href?: string
  children?: SubMenu[]
}

const menus = [
  {
    label: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/home',
  },
  {
    label: 'Referensi',
    icon: IconBook2,
    children: [
      { label: 'Daftar Penilaian', href: '/referensi/daftar-penilaian' },
      { label: 'Daftar Indikator', href: '/referensi/daftar-indikator' },
      { label: 'Daftar Sub Indikator', href: '/referensi/daftar-sub-indikator' },
      { label: 'Daftar Instrumen', href: '/referensi/daftar-instrumen' },
      { label: 'Daftar Jenis Jabatan', href: '/referensi/daftar-jenis-jabatan' },
      { label: 'Daftar Jenjang', href: '/referensi/daftar-jenjang' },
      { label: 'Daftar Table Interval', href: '/referensi/daftar-table-interval' },
      { label: 'Daftar Kotak', href: '/referensi/daftar-kotak' },
      { label: 'Daftar Bobot SKP', href: '/referensi/daftar-bobot-skp' },
      { label: 'Daftar Syarat Suksesi', href: '/referensi/daftar-syarat-suksesi' },
      { label: 'Daftar Indikator Wawancara', href: '/referensi/daftar-indikator-wawancara' },
      { label: 'Daftar Pegawai', href: '/referensi/daftar-pegawai' },
      { label: 'Daftar Jabatan', href: '/referensi/daftar-jabatan' },
      { label: 'Daftar Unit Kerja', href: '/referensi/daftar-unit-kerja' },
    ],
  },
  {
    label: 'Talent Pool',
    icon: IconUsers,
    children: [
      { label: 'Daftar Pegawai - Level 1', href: '/talent-pool/daftar-pegawai-level-1' },
      { label: 'Daftar Pegawai - Level 2', href: '/talent-pool/daftar-pegawai-level-2' },
      { label: 'Daftar Pegawai - Level 3', href: '/talent-pool/daftar-pegawai-level-3' },
      { label: 'Daftar Pegawai - Level 4', href: '/talent-pool/daftar-pegawai-level-4' },
      { label: 'Daftar Pegawai - Level 5', href: '/talent-pool/daftar-pegawai-level-5' },
      { label: 'Daftar Pegawai - Level 6', href: '/talent-pool/daftar-pegawai-level-6' },
      { label: 'Daftar Penilaian Spesifik', href: '/talent-pool/daftar-penilaian-spesifik' },
      { label: 'Daftar Penilaian Generik', href: '/talent-pool/daftar-penilaian-generik' },
      { label: 'Daftar Penilaian Potensi Telenta', href: '/talent-pool/daftar-penilaian-potensi-telenta' },
      { label: 'Daftar Penilaian Kompetensi Talenta', href: '/talent-pool/daftar-penilaian-kompetensi-talenta' },
      { label: 'Daftar Rekam Jejak Jabatan', href: '/talent-pool/daftar-rekam-jejak-jabatan' },
      { label: 'Daftar Pertimbangan Lainnya', href: '/talent-pool/daftar-pertimbangan-lainnya' },
      { label: 'Penilaian Kinerja', href: '/talent-pool/penilaian-kinerja' },
      { label: 'Penilaian Potensi Sial', href: '/talent-pool/penilaian-potensi-sial' },
      { label: 'Pemerinkatan Kinerja - Potensial', href: '/talent-pool/pemerinkatan-kinerja-potensial' },
      { label: 'Daftar Simulasi', href: '/talent-pool/daftar-simulasi' },
    ],
  },
  {
    label: 'Suksesi',
    icon: IconTrendingUp,
    children: [
      { label: 'Daftar Lowongan Jabatan Target', href: '/suksesi/daftar-lowongan-jabatan-target' },
      { label: 'Daftar Rencana Suksesi', href: '/suksesi/daftar-rencana-suksesi' },
    ],
  },
] satisfies Menu[]

const openMenus = ref<Record<string, boolean>>({
  Referensi: true,
  'Talent Pool': true,
  Suksesi: true,
})

const isActive = (href: string) => {
  if (href === '/home' && route.path === '/home') return true;
  if (href !== '/home' && route.path.startsWith(href)) return true;
  return false;
}

const isMenuWithChildrenActive = (menu: Menu) => {
  if (!menu.children) return false
  return menu.children.some((child) => route.path.startsWith(child.href))
}

const isMenuOpen = (menu: Menu) => {
  if (!menu.children) return false
  return openMenus.value[menu.label] || isMenuWithChildrenActive(menu)
}

const toggleMenu = (label: string) => {
  openMenus.value[label] = !openMenus.value[label]
}
</script>

<template>
  <aside :class="[
    props.mini ? 'w-20' : 'w-64',
    'bg-blue-900 border-r border-blue-700 flex flex-col h-full shrink-0 shadow-sm z-20 transition-all duration-200'
  ]">
    <!-- Brand -->
    <div class="h-16 flex items-center px-6 border-b border-blue-700 shrink-0">
      <div class="mr-3 flex items-center justify-center">
        <span class="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full ring-2 ring-white">
          <img src="/lanri.png" alt="STAS" class="w-10 h-10 object-contain" />
        </span>
      </div>
      <span v-if="!props.mini" class="font-extrabold text-white tracking-tight text-lg">STAS</span>
    </div>

    <!-- Navigation -->
    <nav :class="[
      'flex-1 overflow-y-auto space-y-1.5',
      props.mini ? 'py-4 px-1' : 'py-6 px-4'
    ]">
      <div
        v-for="menu in menus"
        :key="menu.label"
        class="space-y-1"
      >
        <NuxtLink
          v-if="menu.href"
          :to="menu.href"
          class="flex items-center px-2 py-2.5 rounded-xl font-semibold transition-all group"
          :class="[
            props.mini ? 'justify-center' : 'gap-3 text-sm',
            isActive(menu.href)
              ? 'bg-[#3781c7] text-white shadow-md shadow-[#3781c7]/20'
              : 'text-white hover:bg-blue-800 hover:text-blue-200'
          ]"
        >
          <component
            :is="menu.icon"
            class="w-5 h-5 transition-colors"
            :class="isActive(menu.href) ? 'text-white' : 'text-blue-300 group-hover:text-blue-200'"
          />
          <span v-if="!props.mini">{{ menu.label }}</span>
        </NuxtLink>

        <button
          v-else
          type="button"
          class="w-full flex items-center justify-between px-2 py-2.5 rounded-xl font-semibold transition-all group"
          :class="[
            props.mini ? 'justify-center' : 'gap-3 text-sm',
            isMenuWithChildrenActive(menu)
              ? 'bg-[#3781c7] text-white shadow-md shadow-[#3781c7]/20'
              : 'text-white hover:bg-blue-800 hover:text-blue-200'
          ]"
          @click="toggleMenu(menu.label)"
        >
          <span class="flex items-center gap-3">
            <component
              :is="menu.icon"
              class="w-5 h-5 transition-colors"
              :class="isMenuWithChildrenActive(menu) ? 'text-white' : 'text-blue-300 group-hover:text-blue-200'"
            />
            <span v-if="!props.mini">{{ menu.label }}</span>
          </span>
          <IconChevronDown
            v-if="!props.mini"
            class="w-4 h-4 transition-transform"
            :class="isMenuOpen(menu) ? 'rotate-180' : ''"
          />
        </button>

        <div v-if="menu.children && isMenuOpen(menu) && !props.mini" class="ml-4 mt-1 space-y-1 border-l border-blue-700 pl-3">
          <NuxtLink
            v-for="child in menu.children"
            :key="child.href"
            :to="child.href"
            class="block rounded-lg px-2.5 py-2 text-xs font-semibold transition-all"
            :class="route.path.startsWith(child.href)
              ? 'bg-blue-800 text-blue-200'
              : 'text-blue-100 hover:bg-blue-800 hover:text-blue-200'"
          >
            {{ child.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>
  </aside>
</template>
