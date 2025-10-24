import Link from 'next/link'

export default function MenusPage() {
  // Mock menus data for demo
  const menus = [
    {
      _id: 'menu-1',
      title: 'Sample Sushi Menu',
      template: 'sushi'
    },
    {
      _id: 'menu-2',
      title: 'Fancy Restaurant Menu',
      template: 'fancy'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
        <Link 
          href="/menus/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Menu
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div key={menu._id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">{menu.title}</h3>
            <p className="text-gray-600">{menu.template}</p>
            <div className="mt-4 flex gap-2">
              <Link 
                href={`/menus/${menu._id}`}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View
              </Link>
              <Link 
                href={`/menus/${menu._id}/edit`}
                className="text-sm text-green-600 hover:text-green-500"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
