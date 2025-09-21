import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error:', error, info);
    try {
      // expose the last error for easy copy/paste debugging
      window.__LAST_ERROR__ = { error: String(error), info };
    } catch (e) {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) {
      const dump = JSON.stringify({ error: String(this.state.error), time: new Date().toISOString() }, null, 2);
      return (
        <div className="p-6 bg-white rounded shadow border">
          <h3 className="text-lg font-bold text-red-600">Something went wrong</h3>
          <p className="text-sm text-gray-600 mt-2">An unexpected error occurred while loading this section. Please try again or contact support.</p>
          <div className="mt-3 text-xs text-gray-500">
            <details>
              <summary className="cursor-pointer">Show error</summary>
              <pre className="whitespace-pre-wrap mt-2 p-2 bg-gray-50 rounded border">{String(this.state.error)}</pre>
            </details>
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(dump);
                    alert('Error details copied to clipboard');
                  } catch (e) {
                    console.warn('Clipboard copy failed', e);
                  }
                }}
                className="px-3 py-1 bg-amber-600 text-white rounded text-sm"
              >
                Copy details
              </button>
              <textarea readOnly value={dump} className="flex-1 p-2 text-xs bg-gray-50 rounded border" rows={4} />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
