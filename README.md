# Masaram Gondi Dictionary · गोंडी शब्द कोश

**Created by Saiyyam Ji**

### 🌐 Live website

**https://masaram-gondi-dictionary.vercel.app/**

Search Gondi words in **Masaram Gondi script**, **Gondi Pronunciation** (Devanagari), **Hindi** and **English**.

---

## Description / विवरण

A free public dictionary for the **Masaram Gondi** script (Unicode `U+11D00–U+11D5F`).

मुफ़्त गोंडी शब्द कोश — मसाराम गोंडी लिपि, गोंडी उच्चारण, हिन्दी और अंग्रेज़ी।  
स्रोत: अपलोड की गई पुस्तक *गोंडी करीयाट (गोंडी सिखाएं)*। गोंडी शब्द या वाक्य अनुमान से नहीं बनाए गए।

**Public result is always only 4 fields:**

1. Masaram Gondi  
2. Gondi Pronunciation  
3. Hindi  
4. English  

Roman Gondi / Roman Hindi are **internal search only** — never shown on the public page.

Search works from all of these:

`तल्ला` · `Talla` · `talla` · `TALLA` · `sir` · `सिर` · `Head` · `𑴛𑴧𑵅𑴧𑴱`

Example:

| Masaram Gondi | Gondi Pronunciation | Hindi | English |
|---|---|---|---|
| 𑴛𑴧𑵅𑴧𑴱 | तल्ला | सिर | Head |

---

## Use the site

- Open the live app: https://masaram-gondi-dictionary.vercel.app/
- Type a word in Gondi, Hindi, English, or Roman
- Browse by category, or open **वाक्यांश** for sentences (uploaded after listening to the book)
- Phone: browser menu → **Add to Home screen** (PWA)

---

## Links

| | |
|---|---|
| **Website** | https://masaram-gondi-dictionary.vercel.app/ |
| **GitHub** | https://github.com/aimanage750/masaram-gondi-dictionary |
| **Deploy guide** | [DEPLOY.md](./DEPLOY.md) |

---

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Stack

Next.js 14 · Tailwind CSS · optional Supabase · Vercel  
SQL: `supabase/migrations/0001` … `0007` then `supabase/seed.sql`

## License

MIT © Saiyyam Ji
