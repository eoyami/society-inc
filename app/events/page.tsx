import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Society Inc - Eventos',
  description: 'Lista de eventos',
}

export default function EventsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8">Eventos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aqui virão os eventos */}
          <div className="border rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                Próximo
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Nome do Evento</h2>
            <div className="space-y-2 text-gray-600">
              <p>📅 Data: 01/01/2024</p>
              <p>🕒 Horário: 19:00</p>
              <p>📍 Local: Local do Evento</p>
            </div>
            <p className="mt-4 text-gray-700">Descrição do evento...</p>
          </div>
        </div>
      </div>
    </main>
  )
} 