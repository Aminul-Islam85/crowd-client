function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-primary">Tailwind & DaisyUI Test</h1>

      <div className="mt-6 flex gap-4">
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
        <button className="btn btn-accent">Accent Button</button>
      </div>

      <div className="mt-6 card w-96 bg-base-200 shadow-xl p-4">
        <h2 className="text-2xl font-semibold">DaisyUI Card</h2>
        <p className="text-gray-600">This is a test to verify Tailwind & DaisyUI.</p>
      </div>
    </div>
  );
}

export default App;
