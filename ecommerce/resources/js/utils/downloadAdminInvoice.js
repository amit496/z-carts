/** Parse filename from Content-Disposition (RFC 5987 / simple forms). */
function parseFilenameFromDisposition(disposition, fallback) {
    if (!disposition || typeof disposition !== 'string') return fallback;
    const star = /filename\*=(?:UTF-8''|)([^;\n]+)/i.exec(disposition);
    if (star) {
        try {
            return decodeURIComponent(star[1].trim());
        } catch {
            return star[1].trim();
        }
    }
    const quoted = /filename="([^"]+)"/i.exec(disposition);
    if (quoted) return quoted[1];
    const plain = /filename=([^;\n]+)/i.exec(disposition);
    if (plain) return plain[1].trim().replace(/^"+|"+$/g, '');
    return fallback;
}

/**
 * Download invoice file on the client (no Inertia navigation / no new tab).
 * @param {number} orderId
 * @param {{ format?: 'csv' }} [opts] - default HTML invoice; `csv` for spreadsheet export
 */
export async function downloadAdminInvoice(orderId, opts = {}) {
    const q = opts.format === 'csv' ? '?format=csv' : '';
    const url = `/admin/orders/${orderId}/invoice${q}`;
    const res = await fetch(url, {
        credentials: 'same-origin',
        headers: { Accept: '*/*', 'X-Requested-With': 'XMLHttpRequest' },
    });
    if (!res.ok) {
        throw new Error(`Invoice download failed (${res.status})`);
    }
    const blob = await res.blob();
    const fallback =
        opts.format === 'csv' ? `order-${orderId}.csv` : `invoice-${orderId}.html`;
    const filename = parseFilenameFromDisposition(res.headers.get('Content-Disposition'), fallback);
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 3000);
}
