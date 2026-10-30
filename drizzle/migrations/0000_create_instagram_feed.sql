-- Feed do Instagram: publicações reais trazidas da API oficial da Meta.
-- Nenhuma linha de demonstração é inserida aqui.
CREATE TABLE public.instagram_posts (
  id text PRIMARY KEY,
  permalink text NOT NULL,
  caption text,
  media_type text NOT NULL DEFAULT 'IMAGE',
  image_url text,
  published_at timestamptz NOT NULL,
  like_count integer,
  comments_count integer,
  synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX instagram_posts_published_idx ON public.instagram_posts (published_at DESC);

GRANT SELECT ON public.instagram_posts TO anon;
GRANT SELECT ON public.instagram_posts TO authenticated;
GRANT ALL ON public.instagram_posts TO service_role;

ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY instagram_posts_read ON public.instagram_posts
  FOR SELECT TO anon, authenticated USING (true);

-- Estado da sincronização: uma única linha, lida e escrita apenas pelo servidor.
CREATE TABLE public.instagram_state (
  id smallint PRIMARY KEY DEFAULT 1,
  status text NOT NULL DEFAULT 'idle',
  last_attempt_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  posts_count integer NOT NULL DEFAULT 0,
  CONSTRAINT instagram_state_single_row CHECK (id = 1)
);

GRANT ALL ON public.instagram_state TO service_role;

ALTER TABLE public.instagram_state ENABLE ROW LEVEL SECURITY;

INSERT INTO public.instagram_state (id, status) VALUES (1, 'idle') ON CONFLICT (id) DO NOTHING;