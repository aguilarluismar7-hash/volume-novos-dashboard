// Monta o sidebar automaticamente em qualquer página que tiver
// <nav class="sidebar" id="sidebar-root"></nav> no <body>.
// Mudar um link, o texto da marca, ou a logo? Só precisa editar AQUI.
(function(){
  const NAV_ITEMS = [
    { href: '/index.html', label: 'Fornecedores' },
    { href: '/analises.html', label: 'Análises' },
    { href: '/despesas.html', label: 'Despesas' },
  ];

  function currentPath(){
    let path = location.pathname;
    if(path === '' || path === '/') path = '/index.html';
    return path;
  }

  function render(){
    const root = document.getElementById('sidebar-root');
    if(!root) return;

    const path = currentPath();
    const linksHtml = NAV_ITEMS.map(item => {
      const isActive = path.endsWith(item.href);
      return `<a href="${item.href}"${isActive ? ' class="active"' : ''}>${item.label}</a>`;
    }).join('');

    root.innerHTML = `
      <div class="sidebar-logo">
        <img src="/logosemfundo.png" alt="Grupo Raviera" onerror="this.style.display='none'">
        <span class="sidebar-brand">RAVIERA</span>
      </div>
      <div class="sidebar-links">${linksHtml}</div>
    `;
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();