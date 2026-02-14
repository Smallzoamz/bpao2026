'use client';

import { useState, useEffect } from 'react';

// Centralized state manager for the Alert Modal
let showAlertFn = null;

/**
 * Global function to show the alert modal from anywhere
 * @param {Object} options - { title, message, type, onConfirm }
 */
export const showAlert = (options) => {
    if (showAlertFn) {
        showAlertFn(options);
    } else {
        // Fallback to native alert if component isn't mounted
        alert(options.message || options.title);
    }
};

export default function AlertModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({
        title: 'แจ้งเตือน',
        message: '',
        type: 'info', // info, warning, success, error
        onConfirm: null
    });

    useEffect(() => {
        // Register the global show function
        showAlertFn = (options) => {
            setConfig({
                title: options.title || 'แจ้งเตือน',
                message: options.message || '',
                type: options.type || 'info',
                onConfirm: options.onConfirm || null
            });
            setIsOpen(true);
        };

        return () => {
            showAlertFn = null;
        };
    }, []);

    const close = () => {
        setIsOpen(false);
        if (config.onConfirm) config.onConfirm();
    };

    const getIcon = () => {
        switch (config.type) {
            case 'warning': return '⚠️';
            case 'success': return '✅';
            case 'error': return '❌';
            default: return '🔔';
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={close}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="alert-modal-content">
                    <div className={`alert-icon-box ${config.type}`}>
                        {getIcon()}
                    </div>
                    <h3 className="alert-title">{config.title}</h3>
                    <p className="alert-message">{config.message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn-primary" onClick={close} style={{ width: '100%', borderRadius: '14px' }}>
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    );
}
