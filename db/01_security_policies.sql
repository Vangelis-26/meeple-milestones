-- ==============================================================================
-- 🔒 FICHIER DE RÉFÉRENCE : SÉCURITÉ & AUTOMATISATION
-- Description : Contient les fonctions, triggers et policies RLS.
-- Pré-requis : Les tables (games, challenges, challenge_items) doivent exister.
-- ==============================================================================

-- 1. FONCTIONS UTILITAIRES
-- ==============================================================================

-- Vérifie si un challenge appartient à l'utilisateur connecté
create or replace function public.check_challenge_ownership(challenge_id bigint)
returns boolean as $$
begin
  return exists (
    select 1 from public.challenges
    where id = check_challenge_ownership.challenge_id
    and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Crée automatiquement un challenge lors de l'inscription
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.challenges (user_id, name, year)
  values (new.id, 'Mon Challenge 10x10', 2026);
  return new;
end;
$$ language plpgsql security definer;


-- 2. TRIGGERS (DÉCLENCHEURS)
-- ==============================================================================

-- Déclenche la création du challenge après une insertion dans auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Activation de la sécurité sur toutes les tables
alter table public.games enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_items enable row level security;

-- Nettoyage préventif
drop policy if exists "Games_Read_Public" on public.games;
drop policy if exists "Games_Write_Auth" on public.games;
drop policy if exists "Challenges_Select_Own" on public.challenges;
drop policy if exists "Challenges_Insert_Own" on public.challenges;
drop policy if exists "Items_Select_Own" on public.challenge_items;
drop policy if exists "Items_Insert_Own" on public.challenge_items;
drop policy if exists "Items_Update_Own" on public.challenge_items;
drop policy if exists "Items_Delete_Own" on public.challenge_items;


-- A. TABLE GAMES
create policy "Games_Read_Public" on public.games for select using (true);
create policy "Games_Write_Auth" on public.games for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- B. TABLE CHALLENGES
create policy "Challenges_Select_Own" on public.challenges for select using (auth.uid() = user_id);
create policy "Challenges_Insert_Own" on public.challenges for insert with check (auth.uid() = user_id);

-- C. TABLE CHALLENGE_ITEMS
create policy "Items_Select_Own" on public.challenge_items for select using (public.check_challenge_ownership(challenge_id));
create policy "Items_Insert_Own" on public.challenge_items for insert with check (public.check_challenge_ownership(challenge_id));
create policy "Items_Update_Own" on public.challenge_items for update using (public.check_challenge_ownership(challenge_id));
create policy "Items_Delete_Own" on public.challenge_items for delete using (public.check_challenge_ownership(challenge_id));
