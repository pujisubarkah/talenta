# TODO

## Plan (Daftar Penilaian - TypeScript error)
- [ ] Fix TS error in `app/pages/referensi/daftar-penilaian.vue` where `form.value.id` is referenced but `form` is typed as `{ kode; nama_kategori; deskripsi }`.
- [ ] Introduce proper typings for `form`/`row` (include optional `id: number | undefined`) so editor/delete/submit compile.
- [ ] Use the updated form type in `editRow`, `deleteRow`, and `submitForm`.
- [ ] Re-run typecheck/lint (if available) or run `pnpm` typecheck command.

