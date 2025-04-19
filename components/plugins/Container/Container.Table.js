Container.prototype.Table = function (data = [], options = {}) {
  // defaults for plugin options, demonstrating available keys
  const defaults = {
    pageSize: 10,
    sizes: ['30px', '100%', '100px', '150px', '200px'],
    pageButtonLimit: 5       // max number of numeric page buttons shown
  };
  options = Object.assign({}, defaults, options);

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
        width: 50%;
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
      'sort_active': 'sort_active'
    }, false);
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

  // replace old per‑column sizes fallback
  // const columnSizes = options.sizes || [];
  const columnSizes = options.sizes;

  // create one Form controller
  const form = new Q.Form();

  // use Form.TextBox for search
  const searchInput = form.TextBox('text', '', 'Search…');
  const search = Q('<div>', { class: Container.tableClasses.tbl_search })
    .append(searchInput.nodes[0]);

  // generate a unique debounce key for this instance
  const searchDebounceId = Q.ID('tbl_search_');

  const table = Q('<table>', { class: Container.tableClasses.tbl_table });
  const bottom = Q('<div>', { class: Container.tableClasses.tbl_bottom });
  const status = Q('<div>');
  const pagination = Q('<div>', { class: Container.tableClasses.tbl_pagination });
  bottom.append(status, pagination);
  top.append(search);
  wrapper.append(top, table, bottom);

  // entries‑per‑page dropdown (after table exists)
  // replace old pageSize fallback
  // let pageSizeVal = options.pageSize || 10;
  let pageSizeVal = options.pageSize;
  const pageSizeDropdown = form.Dropdown({
    values: [10, 25, 50, 100].map(n => ({ value: n, text: '' + n, default: n === pageSizeVal }))
  });
  const pageSize = Q('<div>', { class: Container.tableClasses.tbl_page_size })
    .append(pageSizeDropdown.nodes[0]);
  top.append(pageSize);

  // bind dropdown change (now that render() and table are initialized)
  pageSizeDropdown.change(v => {
    pageSizeVal = +v;
    currentPage = 1;
    render();
  });

  // sync initial pageSizeVal to dropdown’s selection
  pageSizeVal = +pageSizeDropdown.val().value;

  // Utils
  function render() {
    // filter and keep original indices
    const rawVal = searchInput.val() || '';
    const term = rawVal.trim();
    filteredIndices = allData.map((row, i) => i);
    if (term.includes(':')) {
      // conditional field:value search, multiple clauses separated by comma
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
      // simple text search across all fields
      const lower = term.toLowerCase();
      filteredIndices = filteredIndices.filter(i =>
        JSON.stringify(allData[i]).toLowerCase().includes(lower)
      );
    }

    const total = filteredIndices.length;
    const totalPages = Math.ceil(total / pageSizeVal) || 1;
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * pageSizeVal,
      end = start + pageSizeVal;
    const pageIndices = filteredIndices.slice(start, end);

    // build table headers with optional width styles
    const keys = Object.keys(allData[0] || {});
    const thead = `<thead><tr>${keys.map((k, i) =>
      `<th data-key="${k}"${columnSizes[i] ? ` style="width:${columnSizes[i]}"` : ''
      }>${k}
           <span class="${Container.tableClasses['sort-icons']}">
             <span class="${Container.tableClasses.asc}">▲</span>
             <span class="${Container.tableClasses.desc}">▼</span>
           </span>
         </th>`
    ).join('')
      }</tr></thead>`;

    // build body using original indices
    const tbody = pageIndices.map(idx => {
      const row = allData[idx];
      return `<tr data-idx="${idx}" class="${Container.tableClasses.tbl_row}${idx === selectedIdx ? ' selected' : ''}">${Object.values(row).map(v => {
        if (Array.isArray(v)) return `<td>${v.join(', ')}</td>`;
        if (typeof v === 'object') return `<td>${JSON.stringify(v)}</td>`;
        return `<td>${v}</td>`;
      }).join('')
        }</tr>`;
    }).join('');

    table.html('');
    table.append(thead + `<tbody>${tbody}</tbody>`);

    // status text
    status.text(`Showing ${start + 1} to ${Math.min(end, total)} of ${total} entries`);

    // pagination buttons
    pagination.html('');
    ['First', 'Prev'].forEach(t => {
      const btn = `<span class="${Container.tableClasses.tbl_page_btn}" data-action="${t.toLowerCase()}">${t}</span>`;
      pagination.append(btn);
    });

    // window numeric page buttons based on pageButtonLimit
    const limit = options.pageButtonLimit;
    const half = Math.floor(limit / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, startPage + limit - 1);
    if (endPage - startPage + 1 < limit) {
      startPage = Math.max(1, endPage - limit + 1);
    }
    for (let p = startPage; p <= endPage; p++) {
      const cls = p === currentPage ? ' active' : '';
      pagination.append(`<span class="${Container.tableClasses.tbl_page_btn + cls}" data-page="${p}">${p}</span>`);
    }

    ['Next', 'Last'].forEach(t => {
      const btn = `<span class="${Container.tableClasses.tbl_page_btn}" data-action="${t.toLowerCase()}">${t}</span>`;
      pagination.append(btn);
    });
  }

  // Event bindings
  searchInput.change(() => {
    Q.Debounce(searchDebounceId, 250, () => {
      currentPage = 1;
      render();
    });
  });
  table.on('click', evt => {
    const th = evt.target.closest('th');
    const tr = evt.target.closest('tr[data-idx]');
    if (th) {
      const key = th.dataset.key;
      if (sortKey === key) {
        // cycle: off → asc → desc → off
        if (sortOrder === 'off') sortOrder = 'asc';
        else if (sortOrder === 'asc') sortOrder = 'desc';
        else { sortOrder = 'off'; sortKey = null; }
      } else {
        sortKey = key;
        sortOrder = 'asc';
      }
      render();

      document
        .querySelectorAll(`.${Container.tableClasses.sort_active}`)
        .forEach(el => el.classList.remove(Container.tableClasses.sort_active));

      if (sortOrder != 'off') {
        const arrowKey = sortOrder === 'asc' ? Container.tableClasses.asc : Container.tableClasses.desc;
        const head = Q(`[data-key="${key}"] .${Container.tableClasses[arrowKey]}`)
        console.log('arrowKey', arrowKey);
        head.addClass(Container.tableClasses.sort_active);
      }
    } else if (tr) {
      const idx = +tr.dataset.idx;
      wrapper.select(idx);
    }
  });
  pagination.on('click', evt => {
    const tgt = evt.target;
    if (tgt.dataset.page) currentPage = +tgt.dataset.page;
    else if (tgt.dataset.action === 'first') currentPage = 1;
    else if (tgt.dataset.action === 'prev') currentPage = Math.max(1, currentPage - 1);
    else if (tgt.dataset.action === 'next') currentPage = Math.min(Math.ceil(filteredIndices.length / pageSizeVal), currentPage + 1);
    else if (tgt.dataset.action === 'last') currentPage = Math.ceil(filteredIndices.length / pageSizeVal);
    render();
  });

  // API
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
    table.find('tr').removeClass('selected');
    table.find(`tr[data-idx="${idx}"]`).addClass('selected');
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