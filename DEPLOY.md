# मुफ्त में लाइव करें — GitHub + Vercel

पूरी साइट **₹0** में चलती है।  
Vercel Hobby प्लान फ्री है। GitHub पब्लिक रिपो फ्री है। HTTPS अपने आप मिलता है।

Supabase अभी जरूरी नहीं। बिना किसी डेटाबेस के डिक्शनरी (437 शब्द) लाइव हो जाएगी।

---

## 1) GitHub पर नया रिपो बनाएँ (2 मिनट)

1. ब्राउज़र में खोलें: [https://github.com/new](https://github.com/new)
2. **Repository name:** `masaram-gondi-dictionary`
3. **Public** चुनें
4. **Add a README** को **नहीं** टिक करें
5. **Create repository** दबाएँ

---

## 2) यह प्रोजेक्ट पुश करें

अपने कंप्यूटर पर (या Codespace में), प्रोजेक्ट फोल्डर में:

```bash
git init
git add .
git commit -m "Masaram Gondi Dictionary — created by Saiyyam Ji"
git branch -M main
git remote add origin https://github.com/AAPKA_USERNAME/masaram-gondi-dictionary.git
git push -u origin main
```

`AAPKA_USERNAME` की जगह अपना GitHub username लिखें।

लॉगिन पूछे तो GitHub password नहीं, **Personal Access Token** दें:  
[https://github.com/settings/tokens](https://github.com/settings/tokens)  
→ Fine-grained या classic token, `repo` स्कोप।

---

## 3) Vercel से फ्री डिप्लॉय (3 मिनट)

1. [https://vercel.com/signup](https://vercel.com/signup)  
   **Continue with GitHub** से साइन अप करें (फ्री)।
2. **Add New… → Project**
3. `masaram-gondi-dictionary` रिपो **Import** करें
4. Framework: **Next.js** (अपने आप दिखेगा)
5. **Environment Variables** (optional — admin के लिए):

   | Name | Value |
   |---|---|
   | `ADMIN_EMAIL` | आपका ईमेल |
   | `ADMIN_PASSWORD` | कम से कम 8 अक्षर, मजबूत |
   | `ADMIN_SESSION_SECRET` | कोई लंबा रैंडम वाक्य |
   | `NEXT_PUBLIC_SITE_URL` | डिप्लॉय के बाद वाला URL (बाद में भी जोड़ सकते हैं) |

6. **Deploy** दबाएँ
7. 1–2 मिनट बाद URL मिलेगा, जैसे:  
   `https://masaram-gondi-dictionary.vercel.app`

बस। साइट दुनिया भर में खुल जाएगी।

---

## बाद में (optional) अपना डोमेन / Supabase

- Vercel → Project → **Domains** → मुफ्त `*.vercel.app` पहले से है  
- असली डोमेन जोड़ना हो तो वहीं Add
- पूरा एडमिन + डेटाबेस चाहिए तो मुफ्त [Supabase](https://supabase.com) प्रोजेक्ट बनाएँ और  
  `supabase/migrations/0001` से `0006` फिर `seed.sql` चलाएँ।  
  `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` Vercel में डालें।  
  `SUPABASE_SERVICE_ROLE_KEY` सिर्फ सर्वर env में — `NEXT_PUBLIC_` कभी न लगाएँ।

---

## चेक लिस्ट

- [ ] `.env.local` GitHub पर नहीं गया (gitignore में है)
- [ ] `service_role` ब्राउज़र में नहीं है
- [ ] साइट `https://` पर खुलती है
- [ ] होम पर `तल्ला` / `Talla` / `Head` सर्च एक ही शब्द लाती है
