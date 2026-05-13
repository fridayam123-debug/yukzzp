-- Add unique constraint for ingredient_profile upsert to work correctly
alter table public.ingredient_profile
  add constraint ingredient_profile_ingredient_name_key unique (ingredient_name);
