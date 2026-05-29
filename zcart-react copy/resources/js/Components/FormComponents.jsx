export function FormField({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export function Input({ error, ...props }) {
    return (
        <input {...props}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
    );
}

export function Select({ error, children, ...props }) {
    return (
        <select {...props}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
            {children}
        </select>
    );
}

export function Textarea({ error, ...props }) {
    return (
        <textarea {...props}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
    );
}

export function SubmitButton({ processing, label = 'Save', loadingLabel = 'Saving...' }) {
    return (
        <button type="submit" disabled={processing}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 transition flex items-center gap-2">
            {processing ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {loadingLabel}
                </>
            ) : label}
        </button>
    );
}

export function StatusBadge({ active, trueLabel = 'Active', falseLabel = 'Inactive' }) {
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {active ? trueLabel : falseLabel}
        </span>
    );
}

export function PageHeader({ title, action }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            {action}
        </div>
    );
}
