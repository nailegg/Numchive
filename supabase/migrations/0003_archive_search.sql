create extension if not exists pg_trgm;

create index if not exists idx_numbers_title_trgm
  on numbers using gin ((lower(title)) gin_trgm_ops);

create index if not exists idx_shows_title_trgm
  on shows using gin ((lower(title)) gin_trgm_ops);

create or replace function search_archive(
  search_query text,
  number_limit int default 50,
  show_limit int default 20
)
returns jsonb
language sql
stable
as $$
  with normalized as (
    select lower(trim(search_query)) as q
  ),
  matched_numbers as (
    select
      n.id,
      n.show_id,
      n.title,
      n.file_url,
      n.duration,
      n.numbering,
      s.id as show_id_joined,
      s.title as show_title,
      s.artwork_url,
      s.year,
      s.season,
      greatest(
        similarity(lower(n.title), normalized.q),
        similarity(lower(s.title), normalized.q)
      ) as score
    from numbers n
    join shows s on s.id = n.show_id
    cross join normalized
    where normalized.q <> ''
      and (
        lower(n.title) like '%' || normalized.q || '%'
        or lower(s.title) like '%' || normalized.q || '%'
        or similarity(lower(n.title), normalized.q) > 0.2
        or similarity(lower(s.title), normalized.q) > 0.2
      )
    order by score desc, n.numbering asc
    limit number_limit
  ),
  matched_shows as (
    select
      s.id,
      s.title,
      s.year,
      s.season,
      s.description,
      s.artwork_url,
      similarity(lower(s.title), normalized.q) as score
    from shows s
    cross join normalized
    where normalized.q <> ''
      and (
        lower(s.title) like '%' || normalized.q || '%'
        or similarity(lower(s.title), normalized.q) > 0.2
      )
    order by score desc, year desc nulls last
    limit show_limit
  )
  select jsonb_build_object(
    'numbers',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', mn.id,
            'show_id', mn.show_id,
            'title', mn.title,
            'file_url', mn.file_url,
            'duration', mn.duration,
            'numbering', mn.numbering,
            'shows', jsonb_build_object(
              'id', mn.show_id_joined,
              'title', mn.show_title,
              'artwork_url', mn.artwork_url,
              'year', mn.year,
              'season', mn.season
            )
          )
          order by mn.score desc, mn.numbering asc
        )
        from matched_numbers mn
      ),
      '[]'::jsonb
    ),
    'shows',
    coalesce(
      (
        select jsonb_agg(to_jsonb(ms) - 'score' order by ms.score desc, ms.year desc nulls last)
        from matched_shows ms
      ),
      '[]'::jsonb
    )
  );
$$;
