import Swal from 'sweetalert2';

export function useAlert() {
    const confirm = (message, onConfirm, options = {}) => {
        Swal.fire({
            title: options.title || 'Are you sure?',
            text: message,
            icon: options.icon || 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: options.confirmText || 'Yes, proceed',
            cancelButtonText: 'Cancel',
        }).then(result => { if (result.isConfirmed) onConfirm(); });
    };

    const success = (message) => Swal.fire({
        title: 'Done!', text: message, icon: 'success',
        confirmButtonColor: '#f97316', timer: 2000, timerProgressBar: true, showConfirmButton: false,
    });

    const error = (message) => Swal.fire({
        title: 'Error', text: message, icon: 'error', confirmButtonColor: '#f97316',
    });

    return { confirm, success, error };
}
