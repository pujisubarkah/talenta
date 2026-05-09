<script setup lang="ts">
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-vue'

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
</script>

<template>
	<div class="p-6 w-full">
		<h1 class="text-2xl font-bold mb-4">Daftar Kategori Penilaian</h1>

		<!-- Button -->
		<div class="flex justify-end mb-4">
			<button
				@click="showModal = true"
				class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"
			>
				<IconPlus class="w-4 h-4" />
				Tambah Kategori
			</button>
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
						v-for="(item, idx) in kategoriList"
						:key="item.id"
						class="hover:bg-slate-50 transition"
					>
						<td class="px-3 py-3 text-center">{{ idx + 1 }}</td>
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
								<button
									@click="startEdit(item)"
									class="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1 text-xs"
								>
									<IconEdit class="w-4 h-4" />
									Edit
								</button>
								<button
									@click="removeKategori(item.id)"
									class="px-3 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-1 text-xs"
								>
									<IconTrash class="w-4 h-4" />
									Hapus
								</button>
							</div>
						</td>
					</tr>

					<!-- EMPTY -->
					<tr v-if="kategoriList.length === 0">
						<td colspan="7" class="text-center py-10 text-slate-400">
							Belum ada data kategori penilaian
						</td>
					</tr>
				</tbody>
			</table>
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
