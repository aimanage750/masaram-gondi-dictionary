insert into public.categories (slug, name, name_hi, sort_order) values
  ('body', 'Body', 'अंग प्रत्यंग', 1),
  ('people', 'People', 'मनुष्य की अवस्थाएँ', 2),
  ('family', 'Family', 'रिश्ते', 3),
  ('clothes', 'Clothes', 'वस्त्र', 4),
  ('household', 'Household', 'घरेलू सामान', 5),
  ('food', 'Food & Grain', 'अनाज', 6),
  ('building', 'Buildings', 'भवन', 7),
  ('sports', 'Sports', 'खेल कूद', 8),
  ('health', 'Health', 'रोग', 9),
  ('medicine', 'Medicine', 'औषधियाँ', 10),
  ('time', 'Time & Calendar', 'समय', 11),
  ('post', 'Post', 'डाक', 12),
  ('direction', 'Direction', 'दिशा', 13),
  ('general', 'General', 'सामान्य', 99)
on conflict (slug) do update
  set name = excluded.name, name_hi = excluded.name_hi, sort_order = excluded.sort_order;
