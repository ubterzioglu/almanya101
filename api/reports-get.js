const { getSupabaseClient } = require('../lib/supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Only GET supported' });
    return;
  }

  const id = req.query.id;
  if (!id) {
    res.status(400).json({ message: 'id parametresi gerekli' });
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('salary_submissions')
      .select('input_json, output_json, created_at')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      res.status(404).json({ message: 'Kayıt bulunamadı' });
      return;
    }
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('reports-get error', err);
    res.status(500).json({ message: 'Rapor alınamadı' });
  }
};
