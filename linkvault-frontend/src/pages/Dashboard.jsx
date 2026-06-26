import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [links, setLinks] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [url, setUrl] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [linksRes, colsRes] = await Promise.all([
        api.get('/links'),
        api.get('/collections')
      ])
      setLinks(linksRes.data.links)
      setCollections(colsRes.data.collections)
    } finally {
      setLoading(false)
    }
  }

  const addLink = async (e) => {
    e.preventDefault()
    if (!url) return
    setAdding(true)
    try {
      await api.post('/links', { url })
      setUrl('')
      setShowModal(false)
      fetchAll()
    } catch (err) {
      alert(err.response?.data?.error || 'Falha ao adicionar link')
    } finally {
      setAdding(false)
    }
  }

  const deleteLink = async (id) => {
    await api.delete(`/links/${id}`)
    setLinks(links.filter(l => l.id !== id))
  }

  const toggleFavorite = async (id) => {
    await api.patch(`/links/${id}/favorite`)
    fetchAll()
  }

  const registerClick = async (id, linkUrl) => {
    await api.patch(`/links/${id}/click`)
    window.open(linkUrl, '_blank')
    fetchAll()
  }

  const filtered = links.filter(l => {
    if (filter === 'favorites') return l.favorite
    if (filter !== 'all') return l.category === filter
    return true
  }).filter(l =>
    !search ||
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.tags?.toLowerCase().includes(search.toLowerCase()) ||
    l.summary?.toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(links.map(l => l.category).filter(Boolean))]

  const handleLogout = () => { logout(); navigate('/login') }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Carregando...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col p-4 fixed h-full">
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-xl">🔗</span>
          <span className="text-white font-semibold">LinkVault</span>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          {[
            { id: 'all', label: 'Todos os links', icon: '◈' },
            { id: 'favorites', label: 'Favoritos', icon: '♥' },
          ].map(item => (
            <button key={item.id} onClick={() => setFilter(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${filter === item.id ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}

          <div className="pt-4 pb-1 px-3 text-xs text-gray-600 uppercase tracking-wider">Categorias</div>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${filter === cat ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span>◆</span>{cat}
            </button>
          ))}

          {collections.length > 0 && (
            <>
              <div className="pt-4 pb-1 px-3 text-xs text-gray-600 uppercase tracking-wider">Coleções</div>
              {collections.map(col => (
                <button key={col.id}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                  <span>📁</span>{col.name}
                  <span className="ml-auto text-xs text-gray-600">{col._count.links}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        <button onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 mt-4">
          <span>→</span> Sair
        </button>
      </div>

      {/* Main */}
      <div className="ml-56 flex-1 p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Links totais', value: links.length },
            { label: 'Favoritos', value: links.filter(l => l.favorite).length },
            { label: 'Coleções', value: collections.length },
            { label: 'Categorias', value: categories.length },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Topbar — só busca e botão, sem campo de URL duplicado */}
        <div className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar por título, tags ou resumo da IA..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
          />
          <button onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
            + Adicionar link
          </button>
        </div>

        {/* Links Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            {search ? 'Nenhum link encontrado' : 'Nenhum link ainda — adicione o primeiro!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(link => (
              <div key={link.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
                {link.image && (
                  <img src={link.image} alt={link.title}
                    className="w-full h-36 object-cover cursor-pointer"
                    onClick={() => registerClick(link.id, link.url)}
                    onError={e => e.target.style.display = 'none'} />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 onClick={() => registerClick(link.id, link.url)}
                      className="text-sm font-medium text-white line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors flex-1">
                      {link.title || link.url}
                    </h3>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => toggleFavorite(link.id)}
                        className={`p-1.5 rounded-lg transition-colors ${link.favorite ? 'text-red-400' : 'text-gray-600 hover:text-red-400'}`}>
                        ♥
                      </button>
                      <button onClick={() => deleteLink(link.id)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 transition-colors">
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Resumo gerado pela IA */}
                  {link.summary && (
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg px-3 py-2 mb-3">
                      <p className="text-xs text-blue-300 line-clamp-2">
                        ✦ <span className="text-gray-500 mr-1">IA:</span>{link.summary}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {link.category || 'Outro'}
                    </span>
                    <span className="text-xs text-gray-600">{link.clicks} cliques</span>
                  </div>

                  {link.tags && (
                    <div className="flex gap-1 flex-wrap">
                      {link.tags.split(',').map(tag => (
                        <span key={tag} className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar Link */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-medium mb-1">Adicionar novo link</h2>
            <p className="text-xs text-gray-500 mb-4">A IA vai categorizar, gerar tags e resumir automaticamente</p>
            <form onSubmit={addLink} className="space-y-4">
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                autoFocus
              />
              {adding && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-blue-400 flex items-center gap-2">
                    <span className="animate-pulse">✦</span>
                    IA analisando o link... isso pode levar alguns segundos
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-2.5 text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={adding}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
                  {adding ? 'Salvando...' : 'Salvar link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}