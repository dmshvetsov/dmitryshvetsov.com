+++
title = "[WIP] Tutorial: Cloudflare authentication worker"
draft = true
date = '2999-12-31'
+++

```typescript
const buf2hex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

export const isValidSign = async (token: string, payload: any) => { // FIXME: replace any with meaningful type
  const { hash, ...data } = payload

  const isRecent =
    (Date.now() - parseInt(data.auth_date) * 1000) / 1000 < 86400
  if (!isRecent) return false

  const encoder = new TextEncoder()

  const k1 = await crypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign', 'verify']
  )

  const secret = await crypto.subtle.sign('HMAC', k1, encoder.encode(token))

  const k2 = await crypto.subtle.importKey(
    'raw',
    secret,
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign', 'verify']
  )

  const digest = await crypto.subtle.sign(
    'HMAC',
    k2,
    encoder.encode(
      Object.entries(data)
        .sort()
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join('\n')
    )
  )

  return buf2hex(digest) === hash
}
```
