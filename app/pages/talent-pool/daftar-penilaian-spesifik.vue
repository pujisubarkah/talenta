

<script setup lang="ts">
import { ref } from 'vue'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-vue'
import UITable from '~/components/UI/table.vue'

const columns = [
	{
		title: 'No',
		key: 'no',
		width: 60,
		align: 'center',
		render: (_: any, row: any, idx: number) => idx + 1
	},
	{
		title: 'Kode',
		key: 'kode',
		align: 'left',
	},
	{
		title: 'Nama Penilaian',
		key: 'nama_penilaian',
		align: 'left',
	},
	{
		title: 'Bobot',
		key: 'bobot',
		align: 'center',
	},
	{
		title: 'Jenis Nilai',
		key: 'jenis_nilai',
		align: 'center',
	},
	{
		title: 'Sumber Nilai',
		key: 'sumber_nilai',
		align: 'center',
	},
]


type SpesifikItem = {
	id: number
	kode: string
	nama_penilaian: string
	bobot: string
	jenis_nilai: string
	sumber_nilai: string
}
const spesifikList = ref<SpesifikItem[]>([])

async function fetchSpesifik() {
	const res = await fetch('/api/master/penilaian-spesifik')
	const json = await res.json()
	spesifikList.value = Array.isArray(json.data) ? json.data : []
}

onMounted(fetchSpesifik)

const newNama = ref('')
const newBobot = ref('')
const showModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number|null>(null)
const editNama = ref('')
const editBobot = ref(0)

async function addSpesifik() {
	if (!newNama.value || Number(newBobot.value) < 0 || Number(newBobot.value) > 100) return
	const res = await fetch('/api/master/penilaian-spesifik', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nama: newNama.value, bobot: Number(newBobot.value) })
	})
	if (res.ok) {
		await fetchSpesifik()
		showModal.value = false
		newNama.value = ''
		newBobot.value = ''
	}
}

function startEdit(item: SpesifikItem) {
	editId.value = item.id
	editNama.value = item.nama_penilaian
	editBobot.value = Number(item.bobot)
	showEditModal.value = true
}

async function saveEdit() {
	if (!editId.value) return
	const res = await fetch('/api/master/penilaian-spesifik', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id: Number(editId.value), nama: editNama.value.trim(), bobot: Number(editBobot.value) })
	})
	if (res.ok) {
		await fetchSpesifik()
		showEditModal.value = false
		editId.value = null
	}
}

function cancelEdit() {
	showEditModal.value = false
	editId.value = null
}

async function removeSpesifik(id: number) {
	await fetch('/api/master/penilaian-spesifik', {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id })
	})
	await fetchSpesifik()
}
</script>

<template>
	<div class="p-6 max-w-2xl mx-auto">
		<h1 class="text-xl font-bold mb-4">Daftar Penilaian Spesifik & Bobot</h1>

		<div class="rounded-xl border border-slate-200 bg-white shadow-sm">
			<table class="w-full table-fixed divide-y divide-slate-200 text-sm">
				<thead class="bg-blue-900 text-white">
					<tr>
						<th class="px-3 py-3 text-center font-semibold w-12">No</th>
						<th class="px-3 py-3 text-left font-semibold w-28">Kode</th>
						<th class="px-3 py-3 text-left font-semibold w-44">Nama Penilaian</th>
						<th class="px-3 py-3 text-center font-semibold w-20">Bobot</th>
						<th class="px-3 py-3 text-center font-semibold w-32">Jenis Nilai</th>
						<th class="px-3 py-3 text-center font-semibold w-32">Sumber Nilai</th>
					</tr>
				</thead>
				<tbody class="text-slate-700">
					<tr
						v-for="(item, idx) in spesifikList"
						:key="item.id"
						:class="[
							'transition',
							idx % 2 === 0 ? 'bg-white' : 'bg-blue-50',
							'hover:bg-slate-100'
						]"
					>
						<td class="px-3 py-3 text-center">{{ idx + 1 }}</td>
						<td class="px-3 py-3 font-medium">{{ item.kode }}</td>
						<td class="px-3 py-3">{{ item.nama_penilaian }}</td>
						<td class="px-3 py-3 text-center">{{ item.bobot }}</td>
						<td class="px-3 py-3 text-center">{{ item.jenis_nilai }}</td>
						<td class="px-3 py-3 text-center">{{ item.sumber_nilai }}</td>
					</tr>
					<tr v-if="spesifikList.length === 0">
						<td colspan="6" class="text-center py-10 text-slate-400">
							Belum ada data penilaian spesifik
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Modal Edit Penilaian -->
		<div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
			<div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
				<button @click="cancelEdit" class="absolute top-2 right-2 text-slate-400 hover:text-slate-600">&times;</button>
				<h2 class="text-lg font-bold mb-4">Edit Penilaian Spesifik</h2>
				<form @submit.prevent="saveEdit" class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-1">Nama Penilaian</label>
						<input v-model="editNama" placeholder="Nama penilaian" class="border rounded px-2 py-1 text-sm w-full" required />
					</div>
					<div>
						<label class="block text-sm font-medium mb-1">Bobot (%)</label>
						<input v-model.number="editBobot" type="number" min="0" max="100" placeholder="Bobot (%)" class="border rounded px-2 py-1 text-sm w-full text-center" required />
					</div>
					<div class="flex justify-end gap-2">
						<button type="button" @click="cancelEdit" class="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">Batal</button>
						<button type="submit" class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Simpan</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Modal tambah penilaian dihapus -->
	</div>
</template>
