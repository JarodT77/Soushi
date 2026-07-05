-- ============================================================================
--  MIGRATION À EXÉCUTER DANS SUPABASE (SQL Editor → coller → Run)
--  Corrige : QR code absent + tampons figés + boutons du scanner salon.
--  Ré-exécutable sans risque.
-- ============================================================================

-- 1) La colonne manquante (cause du QR/tampons absents)
alter table public.cartes_fidelite
  add column if not exists recompenses_utilisees integer not null default 0;

-- 2) Ajoute un passage (+1 tampon). Réservé aux admins.
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

-- 3) Valide (consomme) une récompense disponible. Réservé aux admins.
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
