-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE participant_status AS ENUM ('applied', 'canceled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.users (
  id        UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email     TEXT        NOT NULL,
  name      TEXT,
  provider  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.events (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  date       TIMESTAMPTZ NOT NULL,
  location   TEXT        NOT NULL,
  fee        INTEGER     NOT NULL DEFAULT 0,
  capacity   INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.participants (
  id              UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        UUID               NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name            TEXT               NOT NULL,
  email           TEXT,
  is_email_opt_in BOOLEAN            NOT NULL DEFAULT FALSE,
  status          participant_status NOT NULL DEFAULT 'applied',
  attended        BOOLEAN,
  payment_status  payment_status     NOT NULL DEFAULT 'unpaid',
  created_at      TIMESTAMPTZ        DEFAULT NOW()
);

CREATE TABLE public.notices (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID        NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  send_email BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices     ENABLE ROW LEVEL SECURITY;

-- users: 본인만 조회/수정
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- events: SELECT는 누구나 (공개 참여 링크 지원), 나머지는 host만
CREATE POLICY "events_select_all"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "events_insert_host"
  ON public.events FOR INSERT
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "events_update_host"
  ON public.events FOR UPDATE
  USING (host_id = auth.uid());

CREATE POLICY "events_delete_host"
  ON public.events FOR DELETE
  USING (host_id = auth.uid());

-- participants: INSERT 누구나, SELECT/UPDATE는 host만
CREATE POLICY "participants_insert_anon"
  ON public.participants FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "participants_select_host"
  ON public.participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = participants.event_id
        AND events.host_id = auth.uid()
    )
  );

CREATE POLICY "participants_update_host"
  ON public.participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = participants.event_id
        AND events.host_id = auth.uid()
    )
  );

-- participants: 참여자 본인 취소 허용 (UUID를 capability token으로 사용)
CREATE POLICY "participants_self_cancel"
  ON public.participants FOR UPDATE
  USING (true)
  WITH CHECK (status = 'canceled');

-- notices: SELECT 누구나, INSERT/UPDATE/DELETE는 host만
CREATE POLICY "notices_select_all"
  ON public.notices FOR SELECT
  USING (TRUE);

CREATE POLICY "notices_insert_host"
  ON public.notices FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = notices.event_id
        AND events.host_id = auth.uid()
    )
  );

CREATE POLICY "notices_update_host"
  ON public.notices FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = notices.event_id
        AND events.host_id = auth.uid()
    )
  );

CREATE POLICY "notices_delete_host"
  ON public.notices FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = notices.event_id
        AND events.host_id = auth.uid()
    )
  );

-- ============================================================
-- AUTH TRIGGER: auth.users -> public.users 자동 삽입
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, provider)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_app_meta_data ->> 'provider'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
