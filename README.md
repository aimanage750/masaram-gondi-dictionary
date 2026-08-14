# Masaram Gondi Dictionary · गोंडी शब्द कोश

Created by **Saiyyam Ji**.

Masaram Gondi script dictionary (Unicode `U+11D00–U+11D5F`).  
Search in Gondi pronunciation, Roman Gondi, Hindi, English, or Masaram Gondi.

**Public result is always 4 fields only:**

1. Masaram Gondi  
2. Gondi Pronunciation  
3. Hindi  
4. English  

Roman Gondi / Roman Hindi are internal search fields — never shown.

Try: `तल्ला` · `Talla` · `sir` · `सिर` · `Head` · `𑴛𑴧𑵅𑴧𑴱`

---

## मुफ्त लाइव डिप्लॉय (GitHub + Vercel)

पूरी गाइड: **[DEPLOY.md](./DEPLOY.md)** — हिंदी में, स्टेप-बाय-स्टेप।

छोटा रास्ता:

1. GitHub पर पब्लिक रिपो बनाएँ: `masaram-gondi-dictionary`
2. यह कोड `git push` करें
3. [vercel.com](https://vercel.com/signup) → **Continue with GitHub** → Import → **Deploy**

फ्री URL मिलेगा: `https://….vercel.app`  
Supabase के बिना भी डिक्शनरी चलती है।

---

## Local run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Source rule

Primary source: uploaded *गोंडी करीयाट (गोंडी सिखाएं)* PDFs.  
Gondi pronunciation is never invented and never silently respelt.

## Stack

Next.js 14 · Tailwind · optional Supabase · PWA

SQL: `supabase/migrations/0001` … `0006` then `supabase/seed.sql`

## License

MIT © Saiyyam Ji
