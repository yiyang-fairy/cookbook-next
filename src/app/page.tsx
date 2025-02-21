import Link from 'next/link';

export default function Home() {
  const menuItems = [
    { id: 1, title: '菜单项1', description: '描述1' },
    { id: 2, title: '菜单项2', description: '描述2' },
    { id: 3, title: '菜单项3', description: '描述3' },
  ];

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">首页</h1>
      
      {/* 菜单列表 */}
      <div className="grid gap-4 mb-8">
        {menuItems.map((item) => (
          <Link 
            key={item.id}
            href={`/detail/${item.id}`}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>

      {/* 转盘按钮 */}
      <Link
        href="/turntable"
        className="fixed bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
      >
        抽奖转盘
      </Link>
    </main>
  );
}
