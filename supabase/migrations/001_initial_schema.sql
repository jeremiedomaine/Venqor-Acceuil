-- Venqor Accueil — schéma initial (multi-tenant par domaine)
-- Exécuter dans Supabase → SQL Editor, ou via: npm run db:migrate

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tenant
-- ---------------------------------------------------------------------------
create table if not exists public.domains (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  address text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profils (liés à auth.users — V1.1 login)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  domain_id uuid not null references public.domains (id) on delete cascade,
  full_name text,
  role text not null default 'operator' check (role in ('operator', 'admin')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Événements
-- ---------------------------------------------------------------------------
create table if not exists public.domain_events (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.domains (id) on delete cascade,
  legacy_id text,
  title text not null,
  type text not null check (type in ('Mariage', 'Seminaire', 'Soiree privee')),
  date_start date not null,
  date_end date not null,
  guest_count integer not null default 0 check (guest_count >= 0),
  booking_status text not null default 'Option'
    check (booking_status in ('Confirmé', 'Option', 'Terminé')),
  client_or_org text not null default '',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists domain_events_domain_id_idx on public.domain_events (domain_id);
create index if not exists domain_events_date_start_idx on public.domain_events (date_start);

create unique index if not exists domain_events_legacy_unique
  on public.domain_events (domain_id, legacy_id)
  where legacy_id is not null;

-- ---------------------------------------------------------------------------
-- Catalogue extras
-- ---------------------------------------------------------------------------
create table if not exists public.catalogue_extras (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.domains (id) on delete cascade,
  legacy_id text,
  label text not null,
  description text not null default '',
  price_eur numeric(12, 2) not null default 0,
  category text not null check (
    category in ('Séjour & confort', 'Réception', 'Animation', 'Logistique')
  ),
  visible boolean not null default true,
  vat_percent numeric(5, 2) not null default 20,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalogue_extras_domain_id_idx on public.catalogue_extras (domain_id);

-- ---------------------------------------------------------------------------
-- Config catalogue (1 ligne par domaine)
-- ---------------------------------------------------------------------------
create table if not exists public.catalogue_config (
  domain_id uuid primary key references public.domains (id) on delete cascade,
  show_ttc_by_default boolean not null default true,
  intro_client text not null default '',
  min_lead_days integer not null default 7,
  guest_booking_allowed boolean not null default true,
  platform_fee_percent numeric(5, 2) not null default 8,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Prestataires
-- ---------------------------------------------------------------------------
create table if not exists public.prestataires (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.domains (id) on delete cascade,
  legacy_id text,
  name text not null,
  category text not null,
  contact_name text not null default '',
  email text not null default '',
  phone text not null default '',
  status text not null default 'Actif'
    check (status in ('Actif', 'Suspendu', 'En attente')),
  events_linked integer not null default 0,
  last_or_next_mission text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prestataires_domain_id_idx on public.prestataires (domain_id);

-- ---------------------------------------------------------------------------
-- Apps / sous-domaines
-- ---------------------------------------------------------------------------
create table if not exists public.domain_apps (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.domains (id) on delete cascade,
  legacy_id text,
  label text not null,
  slug text not null,
  host text not null,
  status text not null default 'Actif'
    check (status in ('Actif', 'Brouillon', 'Suspendu')),
  description text,
  created_at date not null default current_date,
  updated_at timestamptz not null default now(),
  unique (domain_id, slug)
);

create index if not exists domain_apps_domain_id_idx on public.domain_apps (domain_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists domains_updated_at on public.domains;
create trigger domains_updated_at
  before update on public.domains
  for each row execute function public.set_updated_at();

drop trigger if exists domain_events_updated_at on public.domain_events;
create trigger domain_events_updated_at
  before update on public.domain_events
  for each row execute function public.set_updated_at();

drop trigger if exists catalogue_extras_updated_at on public.catalogue_extras;
create trigger catalogue_extras_updated_at
  before update on public.catalogue_extras
  for each row execute function public.set_updated_at();

drop trigger if exists prestataires_updated_at on public.prestataires;
create trigger prestataires_updated_at
  before update on public.prestataires
  for each row execute function public.set_updated_at();

drop trigger if exists domain_apps_updated_at on public.domain_apps;
create trigger domain_apps_updated_at
  before update on public.domain_apps
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security (préparation auth — le service role bypass RLS)
-- ---------------------------------------------------------------------------
alter table public.domains enable row level security;
alter table public.profiles enable row level security;
alter table public.domain_events enable row level security;
alter table public.catalogue_extras enable row level security;
alter table public.catalogue_config enable row level security;
alter table public.prestataires enable row level security;
alter table public.domain_apps enable row level security;

-- Lecture publique désactivée par défaut (accès via API serveur avec secret key)
-- Policies pour utilisateurs authentifiés (à activer avec login V1.1)
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "domain_events_by_profile_domain"
  on public.domain_events for all
  using (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  )
  with check (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  );

create policy "catalogue_extras_by_profile_domain"
  on public.catalogue_extras for all
  using (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  )
  with check (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  );

create policy "catalogue_config_by_profile_domain"
  on public.catalogue_config for all
  using (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  )
  with check (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  );

create policy "prestataires_by_profile_domain"
  on public.prestataires for all
  using (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  )
  with check (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  );

create policy "domain_apps_by_profile_domain"
  on public.domain_apps for all
  using (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  )
  with check (
    domain_id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  );
