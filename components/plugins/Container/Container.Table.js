Container.prototype.Table = function (data = [], options = {}) {
  if (!Array.isArray(data)) throw new Error('Container.Table: data must be an array of objects');
  const defaults = {
    pageSize: 10,
    sizes: [],
    pageButtonLimit: 5,
    debounce: 250,
    search: true,
    sort: true,
    filter: true,
    page: true,
    info: true,
    language: ['Search...', 'No results found.', 'Showing [PAGE] to [ALL_PAGES] of [TOTAL] entries','First', 'Prev', 'Next', 'Last'],
  };
  options = Object.assign({}, defaults, options);

  const {
    debounce: debounceTime,
    search: enableSearch,
    sort: enableSort,
    filter: enableFilter,
    page: enablePage,
    info: enableInfo
  } = options;

  if (!Container.tableClassesInitialized) {
    Container.tableClasses = Q.style('', `
      .tbl_wrapper { display: flex; flex-direction: column; }
      .tbl_top { display: flex; justify-content: space-between; margin-bottom: 5px; }
      .tbl_table { width:100%; border-collapse: collapse; 
      
      border-radius: var(--form-default-border-radius);
      overflow: hidden;
      }


      .tbl_table th, .tbl_table td {
      border: var(--form-default-dataset-border);
      padding:6px;
      text-align:left;
      cursor: default;
      }

      .tbl_row.selected { background: var(--form-default-accent-color); color: var(--form-default-accent-text-color); }
      
            .tbl_table th
      {
        background: var(--form-default-dataset-header-background);
        color: var(--form-default-dataset-header-text-color);
        font-weight: var(--form-default-dataset-header-font-weight);
        font-size: var(--form-default-dataset-header-font-size);
        padding-right: 25px;
}
        .tbl_table td
      {
        font-size: var(--form-default-dataset-header-data-font-size);
        color: var(--form-default-dataset-data-text-color);
    }

      .tbl_bottom {
      display: flex;
      justify-content: space-between;
      margin-top:5px; 
      font-size: var(--form-default-dataset-header-data-font-size);
      color: var(--form-default-dataset-data-text-color);
      }
      
      .tbl_pagination {
      display:flex;
      gap:2px;
      }
      
      .tbl_page_btn {
      padding: 5px 15px;
      cursor: default;
      user-select: none;
      }
      
      .tbl_page_btn.active { 
      background: var(--form-default-accent-color);
        color: var(--form-default-text-color-active);
    }

      .tbl_table th { position: relative; }
      .tbl_table th .sort-icons {
        position: absolute; right: 8px; top: 50%;
        transform: translateY(-50%);
        display: flex; flex-direction: column;
        font-size: 8px; line-height: 1.3;
      }

      .sort_active {
      color: var(--form-default-accent-color);
    }

    `, null, {
      'tbl_wrapper': 'tbl_wrapper',
      'tbl_top': 'tbl_top',
      'tbl_search': 'tbl_search',
      'tbl_page_size': 'tbl_page_size',
      'tbl_table': 'tbl_table',
      'tbl_row': 'tbl_row',
      'tbl_bottom': 'tbl_bottom',
      'tbl_pagination': 'tbl_pagination',
      'tbl_page_btn': 'tbl_page_btn',
      'sort-icons': 'sort-icons',
      'asc': 'asc', 'desc': 'desc',
      'sort_active': 'sort_active',
      'active': 'active',
      'selected': 'selected',
    }, true);
    Container.tableClassesInitialized = true;
  }
  const wrapper = Q('<div>', { class: Container.tableClasses.tbl_wrapper });
  const top = Q('<div>', { class: Container.tableClasses.tbl_top });

  let allData = [...data],
    currentPage = 1,
    sortKey = null,
    sortOrder = 'off',
    selectedIdx = null,
    onChange = null,
    filteredIndices = [];

  const columnSizes = options.sizes;

  const form = new Q.Form();

  const searchInput = form.TextBox('text', '', options.language[0]);
  const search = Q('<div>', { class: Container.tableClasses.tbl_search })
    .append(searchInput.nodes[0]);

  if (enableSearch) top.append(search);

  const searchDebounceId = Q.ID('tbl_search_');

  const table = Q('<table>', { class: Container.tableClasses.tbl_table });
  const bottom = Q('<div>', { class: Container.tableClasses.tbl_bottom });
  const status = Q('<div>');
  const pagination = Q('<div>', { class: Container.tableClasses.tbl_pagination });
  bottom.append(status, pagination);
  wrapper.append(top, table, bottom);

  let pageSizeVal = options.pageSize;
  const pageSizeDropdown = form.Dropdown({
    values: [10, 25, 50, 100].map(n => ({ value: n, text: '' + n, default: n === pageSizeVal }))
  });
  const pageSize = Q('<div>', { class: Container.tableClasses.tbl_page_size })
    .append(pageSizeDropdown.nodes[0]);

  if (enablePage) top.append(pageSize);

  pageSizeDropdown.change(v => {
    pageSizeVal = +v;
    currentPage = 1;
    render();
  });

  pageSizeVal = +pageSizeDropdown.val().value;

  function render() {
    const rawVal = searchInput.val() || '';
    const term = rawVal.trim();
    if (enableFilter) {
      filteredIndices = allData.map((row, i) => i);
      if (term.includes(':')) {
        const clauses = term.split(',').map(c => {
          const [field, ...rest] = c.split(':');
          return [field.trim(), rest.join(':').trim()];
        });
        filteredIndices = filteredIndices.filter(i => {
          const row = allData[i];
          return clauses.every(([field, val]) => {
            const fv = row[field];
            if (fv == null) return false;
            const str = typeof fv === 'object' ? JSON.stringify(fv) : String(fv);
            return str.toLowerCase().includes(val.toLowerCase());
          });
        });
      } else {
        const lower = term.toLowerCase();
        filteredIndices = filteredIndices.filter(i =>
          JSON.stringify(allData[i]).toLowerCase().includes(lower)
        );
      }
    } else {
      filteredIndices = allData.map((_, i) => i);
    }

    if (enableSort && sortKey && sortOrder !== 'off') {
      filteredIndices.sort((a, b) => {
        const aVal = allData[a][sortKey];
        const bVal = allData[b][sortKey];
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = filteredIndices.length;
    const totalPages = Math.ceil(total / pageSizeVal) || 1;
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * pageSizeVal,
      end = start + pageSizeVal;
    const pageIndices = enablePage
      ? filteredIndices.slice(start, end)
      : filteredIndices;

    const keys = Object.keys(allData[0] || {});
    // build table headers, only inject sort icons if sorting enabled
    const thead = `<thead><tr>${keys.map((k, i) => {
      const icons = enableSort
        ? `<span class="${Container.tableClasses['sort-icons']}">
               <span class="${Container.tableClasses.asc}">▲</span>
               <span class="${Container.tableClasses.desc}">▼</span>
             </span>`
        : '';
      return `<th data-key="${k}"${columnSizes[i] ? ` style="width:${columnSizes[i]}"` : ''}>${k}${icons}</th>`;
    }).join('')
      }</tr></thead>`;

    const tbody = pageIndices.map(idx => {
      const row = allData[idx];
      return `<tr data-idx="${idx}" class="${Container.tableClasses.tbl_row}${idx === selectedIdx ? ' '+ Container.tableClasses.selected : ''}">${Object.values(row).map(v => {
        if (Array.isArray(v)) return `<td>${v.join(', ')}</td>`;
        if (typeof v === 'object') return `<td>${JSON.stringify(v)}</td>`;
        return `<td>${v}</td>`;
      }).join('')
        }</tr>`;
    }).join('');

    table.html('');
    table.append(thead + `<tbody>${tbody}</tbody>`);

    if (enableInfo) {
      if (total === 0) {
        status.html(options.language[1]);
      } else{
      const pageInfo = options.language[2]
        .replace('[PAGE]', currentPage)
        .replace('[ALL_PAGES]', totalPages)
        .replace('[TOTAL]', total);
      status.html(pageInfo);
      }
    }

    if (enablePage) {
      pagination.html('');
      [options.language[3], options.language[4]].forEach(t => {
        const btn = `<span class="${Container.tableClasses.tbl_page_btn}" data-action="${t.toLowerCase()}">${t}</span>`;
        pagination.append(btn);
      });

      const limit = options.pageButtonLimit;
      const half = Math.floor(limit / 2);
      let startPage = Math.max(1, currentPage - half);
      let endPage = Math.min(totalPages, startPage + limit - 1);
      if (endPage - startPage + 1 < limit) {
        startPage = Math.max(1, endPage - limit + 1);
      }
      for (let p = startPage; p <= endPage; p++) {
        const cls = p === currentPage ? ' '+ Container.tableClasses.active : '';
        pagination.append(`<span class="${Container.tableClasses.tbl_page_btn + cls}" data-page="${p}">${p}</span>`);
      }

      [options.language[5], options.language[6]].forEach(t => {
        const btn = `<span class="${Container.tableClasses.tbl_page_btn}" data-action="${t.toLowerCase()}">${t}</span>`;
        pagination.append(btn);
      });
    }
  }

  if (enableSearch) {
    searchInput.change(() => {
      Q.Debounce(searchDebounceId, debounceTime, () => {
        currentPage = 1;
        render();
      });
    });
  }

  table.on('click', evt => {
    const th = evt.target.closest('th');
    const tr = evt.target.closest('tr[data-idx]');
    if (enableSort && th) {
      const key = th.dataset.key;
      if (sortKey === key) {
        if (sortOrder === 'off') sortOrder = 'asc';
        else if (sortOrder === 'asc') sortOrder = 'desc';
        else { sortOrder = 'off'; sortKey = null; }
      } else {
        sortKey = key;
        sortOrder = 'asc';
      }
      render();

      Q('.' + Container.tableClasses.sort_active).removeClass(Container.tableClasses.sort_active);

      if (sortOrder != 'off') {
        const arrowKey = sortOrder === 'asc' ? Container.tableClasses.asc : Container.tableClasses.desc;
        const head = Q(`[data-key="${key}"] .${Container.tableClasses[arrowKey]}`)
        head.addClass(Container.tableClasses.sort_active);
      }
    } else if (tr) {
      const idx = +tr.dataset.idx;
      wrapper.select(idx);
    }
  });

  if (enablePage) {
    pagination.on('click', evt => {
      const tgt = evt.target;
      if (tgt.dataset.page) currentPage = +tgt.dataset.page;
      else if (tgt.dataset.action === 'first') currentPage = 1;
      else if (tgt.dataset.action === 'prev') currentPage = Math.max(1, currentPage - 1);
      else if (tgt.dataset.action === 'next') currentPage = Math.min(Math.ceil(filteredIndices.length / pageSizeVal), currentPage + 1);
      else if (tgt.dataset.action === 'last') currentPage = Math.ceil(filteredIndices.length / pageSizeVal);
      render();
    });
  }

  wrapper.load = function (newData, stayOn = false) {
    allData = [...newData];
    if (!stayOn) { sortKey = null; sortOrder = 'off'; currentPage = 1; }
    wrapper; render(); return this;
  };
  wrapper.select = function (idx, key, val) {
    if (key != null) {
      const found = allData.findIndex(o => o[key] === val);
      if (found >= 0) idx = found;
    }
    selectedIdx = idx;
    table.find('tr').removeClass(Container.tableClasses.selected);
    table.find(`tr[data-idx="${idx}"]`).addClass(Container.tableClasses.selected);
    if (onChange) onChange(idx, allData[idx]);
    return this;
  };
  wrapper.change = function (cb) { onChange = cb; return this; };
  wrapper.index = function (idx) { return wrapper.select(idx); };
  wrapper.clear = function () { allData = []; render(); return this; };

  this.elements.push(wrapper);
  render();
  return wrapper;
};