import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

const docsMap = import.meta.glob('../docs_reyjoa/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const docs = Object.entries(docsMap)
  .map(([path, content]) => {
    const fileName = path.split('/').pop()
    const slug = fileName.replace(/\.md$/, '')
    const orderMatch = slug.match(/^(\d+)/)
    const order = orderMatch ? Number(orderMatch[1]) : 999
    const headingMatch = content.match(/^#\s+(.+)/m)
    const title = headingMatch
      ? headingMatch[1].trim()
      : slug.replace(/^\d+_?/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

    return { fileName, slug, title, content, order }
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

const emptyDoc = {
  fileName: 'N/A',
  slug: 'empty',
  title: 'No se encontraron documentos',
  content: 'Asegúrate de que `docs_reyjoa` contiene archivos Markdown y recarga la página.',
  order: 999,
}

function App() {
  const [selected, setSelected] = useState(0)

  const selectedDoc = useMemo(
    () => docs[selected] || docs[0] || emptyDoc,
    [selected],
  )

  return (
    <div className="app-shell">
      <div className="app-header">
        <div>
          <p className="eyebrow">Navegador de Markdown</p>
          <h1>Informe</h1>
          <p className="subtitle">Explora los archivos Markdown y visualiza su contenido de forma navegable.</p>
        </div>
        <div className="meta-card">
          <span>{docs.length} archivos</span>
          <strong>{selectedDoc.title}</strong>
        </div>
      </div>

      <div className="app-grid">
        <aside className="doc-list">
          <div className="panel-title">Documentos</div>
          <div className="list-group">
            {docs.map((doc, index) => (
              <button
                key={doc.slug}
                type="button"
                className={`doc-item ${index === selected ? 'active' : ''}`}
                onClick={() => setSelected(index)}
              >
                <div>
                  <div className="doc-item-title">{doc.title}</div>
                  <div className="doc-item-subtitle">{doc.fileName}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="doc-view">
          <article className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedDoc.content}</ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  )
}

export default App
