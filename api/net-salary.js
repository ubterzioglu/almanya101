const { randomUUID } = require('crypto');
const { getSupabaseClient } = require('../lib/supabase');

const SESSION_HEADER = 'x-session-id';
const TABLE = 'salary_submissions';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Only POST supported' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? safeParseJson(req.body) : (req.body || {});
    const { gross_monthly, year, tax_class, has_child = false, church_tax = false, health_extra_rate = 0 } = body;

    const validationError = validateInput({ gross_monthly, year, tax_class });
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    const calc = calculateNet({
      gross: Number(gross_monthly),
      year: Number(year),
      taxClass: Number(tax_class),
      hasChild: Boolean(has_child),
      churchTax: Boolean(church_tax),
      healthExtraRate: Number(health_extra_rate) || 0
    });

    const sessionId = req.headers[SESSION_HEADER] || randomUUID();

    const supabase = getSupabaseClient();
    const insertPayload = {
      year: Number(year),
      gross_monthly: Number(gross_monthly),
      net_monthly: calc.net,
      tax_class: Number(tax_class),
      has_child: Boolean(has_child),
      church_tax: Boolean(church_tax),
      health_extra_rate: Number(health_extra_rate) || 0,
      session_id: sessionId,
      input_json: body,
      output_json: calc
    };

    const { data, error } = await supabase.from(TABLE).insert(insertPayload).select('id').single();
    if (error) throw error;

    res.status(200).json({ ...calc, submission_id: data.id, session_id: sessionId });
  } catch (err) {
    console.error('net-salary error', err);
    res.status(500).json({ message: 'Hesaplama sırasında hata oluştu' });
  }
};

function safeParseJson(str) {
  try { return JSON.parse(str || '{}'); } catch (_) { return {}; }
}

function validateInput({ gross_monthly, year, tax_class }) {
  if (!gross_monthly || Number(gross_monthly) <= 0) return 'Brüt maaş pozitif olmalı';
  if (![2024, 2025].includes(Number(year))) return 'Yalnızca 2024 ve 2025 destekleniyor';
  if (Number(tax_class) < 1 || Number(tax_class) > 6) return 'Vergi sınıfı 1-6 arasında olmalı';
  return null;
}

function calculateNet({ gross, year, taxClass, hasChild, churchTax, healthExtraRate }) {
  const rates = getRates({ year, hasChild, healthExtraRate });

  const pension = round2(gross * rates.pension);
  const unemployment = round2(gross * rates.unemployment);
  const health = round2(gross * rates.health);
  const care = round2(gross * rates.care);

  const socialTotal = round2(pension + unemployment + health + care);

  const taxableYearly = Math.max(0, gross * 12 - socialTotal * 12);
  const incomeTaxYearly = approximateIncomeTax(year, taxableYearly, taxClass);
  const incomeTax = round2(incomeTaxYearly / 12);

  const solidarity = incomeTax > 0 && taxableYearly > 20000 ? round2(incomeTax * 0.055) : 0;
  const church = churchTax ? round2(incomeTax * 0.09) : 0;
  const taxesTotal = round2(incomeTax + solidarity + church);

  const net = round2(gross - socialTotal - taxesTotal);

  return {
    gross: round2(gross),
    net,
    taxes: {
      incomeTax,
      solidarity,
      church,
      total: taxesTotal
    },
    social: {
      pension,
      unemployment,
      health,
      care,
      total: socialTotal
    }
  };
}

function getRates({ year, hasChild, healthExtraRate }) {
  const healthExtraDecimal = (Number(healthExtraRate) || 0) / 100;
  return {
    pension: 0.093, // çalışan payı
    unemployment: 0.012,
    health: 0.073 + (healthExtraDecimal / 2),
    care: hasChild ? 0.015 : 0.02,
    allowance: year === 2025 ? 11800 : 11604
  };
}

function approximateIncomeTax(year, taxableYearly, taxClass) {
  const allowance = year === 2025 ? 11800 : 11604;
  const x = Math.max(0, taxableYearly - allowance);

  let tax = 0;
  if (x <= 0) tax = 0;
  else if (x <= 16000) tax = x * 0.14;
  else if (x <= 60000) tax = 16000 * 0.14 + (x - 16000) * 0.24;
  else if (x <= 120000) tax = 16000 * 0.14 + 44000 * 0.24 + (x - 60000) * 0.42;
  else tax = 16000 * 0.14 + 44000 * 0.24 + 60000 * 0.42 + (x - 120000) * 0.45;

  // vergi sınıfı 3 için hafif avantaj; 5/6 için dezavantaj
  if (taxClass === 3) tax *= 0.9;
  if (taxClass === 5 || taxClass === 6) tax *= 1.05;

  return tax;
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}
