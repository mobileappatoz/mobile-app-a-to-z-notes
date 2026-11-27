import { PROJECT, saToken } from './_lib.js';
const B = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/`;
const H = async env => ({ authorization: 'Bearer ' + await saToken(env), 'content-type': 'application/json' });
export const sv = s => ({ stringValue: String(s) });
export async function fsGet(env, path) {
  const r = await fetch(B + path, { headers: await H(env) });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('fs_get');
  return r.json();
}
export async function fsSet(env, path, fields) {
  const r = await fetch(B + path, { method: 'PATCH', headers: await H(env), body: JSON.stringify({ fields }) });
  return r.ok;
}
export async function fsDel(env, path) {
  const r = await fetch(B + path, { method: 'DELETE', headers: await H(env) });
  return r.ok || r.status === 404;
}
export async function fsList(env, coll, size = 100) {
  const r = await fetch(B + coll + '?pageSize=' + size, { headers: await H(env) });
  if (!r.ok) throw new Error('fs_list');
  return (await r.json()).documents || [];
}
