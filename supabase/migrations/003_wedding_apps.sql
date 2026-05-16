-- Espace mariés : champs dédiés aux mini-apps par couple
alter table public.domain_apps
  add column if not exists partner_one text not null default '',
  add column if not exists partner_two text not null default '',
  add column if not exists wedding_date date,
  add column if not exists welcome_message text;

update public.domain_apps
set
  partner_one = coalesce(nullif(partner_one, ''), split_part(label, ' — ', 1)),
  partner_two = coalesce(nullif(partner_two, ''), ''),
  wedding_date = coalesce(wedding_date, created_at)
where partner_one = '' or wedding_date is null;

alter table public.domain_apps
  alter column wedding_date set default current_date;

update public.domain_apps
set wedding_date = current_date
where wedding_date is null;

alter table public.domain_apps
  alter column wedding_date set not null;

comment on column public.domain_apps.partner_one is 'Prénom ou nom du premier marié';
comment on column public.domain_apps.partner_two is 'Prénom ou nom du second marié';
comment on column public.domain_apps.wedding_date is 'Date du mariage';
comment on column public.domain_apps.welcome_message is 'Message d''accueil sur l''espace invités';
