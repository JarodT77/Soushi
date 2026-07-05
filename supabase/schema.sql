-- ============================================================================
--  Studio Socheata — Schéma cartes de fidélité (tampons)
--  À exécuter dans Supabase : SQL Editor → coller → Run.
--  Ce script est ré-exécutable sans erreur (idempotent).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Générateur de code court unique pour les cartes (ex. K7P2QX).
--    Alphabet sans caractères ambigus (pas de O/0, I/1, L).
-- ---------------------------------------------------------------------------
create or replace function public.generer_code_carte()
returns text
language plpgsql
as $$
declare
  v_alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_code text;
  v_i int;
begin
  loop
    v_code := '';
    for v_i in 1..6 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    exit when not exists (
      select 1 from public.cartes_fidelite c where c.code = v_code
    );
  end loop;
  return v_code;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

-- Une carte par client. Le `code` court sert de contenu au QR code ;
-- l'`id` (uuid) reste la clé technique pour les liens entre tables.
create table if not exists public.cartes_fidelite (
  id                   uuid primary key default gen_random_uuid(),
  code                 text not null default public.generer_code_carte(),
  nombre_de_passage    integer not null default 0,
  recompenses_utilisees integer not null default 0,
  created_at           timestamptz not null default now()
);

-- Patch pour une base déjà créée (ajoute les colonnes/contraintes si manquantes).
alter table public.cartes_fidelite
  add column if not exists recompenses_utilisees integer not null default 0;
alter table public.cartes_fidelite
  add column if not exists code text;
update public.cartes_fidelite set code = public.generer_code_carte() where code is null;
alter table public.cartes_fidelite alter column code set default public.generer_code_carte();
alter table public.cartes_fidelite alter column code set not null;
create unique index if not exists cartes_fidelite_code_key on public.cartes_fidelite (code);

-- Prolonge auth.users : `id` = auth.users.id. Email recopié depuis l'auth.
create table if not exists public.utilisateurs (
  id        uuid primary key references auth.users (id) on delete cascade,
  nom       text,
  prenom    text,
  email     text,
  role      text not null default 'client' check (role in ('client', 'admin')),
  carte_id  uuid references public.cartes_fidelite (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Fonction utilitaire : l'utilisateur courant est-il admin ?
--    SECURITY DEFINER pour éviter la récursion RLS (elle lit `utilisateurs`
--    en contournant les politiques).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.utilisateurs
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. À l'inscription : créer automatiquement une carte + le profil.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  nouvelle_carte uuid;
begin
  insert into public.cartes_fidelite default values
  returning id into nouvelle_carte;

  insert into public.utilisateurs (id, nom, prenom, email, role, carte_id)
  values (
    new.id,
    new.raw_user_meta_data ->> 'nom',
    new.raw_user_meta_data ->> 'prenom',
    new.email,
    'client',
    nouvelle_carte
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Empêcher un client de modifier son rôle ou sa carte (anti-élévation).
--    Un admin, lui, peut tout changer.
-- ---------------------------------------------------------------------------
create or replace function public.protect_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- On protège UNIQUEMENT contre un utilisateur connecté à l'app qui n'est pas
  -- admin (tentative d'auto-promotion). Les modifications faites hors session
  -- (dashboard Supabase, SQL Editor, service_role) ont `auth.uid()` NULL et
  -- sont donc autorisées, tout comme celles faites par un admin.
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.carte_id := old.carte_id;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_utilisateurs on public.utilisateurs;
create trigger protect_utilisateurs
  before update on public.utilisateurs
  for each row execute function public.protect_privileged_columns();

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.utilisateurs     enable row level security;
alter table public.cartes_fidelite  enable row level security;

grant select, insert, update, delete on public.utilisateurs    to authenticated;
grant select, insert, update, delete on public.cartes_fidelite to authenticated;

-- ---- utilisateurs ----------------------------------------------------------
drop policy if exists "utilisateurs_select" on public.utilisateurs;
create policy "utilisateurs_select" on public.utilisateurs
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "utilisateurs_update" on public.utilisateurs;
create policy "utilisateurs_update" on public.utilisateurs
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "utilisateurs_insert_admin" on public.utilisateurs;
create policy "utilisateurs_insert_admin" on public.utilisateurs
  for insert with check (public.is_admin());

-- ---- cartes_fidelite -------------------------------------------------------
drop policy if exists "cartes_select" on public.cartes_fidelite;
create policy "cartes_select" on public.cartes_fidelite
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.utilisateurs u
      where u.carte_id = cartes_fidelite.id and u.id = auth.uid()
    )
  );

-- Seul un admin incrémente les passages ou modifie une carte.
drop policy if exists "cartes_update_admin" on public.cartes_fidelite;
create policy "cartes_update_admin" on public.cartes_fidelite
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cartes_insert_admin" on public.cartes_fidelite;
create policy "cartes_insert_admin" on public.cartes_fidelite
  for insert with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. Actions du salon (RPC atomiques, réservées aux admins).
--    NB : la valeur 10 doit rester alignée avec OBJECTIF_TAMPONS (fidelite.ts).
-- ---------------------------------------------------------------------------

-- Ajoute un passage (+1 tampon) sur une carte.
create or replace function public.ajouter_passage(carte uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Action réservée au salon.';
  end if;

  update public.cartes_fidelite
    set nombre_de_passage = nombre_de_passage + 1
    where id = carte;

  if not found then
    raise exception 'Carte introuvable.';
  end if;
end;
$$;

-- Valide (consomme) une récompense disponible sur une carte.
create or replace function public.valider_recompense(carte uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  disponibles integer;
begin
  if not public.is_admin() then
    raise exception 'Action réservée au salon.';
  end if;

  select floor(nombre_de_passage / 10) - recompenses_utilisees
    into disponibles
    from public.cartes_fidelite
    where id = carte;

  if disponibles is null then
    raise exception 'Carte introuvable.';
  end if;
  if disponibles < 1 then
    raise exception 'Aucune récompense disponible sur cette carte.';
  end if;

  update public.cartes_fidelite
    set recompenses_utilisees = recompenses_utilisees + 1
    where id = carte;
end;
$$;
