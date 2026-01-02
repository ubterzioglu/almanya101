const { getSupabaseClient } = require('../lib/supabase');

const VALID_TAGS = ['dunya', 'avrupa', 'almanya', 'turkiye'];
const DEFAULT_LIMIT = 100;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    return res.json({ error: 'Method not allowed' });
  }

  const supabase = getSupabaseClient();
  const searchRaw = (req.query.search || '').toString();
  const search = searchRaw.replace(/,/g, ' ').trim();
  const tag = (req.query.tag || '').toString().trim().toLowerCase();
  const limitParam = Number(req.query.limit);
  const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 500 ? limitParam : DEFAULT_LIMIT;

  let query = supabase
    .from('news_articles')
    .select('id,title,summary,body,tag,created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (VALID_TAGS.includes(tag)) {
    query = query.eq('tag', tag);
  }

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      [
        `title.ilike.${pattern}`,
        `summary.ilike.${pattern}`,
        `body.ilike.${pattern}`
      ].join(',')
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error('news-list error', error);
    res.statusCode = 500;
    return res.json({ error: 'Haberler alınırken hata oluştu' });
  }

  const items = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    body: row.body,
    tag: row.tag,
    created_at: row.created_at,
    image_url: row.id ? `/img/haberler/${row.id}.jpg` : null
  }));

  return res.json({ items });
};
