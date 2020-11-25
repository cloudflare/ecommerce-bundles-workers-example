import { getDecryptedKV, putEncryptedKV } from 'encrypt-workers-kv'

const randomString = async () => {
  const resp = await fetch('https://csprng.xyz/v1/api')
  const {Data} = await resp.json()
  return encodeURIComponent(Data)
}

const persist = async ({ key, data, expirationTtl }: { key?: string, data: any, expirationTtl?: number }) => {
  if (!key) key = await randomString()
  await putEncryptedKV(ENCRYPTED, key, JSON.stringify(data), SALT, 10000, { expirationTtl })
  return key
}

const retrieveByCode = async (key: string): Promise<KVCustomer | KVLogin | null> => {
  try {
    const buf = await getDecryptedKV(ENCRYPTED, key, SALT)
    const str = new TextDecoder().decode(buf)
    return str.length ? JSON.parse(str) : {}
  } catch (err) {
    console.log(err)
    return null
  }
}

export { persist, retrieveByCode }