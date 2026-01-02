(() => {
  const tagMap = {
    dunya: 'Dünya',
    avrupa: 'Avrupa',
    almanya: 'Almanya',
    turkiye: 'Türkiye'
  };

  const newsGrid = document.getElementById('newsGrid');
  const emptyState = document.getElementById('emptyState');
  const errorState = document.getElementById('errorState');
  const resultsMeta = document.getElementById('resultsMeta');
  const searchInput = document.getElementById('searchInput');
  const chips = Array.from(document.querySelectorAll('.chip'));

  const placeholderNews = [
    {
      id: 'HABER00001',
      title: 'Dünya ekonomisinde yumuşak iniş beklentisi',
      summary: 'IMF ve Dünya Bankası, 2026 tahminlerinde büyümenin sınırlı ama istikrarlı süreceğini açıkladı.',
      body: 'Enerji fiyatlarındaki gerileme ve tedarik zincirlerindeki iyileşme, 2026 için enflasyon baskılarını hafifletiyor. Ancak jeopolitik riskler ve bölgesel seçim takvimleri, yatırımcı iştahını sınırlı tutmaya devam ediyor.',
      tag: 'dunya',
      image_url: '/img/haberler/HABER00001.jpg'
    },
    {
      id: 'HABER00002',
      title: 'AB’de yeşil mutabakat yatırımları hızlanıyor',
      summary: 'Yeni teşvik paketi, enerji verimliliği projelerine ek fon sağlıyor.',
      body: 'Komisyon, 2030 hedeflerine ulaşmak için özellikle bina yalıtımı, toplu taşıma ve batarya teknolojilerine odaklanacak. Üye ülkeler, paylaşımlı finansman modeliyle ilerleyecek.',
      tag: 'avrupa',
      image_url: '/img/haberler/HABER00002.jpg'
    },
    {
      id: 'HABER00003',
      title: 'Almanya’da nitelikli göç reformu yürürlükte',
      summary: 'Mavi Kart eşiklerinin düşmesi ve tanınma süreçlerinin hızlanması bekleniyor.',
      body: 'Yeni düzenleme, vasıflı iş gücünün ülkeye daha hızlı entegre olmasını hedefliyor. Dijital randevu sistemi ve hızlandırılmış diploma denklik süreçleri, başvuru sahiplerinin bekleme süresini kısaltacak.',
      tag: 'almanya',
      image_url: '/img/haberler/HABER00003.jpg'
    },
    {
      id: 'HABER00004',
      title: 'Türkiye’de teknoloji ihracatı rekor kırdı',
      summary: 'SaaS ve oyun dikeylerinde yeni unicorn adayları öne çıkıyor.',
      body: 'Yıllık rapora göre, küresel pazarlara açılan yerli girişimler döviz girdisini artırırken, Ar-Ge merkezleri için ek teşvikler gündemde. Ürünleştirme ve global satış ekipleri ölçeklenmeye hazırlanıyor.',
      tag: 'turkiye',
      image_url: '/img/haberler/HABER00004.jpg'
    }
  ];

  let allNews = [];
  let activeTag = 'all';
  let searchTerm = '';
  let metaNote = '';

  init();

  function init() {
    fetchNews();
    bindEvents();
  }

  function bindEvents() {
    searchInput.addEventListener('input', debounce((e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderFiltered();
    }, 150));

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        activeTag = chip.dataset.tag || 'all';
        chips.forEach((c) => c.classList.toggle('chip--active', c === chip));
        renderFiltered();
      });
    });
  }

  async function fetchNews() {
    setLoading(true);
    errorState.classList.add('hidden');
    errorState.textContent = 'Haberler yüklenemedi. Lütfen sayfayı yenileyin.';
    try {
      const res = await fetch('/api/news-list');
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      allNews = Array.isArray(json.items) ? json.items : [];
      if (!allNews.length) {
        allNews = placeholderNews;
        metaNote = ' (örnek veriler gösteriliyor)';
      } else {
        metaNote = '';
      }
      renderFiltered();
    } catch (err) {
      console.error('Haberler alınamadı', err);
      errorState.classList.remove('hidden');
      errorState.textContent = 'Canlı haber akışına ulaşılamadı, örnek içerik gösteriliyor.';
      allNews = placeholderNews;
      metaNote = ' (çevrimdışı mod)';
      renderFiltered();
    } finally {
      setLoading(false);
    }
  }

  function renderFiltered() {
    const filtered = allNews.filter((item) => {
      if (!item) return false;
      const matchesTag = activeTag === 'all' || (item.tag && item.tag.toLowerCase() === activeTag);
      const haystack = `${item.title || ''} ${item.summary || ''} ${item.body || ''}`.toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      return matchesTag && matchesSearch;
    });

    renderCards(filtered);
    updateMeta(filtered.length, allNews.length);
  }

  function renderCards(list) {
    newsGrid.innerHTML = '';
    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');

    if (!list.length) {
      emptyState.classList.remove('hidden');
      return;
    }

    const frag = document.createDocumentFragment();

    list.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card';

      const img = document.createElement('img');
      img.className = 'card__img';
      img.alt = item.title ? `Haber görseli: ${item.title}` : 'Haber görseli';
      img.loading = 'lazy';
      img.src = item.image_url || '/img/logoubt.png';
      img.onerror = () => { img.src = '/img/logoubt.png'; };
      card.appendChild(img);

      const body = document.createElement('div');
      body.className = 'card__body';

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = tagMap[item.tag] || 'Genel';
      body.appendChild(badge);

      const title = document.createElement('h2');
      title.className = 'card__title';
      title.textContent = item.title || 'Başlıksız haber';
      body.appendChild(title);

      if (item.summary) {
        const summary = document.createElement('p');
        summary.className = 'card__summary';
        summary.textContent = item.summary;
        body.appendChild(summary);
      }

      if (item.body) {
        const details = document.createElement('details');
        const summaryToggle = document.createElement('summary');
        summaryToggle.textContent = 'Uzun metni göster';
        const longText = document.createElement('p');
        longText.textContent = item.body;
        details.appendChild(summaryToggle);
        details.appendChild(longText);
        body.appendChild(details);
      }

      card.appendChild(body);
      frag.appendChild(card);
    });

    newsGrid.appendChild(frag);
  }

  function updateMeta(shown, total) {
    resultsMeta.textContent = `${shown} / ${total} haber gösteriliyor${metaNote}`;
  }

  function showError() {
    errorState.classList.remove('hidden');
    newsGrid.innerHTML = '';
    resultsMeta.textContent = 'Haberler yüklenemedi';
  }

  function setLoading(isLoading) {
    resultsMeta.textContent = isLoading ? 'Yükleniyor…' : resultsMeta.textContent;
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }
})();
