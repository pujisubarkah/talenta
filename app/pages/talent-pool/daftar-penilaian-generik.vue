
<script setup lang="ts">
import { ref } from 'vue'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-vue'


type GenerikItem = {
	id: number
	nama: string
	bobot: string
	createdAt?: string
	updatedAt?: string
}
const generikList = ref<GenerikItem[]>([])

async function fetchGenerik() {
	const res = await fetch('/api/master/penilaian-generik')
	const json = await res.json()
	generikList.value = Array.isArray(json.data) ? json.data : []
}

onMounted(fetchGenerik)

const newNama = ref('')
const newBobot = ref('')
const showModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number|null>(null)
const editNama = ref('')
const editBobot = ref(0)

async function addGenerik() {
	if (!newNama.value || Number(newBobot.value) < 0 || Number(newBobot.value) > 100) return
	const res = await fetch('/api/master/penilaian-generik', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nama: newNama.value, bobot: Number(newBobot.value) })
	})
	if (res.ok) {
		await fetchGenerik()
		showModal.value = false
		newNama.value = ''
		newBobot.value = ''
	}
}

function startEdit(item: GenerikItem) {
	editId.value = item.id
	editNama.value = item.nama
	editBobot.value = Number(item.bobot)
	showEditModal.value = true
}

async function saveEdit() {
	if (!editId.value) return
	const res = await fetch('/api/master/penilaian-generik', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id: Number(editId.value), nama: editNama.value.trim(), bobot: Number(editBobot.value) })
	})
	if (res.ok) {
		await fetchGenerik()
		showEditModal.value = false
		editId.value = null
	}
}

function cancelEdit() {
	showEditModal.value = false
	editId.value = null
}

async function removeGenerik(id: number) {
	await fetch('/api/master/penilaian-generik', {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id })
	})
	await fetchGenerik()
}
</script>

<template>
	<div class="p-6 max-w-2xl mx-auto">
		<h1 class="text-xl font-bold mb-4">Daftar Penilaian Generik & Bobot</h1>
		<div class="flex justify-end mb-2">
			<button @click="showModal = true" class="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
			  <IconPlus class="w-4 h-4" />
			  Tambah Penilaian
			</button>
		</div>
		<table class="min-w-full divide-y divide-slate-200 text-sm mb-4">
			<thead class="bg-slate-50 text-slate-600">
				<tr>
					<th class="px-4 py-3 text-center font-semibold w-12">No</th>
					<th class="px-4 py-3 text-left font-semibold">Penilaian</th>
					<th class="px-4 py-3 text-center font-semibold">Bobot (%)</th>
					<th class="px-4 py-3 text-center font-semibold">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white text-slate-700">
				<tr v-for="(item, idx) in generikList" :key="item.id">
					<td class="px-4 py-3 text-center">{{ idx + 1 }}</td>
					<td class="px-4 py-3">{{ item.nama }}</td>
					<td class="px-4 py-3 text-center">{{ item.bobot }}</td>
					<td class="px-4 py-3 text-center">
						<div class="inline-flex gap-2">
							<button @click="startEdit(item)" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1">
							  <IconEdit class="w-4 h-4" />
							  Edit
							</button>
							  <button @click="removeGenerik(item.id)" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-1">
							  <IconTrash class="w-4 h-4" />
							  Hapus
							</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Modal Edit Penilaian -->
		<div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
			<div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
				<button @click="cancelEdit" class="absolute top-2 right-2 text-slate-400 hover:text-slate-600">&times;</button>
				<h2 class="text-lg font-bold mb-4">Edit Penilaian Generik</h2>
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

		<!-- Modal Tambah Penilaian -->
		<div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
			<div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
				<button @click="showModal = false" class="absolute top-2 right-2 text-slate-400 hover:text-slate-600">&times;</button>
				<h2 class="text-lg font-bold mb-4">Tambah Penilaian Generik</h2>
				<form @submit.prevent="addGenerik" class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-1">Nama Penilaian</label>
						<input v-model="newNama" placeholder="Nama penilaian" class="border rounded px-2 py-1 text-sm w-full" required />
					</div>
					<div>
						<label class="block text-sm font-medium mb-1">Bobot (%)</label>
						<input v-model.number="newBobot" type="number" min="0" max="100" placeholder="Bobot (%)" class="border rounded px-2 py-1 text-sm w-full text-center" required />
					</div>
					<div class="flex justify-end gap-2">
						<button type="button" @click="showModal = false" class="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">Batal</button>
						<button type="submit" class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Tambah</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
