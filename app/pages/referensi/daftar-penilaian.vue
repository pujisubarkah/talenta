<script setup lang="ts">
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-vue'
import UIButton from '~/components/UI/UIButton.vue'
import UIIcon from '~/components/UI/UIIcon.vue'

type KategoriPenilaian = {
	id: number
	kode: string
	nama_kategori: string
	deskripsi: string
	urutan?: number
	is_active: boolean
	created_at?: string
}

const kategoriList = ref<KategoriPenilaian[]>([])

async function fetchKategori() {
	const res = await fetch('/api/master/kategori-penilaian')
	const json = await res.json()
	kategoriList.value = Array.isArray(json) ? json : (json.data || [])
}

onMounted(fetchKategori)

const showModal = ref(false)
const showEditModal = ref(false)

const form = ref<Partial<KategoriPenilaian>>({
	kode: '',
	nama_kategori: '',
	deskripsi: '',
	is_active: true
})

const editId = ref<number | null>(null)

function startEdit(item: KategoriPenilaian) {
	editId.value = item.id
	form.value = { ...item }
	showEditModal.value = true
}

function cancelEdit() {
	showEditModal.value = false
	editId.value = null
	form.value = { kode: '', nama_kategori: '', deskripsi: '', is_active: true }
}

async function saveEdit() {
	if (!editId.value) return

	const res = await fetch(`/api/master/kategori-penilaian/${editId.value}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(form.value)
	})

	if (res.ok) {
		await fetchKategori()
		showEditModal.value = false
		editId.value = null
		form.value = { kode: '', nama_kategori: '', deskripsi: '', is_active: true }
	}
}

async function addKategori() {
	if (!form.value.kode || !form.value.nama_kategori) return

	const res = await fetch('/api/master/kategori-penilaian', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(form.value)
	})

	if (res.ok) {
		await fetchKategori()
		showModal.value = false
		form.value = { kode: '', nama_kategori: '', deskripsi: '', is_active: true }
	}
}

async function removeKategori(id: number) {
	await fetch(`/api/master/kategori-penilaian/${id}`, {
		method: 'DELETE'
	})
	await fetchKategori()
}

const searchQuery = ref('')
const filterStatus = ref<string>('')
const pageSize = ref(10)
const page = ref(1)

watch([searchQuery, filterStatus], () => {
	page.value = 1
})

const filteredKategoriList = computed(() => {
	let result = kategoriList.value
	if (searchQuery.value) {
		const q = searchQuery.value.toLowerCase()
		result = result.filter(k => k.nama_kategori.toLowerCase().includes(q) || k.kode.toLowerCase().includes(q))
	}
	if (filterStatus.value !== '') {
		const isActive = filterStatus.value === 'true'
		result = result.filter(k => k.is_active === isActive)
	}
	return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredKategoriList.value.length / pageSize.value)))
const pagedKategoriList = computed(() => {
	const start = (page.value - 1) * pageSize.value
	return filteredKategoriList.value.slice(start, start + pageSize.value)
})
</script>

<template>
	<div class="p-6 w-full">
		<h1 class="text-2xl font-bold mb-4">Daftar Kategori Penilaian</h1>

		<!-- Action Bar (Filter & Button) -->
		<div class="flex justify-between items-center mb-4">
			<!-- Filter Section -->
			<div class="flex items-center gap-3">
				<input 
					v-model="searchQuery"
					type="text"
					placeholder="Cari kode atau kategori..."
					class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition bg-white min-w-62.5"
				/>
				<select
					v-model="filterStatus"
					class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition bg-white min-w-37.5"
				>
					<option value="">Semua Status</option>
					<option value="true">Aktif</option>
					<option value="false">Tidak Aktif</option>
				</select>
			</div>

			<!-- Button Tambah -->
			<UIButton color="primary" @click="showModal = true">
				<UIIcon color="white" class="mr-2">
					<IconPlus />
				</UIIcon>
				Tambah Kategori
			</UIButton>
		</div>

		<!-- TABLE WRAPPER -->
		<div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
			<table class="w-full min-w-400 table-fixed divide-y divide-slate-200 text-sm">
				<!-- HEADER -->
				<thead class="bg-slate-50 text-slate-700">
					<tr>
						<th class="px-3 py-3 text-center font-semibold w-12">No</th>
						<th class="px-3 py-3 text-left font-semibold w-28">Kode</th>
						<th class="px-3 py-3 text-left font-semibold w-44">Nama Kategori</th>
						<th class="px-3 py-3 text-left font-semibold w-[320px]">Deskripsi</th>
						<th class="px-3 py-3 text-center font-semibold w-20">Urutan</th>
						<th class="px-3 py-3 text-center font-semibold w-20">Aktif</th>

						<th class="px-3 py-3 text-center font-semibold w-40">Aksi</th>
					</tr>
				</thead>

				<!-- BODY -->
				<tbody class="divide-y divide-slate-100 text-slate-700">
					<tr
						v-for="(item, idx) in pagedKategoriList"
						:key="item.id"
						class="hover:bg-slate-50 transition"
					>
						<td class="px-3 py-3 text-center">{{ (page - 1) * pageSize + idx + 1 }}</td>
						<td class="px-3 py-3 font-medium">{{ item.kode }}</td>
						<td class="px-3 py-3">{{ item.nama_kategori }}</td>
						<td
							class="px-3 py-3 whitespace-normal wrap-break-word leading-relaxed text-slate-600"
							:title="item.deskripsi"
						>
							{{ item.deskripsi }}
						</td>
						<td class="px-3 py-3 text-center">{{ item.urutan ?? '-' }}</td>
						<td class="px-3 py-3 text-center">
							<span :class="item.is_active ? 'text-green-600 font-semibold' : 'text-red-500'">
								{{ item.is_active ? 'Ya' : 'Tidak' }}
							</span>
						</td>
						<td class="px-3 py-3 text-center">
							<div class="flex justify-center gap-2">
								<UIButton color="secondary" size="sm" @click="startEdit(item)">
									<UIIcon color="primary" size="sm"><IconEdit /></UIIcon>
									Edit
								</UIButton>
								<UIButton color="danger" size="sm" @click="removeKategori(item.id)">
									<UIIcon color="danger" size="sm"><IconTrash /></UIIcon>
									Hapus
								</UIButton>
							</div>
						</td>
					</tr>

					<!-- EMPTY -->
					<tr v-if="filteredKategoriList.length === 0">
						<td colspan="7" class="text-center py-10 text-slate-400">
							Belum ada data kategori penilaian
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- PAGINATION -->
		<div v-if="filteredKategoriList.length > pageSize" class="flex justify-center mt-4">
			<button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === 1 }" :disabled="page === 1" @click="page--">&laquo;</button>
			<button v-for="p in totalPages" :key="p" class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === p }" @click="page = p">{{ p }}</button>
			<button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === totalPages }" :disabled="page === totalPages" @click="page++">&raquo;</button>
		</div>
	</div>

	<!-- Modal Edit Kategori -->
	<div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
		<div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-slate-100">
			<button
				@click="cancelEdit"
				class="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-600"
			>
				&times;
			</button>

			<h2 class="text-2xl font-bold mb-6 text-blue-700">Edit Kategori Penilaian</h2>

			<form @submit.prevent="saveEdit" class="space-y-6">
				<div class="flex flex-col gap-1">
					<label class="text-sm font-semibold text-slate-700">Kode</label>
					<input
						v-model="form.kode"
						placeholder="Kode"
						class="border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
						required
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label class="text-sm font-semibold text-slate-700">Nama Kategori</label>
					<input
						v-model="form.nama_kategori"
						placeholder="Nama kategori"
						class="border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
						required
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label class="text-sm font-semibold text-slate-700">Deskripsi</label>
					<textarea
						v-model="form.deskripsi"
						placeholder="Deskripsi"
						class="border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
						rows="3"
					></textarea>
				</div>

				<div class="flex items-center gap-2">
					<input type="checkbox" v-model="form.is_active" class="accent-blue-600 w-5 h-5" />
					<label class="text-sm font-semibold text-slate-700 select-none">Aktif</label>
				</div>

				<div class="flex justify-end gap-3 mt-2">
					<button
						type="button"
						@click="cancelEdit"
						class="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition"
					>
						Batal
					</button>
					<button
						type="submit"
						class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
					>
						Simpan
					</button>
				</div>
			</form>
		</div>
	</div>

	<!-- Modal Tambah Kategori -->
	<div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
		<div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-slate-100">
			<button
				@click="showModal = false"
				class="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-600"
			>
				&times;
			</button>

			<h2 class="text-2xl font-bold mb-6 text-blue-700">Tambah Kategori Penilaian</h2>

			<form @submit.prevent="addKategori" class="space-y-6">
				<div class="flex flex-col gap-1">
					<label class="text-sm font-semibold text-slate-700">Kode</label>
					<input
						v-model="form.kode"
						placeholder="Kode"
						class="border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
						required
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label class="text-sm font-semibold text-slate-700">Nama Kategori</label>
					<input
						v-model="form.nama_kategori"
						placeholder="Nama kategori"
						class="border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
						required
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label class="text-sm font-semibold text-slate-700">Deskripsi</label>
					<textarea
						v-model="form.deskripsi"
						placeholder="Deskripsi"
						class="border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
						rows="3"
					></textarea>
				</div>

				<div class="flex items-center gap-2">
					<input type="checkbox" v-model="form.is_active" class="accent-blue-600 w-5 h-5" />
					<label class="text-sm font-semibold text-slate-700 select-none">Aktif</label>
				</div>

				<div class="flex justify-end gap-3 mt-2">
					<button
						type="button"
						@click="showModal = false"
						class="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition"
					>
						Batal
					</button>
					<button
						type="submit"
						class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
					>
						Tambah
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style scoped>
table thead tr th {
  background-color: #1e3a8a; /* Tailwind bg-blue-900 */
  color: #fff;
}
table tbody tr:nth-child(odd) {
  background-color: #fff;
}
table tbody tr:nth-child(even) {
  background-color: #e0e7ff; /* Tailwind bg-blue-100 */
}
</style>